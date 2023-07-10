import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Post as _Post, PostState } from './post.entity';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';
import { OfferService } from '../Offer/offer.service';
import { ResponseBoolDto, ResponseDto } from '../response.dto';
import { BusinessRole } from '../Business/business.entity';
import { CategoryService } from '../Category/category.service';
import { CreatePostDto } from './create-post.dto';
import { SearchService } from '../Search/search.service';
import { postToSearch } from '../Search/search.dto';
import { SchedulerService } from '../Scheduler/scheduler.service';
import { NotificationService } from '../Notification/notification.service';
import { Offer, OfferState } from '../Offer/offer.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly authzService: AuthzService,
    private readonly offerService: OfferService,
    private readonly categoryService: CategoryService,
    private readonly searchService: SearchService,
    private readonly schedulerService: SchedulerService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post()
  async createPost(
    @Body() postDto: CreatePostDto,
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<_Post>> {
    postDto.deadline = new Date(postDto.deadline);

    const business = await this.authzService.getCurrentBusiness(authorization);
    const category = await this.categoryService.getCategoryById(
      postDto.categoryId,
    );
    if (business === null || category === null)
      return new ResponseDto<_Post>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      const post = await this.postService.createPost(
        business,
        category,
        postDto,
      );

      // Send post to algolia
      await this.searchService.saveObject(postToSearch(post));

      // Schedule expiration
      const timeoutName = `${post.id}-post-expiration`;
      const timeRemaining = postDto.deadline.getTime() - new Date().getTime();
      this.schedulerService.addTimeout(
        async () => this.cancelPostFunc(post),
        timeoutName,
        timeRemaining,
      );

      return new ResponseDto<_Post>(post);
    } else return new ResponseDto<_Post>(null);
  }

  async cancelPostFunc(post: _Post) {
    const offers = await this.offerService.getOffersByPost(post.id);

    // Delete from algolia
    await this.searchService.deleteObject(post.id.toString());

    // Cancel in database
    await this.postService.cancelPost(post.id);

    // Send notifications
    await this.notificationService.expiredPost(post);
    await this.notificationService.closedPost(post, offers);
  }

  async closePostFunc(post: _Post, selected: Offer) {
    let offers = await this.offerService.getOffersByPost(post.id);
    offers = offers.filter((offer) => offer.id !== selected.id);

    // Delete from algolia
    await this.searchService.deleteObject(post.id.toString());

    // Close in database
    await this.postService.closePost(post.id, selected);

    // Send notifications
    await this.notificationService.closedPost(post, offers);
    await this.notificationService.selectedOffer(post, selected);
  }

  @Get()
  async getMyPosts(
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<_Post[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDto<_Post[]>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      return new ResponseDto<_Post[]>(
        await this.postService.getPostsByBusiness(business.cuit),
      );
    } else return new ResponseDto<_Post[]>(null);
  }

  @Get('offered')
  async getOfferedPosts(
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<_Post[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDto<_Post[]>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      const offers = await this.offerService.getOffersByBusiness(business.cuit);
      let posts = await this.postService.getPostsByOffers(offers);

      posts = posts.map((post) => {
        if (post.selected?.business?.cuit !== business.cuit)
          post.selected = null;
        return post;
      });

      return new ResponseDto<_Post[]>(posts);
    } else return new ResponseDto<_Post[]>(null);
  }

  @Post('cancel')
  async cancelPost(
    @Body() { postId: postId }: { postId: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    const post = await this.postService.getPostById(postId);
    if (business === null || post === null) return new ResponseBoolDto(false);

    if (post.business.cuit !== business.cuit) return new ResponseBoolDto(false);

    if (
      business.role === BusinessRole.SUBSCRIBED &&
      post.state === PostState.OPEN
    ) {
      await this.cancelPostFunc(post);
      return new ResponseBoolDto(true);
    } else return new ResponseBoolDto(false);
  }

  @Post('close')
  async closePost(
    @Body()
    { postId: postId, offerId: offerId }: { postId: number; offerId: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    const post = await this.postService.getPostById(postId);
    const offer = await this.offerService.getOfferById(offerId);
    if (business === null || post === null || offer === null)
      return new ResponseBoolDto(false);

    if (post.business.cuit !== business.cuit || offer.post.id !== post.id)
      return new ResponseBoolDto(false);

    if (
      business.role === BusinessRole.SUBSCRIBED &&
      offer.post.state === PostState.OPEN &&
      offer.state === OfferState.OPEN
    ) {
      await this.closePostFunc(post, offer);
      return new ResponseBoolDto(true);
    } else return new ResponseBoolDto(false);
  }
}

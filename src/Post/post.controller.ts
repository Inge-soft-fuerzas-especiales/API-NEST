import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Post as _Post } from './post.entity';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';
import { OfferService } from '../Offer/offer.service';
import { ResponseDto } from '../response.dto';
import { BusinessRole } from '../Business/business.entity';
import { CategoryService } from '../Category/category.service';
import { CreatePostDto } from './create-post.dto';
import { SearchService } from '../Search/search.service';
import { postToSearch } from '../Search/search.dto';
import { SchedulerService } from '../Scheduler/scheduler.service';
import { NotificationService } from '../Notification/notification.service';

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
        async () => this.expirePost(post),
        timeoutName,
        timeRemaining,
      );

      return new ResponseDto<_Post>(post);
    } else return new ResponseDto<_Post>(null);
  }

  async expirePost(post: _Post) {
    const offers = await this.offerService.getOffersByPost(post.id);

    // Delete from algolia
    await this.searchService.deleteObject(post.id.toString());

    // Delete from database
    await this.offerService.deleteOffersByPost(post.id);
    await this.postService.deletePost(post.id);

    // Send notifications
    await this.notificationService.expiredPost(post);
    await this.notificationService.closedPost(post, offers);
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
      return new ResponseDto<_Post[]>(
        await this.postService.getPostsByOffers(offers),
      );
    } else return new ResponseDto<_Post[]>(null);
  }
}

import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Post as _Post } from './post.entity';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';
import { OfferService } from '../Offer/offer.service';
import { ResponseDataDto } from '../response.dto';
import { BusinessRole } from '../Business/business.entity';
import { CategoryService } from '../Category/category.service';
import { CreatePostDto } from './create-post.dto';
import { SearchService } from '../Search/search.service';
import { postToSearch } from '../Search/search.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly authzService: AuthzService,
    private readonly offerService: OfferService,
    private readonly categoryService: CategoryService,
    private readonly searchService: SearchService,
  ) {}

  @Get('category/:categoryId')
  async getByCategory(
    @Headers('authorization') authorization,
    @Param('categoryId') categoryId: number,
  ): Promise<ResponseDataDto<_Post[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDataDto<_Post[]>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      return new ResponseDataDto<_Post[]>(
        await this.postService.getByCategory(categoryId),
      );
    } else return new ResponseDataDto<_Post[]>(null);
  }

  @Get('offered')
  async getOffered(
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<_Post[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDataDto<_Post[]>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      const offers = await this.offerService.getByBusiness(business.cuit);
      return new ResponseDataDto<_Post[]>(
        await this.postService.getByOffers(offers),
      );
    } else return new ResponseDataDto<_Post[]>(null);
  }

  @Get()
  async getOwn(
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<_Post[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDataDto<_Post[]>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      return new ResponseDataDto<_Post[]>(
        await this.postService.getByBusiness(business.cuit),
      );
    } else return new ResponseDataDto<_Post[]>(null);
  }

  @Post()
  async createPost(
    @Body() postDto: CreatePostDto,
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<_Post>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    const category = await this.categoryService.getById(postDto.categoryId);
    if (business === null || category === null)
      return new ResponseDataDto<_Post>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      const post = await this.postService.createPost(
        business,
        category,
        postDto,
      );
      await this.searchService.saveObject(postToSearch(post));
      return new ResponseDataDto<_Post>(post);
    } else return new ResponseDataDto<_Post>(null);
  }
}

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
import { CreatePostDto } from './create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';
import { OfferService } from '../Offer/offer.service';

@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly authzService: AuthzService,
    private readonly offerService: OfferService,
  ) {}

  @Get('category/:category_id')
  getByCategory(@Param('category_id') category_id: number): Promise<_Post[]> {
    return this.postService.getByCategory(category_id);
  }

  @Get('offered')
  async getByOffers(@Headers('authorization') authorization): Promise<_Post[]> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    const offers = await this.offerService.getByBusiness(business.id);
    return this.postService.getByOffers(offers);
  }

  @Get()
  async getByBusiness(
    @Headers('authorization') authorization,
  ): Promise<_Post[]> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    return this.postService.getByBusiness(business.id);
  }

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Headers('authorization') authorization,
  ): Promise<_Post> {
    createPostDto.business = await this.authzService.getCurrentBusiness(
      authorization,
    );
    return this.postService.createPost(createPostDto);
  }
}

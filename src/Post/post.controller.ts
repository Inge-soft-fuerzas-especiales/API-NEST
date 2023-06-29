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
import { ResponseBoolDto, ResponseDataDto } from '../response.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly authzService: AuthzService,
    private readonly offerService: OfferService,
  ) {}

  @Get('category/:categoryId')
  async getByCategory(
    @Param('categoryId') categoryId: number,
  ): Promise<ResponseDataDto<_Post[]>> {
    return new ResponseDataDto<_Post[]>(
      await this.postService.getByCategory(categoryId),
    );
  }

  @Get('offered')
  async getByOffers(
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<_Post[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);

    if (business === null) return new ResponseDataDto<_Post[]>(null);

    const offers = await this.offerService.getByBusiness(business.cuit);
    return new ResponseDataDto<_Post[]>(
      await this.postService.getByOffers(offers),
    );
  }

  @Get()
  async getOwn(
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<_Post[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);

    if (business === null) return new ResponseDataDto<_Post[]>(null);

    return new ResponseDataDto<_Post[]>(
      await this.postService.getByBusiness(business.cuit),
    );
  }

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const business = await this.authzService.getCurrentBusiness(authorization);

    if (business === null) return new ResponseBoolDto(false);

    createPostDto.business = business;
    return new ResponseBoolDto(
      await this.postService.createPost(createPostDto),
    );
  }
}

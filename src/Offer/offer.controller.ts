import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Offer } from './offer.entity';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './create-offer.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';
import { PostService } from '../Post/post.service';

@UseGuards(AuthGuard('jwt'))
@Controller('offers')
export class OfferController {
  constructor(
    private readonly offerService: OfferService,
    private readonly authzService: AuthzService,
    private readonly postService: PostService,
  ) {}

  @Get(':post_id')
  async getByPost(
    @Param('post_id') post_id: number,
    @Headers('authorization') authorization,
  ): Promise<Offer[]> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    const post = await this.postService.getById(post_id);
    if (post.business.id === business.id)
      return this.offerService.getByPost(post_id);
    else return [];
  }

  @Get('owned/:post_id')
  async getByPostOwned(
    @Param('post_id') post_id: number,
    @Headers('authorization') authorization,
  ): Promise<Offer[]> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    return this.offerService.getByPostOwned(post_id, business.id);
  }

  @Post()
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Headers('authorization') authorization,
  ): Promise<Offer> {
    createOfferDto.business = await this.authzService.getCurrentBusiness(
      authorization,
    );
    return await this.offerService.createOffer(createOfferDto);
  }
}

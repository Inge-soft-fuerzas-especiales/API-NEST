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
import { ResponseBoolDto, ResponseDataDto } from '../response.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('offers')
export class OfferController {
  constructor(
    private readonly offerService: OfferService,
    private readonly authzService: AuthzService,
    private readonly postService: PostService,
  ) {}

  @Get(':postId')
  async getByPost(
    @Param('postId') postId: number,
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<Offer[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    const post = await this.postService.getById(postId);

    if (
      business === null ||
      post === null ||
      post.business.cuit !== business.cuit
    )
      return new ResponseDataDto<Offer[]>(null);

    return new ResponseDataDto<Offer[]>(
      await this.offerService.getByPost(postId),
    );
  }

  @Get('owned/:postId')
  async getByPostOwned(
    @Param('postId') postId: number,
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<Offer[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);

    if (business === null) return new ResponseDataDto<Offer[]>(null);

    return new ResponseDataDto<Offer[]>(
      await this.offerService.getByPostOffered(postId, business.cuit),
    );
  }

  @Post()
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const business = await this.authzService.getCurrentBusiness(authorization);

    if (business === null) return new ResponseBoolDto(false);

    createOfferDto.business = business;
    return new ResponseBoolDto(
      await this.offerService.createOffer(createOfferDto),
    );
  }
}

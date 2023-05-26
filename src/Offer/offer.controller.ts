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

@UseGuards(AuthGuard('jwt'))
@Controller('offers')
export class OfferController {
  constructor(
    private readonly offerService: OfferService,
    private readonly authzService: AuthzService,
  ) {}

  @Get(':post_id')
  getByPost(@Param('post_id') post_id: number): Promise<Offer[]> {
    return this.offerService.getOffersByPost(post_id);
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

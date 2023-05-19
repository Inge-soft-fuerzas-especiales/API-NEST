import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Offer } from './offer.entity';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './create-offer.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Get(':post_id')
  getAll(@Param('post_id') post_id: number): Promise<Offer[]> {
    return this.offerService.findOffersWithPost(post_id);
  }

  @Post()
  createOffer(@Body() createOfferDto: CreateOfferDto) {
    console.log(createOfferDto);
    return this.offerService.createOffer(createOfferDto);
  }
}

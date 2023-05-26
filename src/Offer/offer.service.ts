import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './offer.entity';
import { CreateOfferDto } from './create-offer.dto';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  findOffersWithPost(post_id: number): Promise<Offer[]> {
    return this.offerRepository.find({
      where: {
        post: {
          id: post_id,
        },
      },
    });
  }

  createOffer(offerData: CreateOfferDto): Promise<Offer> {
    const newOffer = this.offerRepository.create(offerData);
    return this.offerRepository.save(newOffer);
  }
}

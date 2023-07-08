import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer, OfferState } from './offer.entity';
import { Business } from '../Business/business.entity';
import { Post } from '../Post/post.entity';
import { CreateOfferDto } from './create-offer.dto';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  getOfferById(offerId: number): Promise<Offer> {
    return this.offerRepository.findOne({
      where: { id: offerId },
      relations: ['business', 'post'],
    });
  }

  getOffersByPost(postId: number): Promise<Offer[]> {
    return this.offerRepository.find({
      where: {
        post: { id: postId },
      },
      relations: ['business'],
    });
  }

  getOffersByBusiness(cuit: number): Promise<Offer[]> {
    return this.offerRepository.find({
      where: {
        business: { cuit: cuit },
      },
      relations: ['business', 'post'],
    });
  }

  async getMyOffersByPost(postId: number, cuit: number): Promise<Offer[]> {
    return await this.offerRepository.find({
      where: {
        post: { id: postId },
        business: { cuit: cuit },
      },
      relations: ['business'],
    });
  }

  async createOffer(
    business: Business,
    post: Post,
    offerDto: CreateOfferDto,
  ): Promise<Offer> {
    const offer = this.offerRepository.create({
      business: business,
      post: post,
      price: offerDto.price,
      description: offerDto.description,
    });
    return await this.offerRepository.save(offer);
  }

  async cancelOffer(offerId: number) {
    await this.offerRepository.update(
      { id: offerId },
      { state: OfferState.CANCELLED },
    );
  }
}

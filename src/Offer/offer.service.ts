import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './offer.entity';
import { Business } from '../Business/business.entity';
import { Post } from '../Post/post.entity';
import { CreateOfferDto } from './create-offer.dto';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  getByPost(postId: number): Promise<Offer[]> {
    return this.offerRepository.find({
      where: {
        post: { id: postId },
      },
      relations: ['business'],
    });
  }

  getByBusiness(cuit: number): Promise<Offer[]> {
    return this.offerRepository.find({
      where: {
        business: { cuit: cuit },
      },
      relations: ['business', 'post'],
    });
  }

  getByPostOffered(postId: number, cuit: number): Promise<Offer[]> {
    return this.offerRepository.find({
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
  ): Promise<Offer | null> {
    const offer = this.offerRepository.create({
      business: business,
      post: post,
      price: offerDto.price,
      description: offerDto.description,
    });
    try {
      return await this.offerRepository.save(offer);
    } catch (e) {
      return null;
    }
  }
}

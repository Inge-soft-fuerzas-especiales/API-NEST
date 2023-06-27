import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './create-post.dto';
import { Offer } from '../Offer/offer.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  getByCategory(category_id: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { category: { id: category_id } },
      relations: ['business', 'category'],
    });
  }

  getById(post_id: number): Promise<Post> {
    return this.postRepository.findOne({
      where: { id: post_id },
      relations: ['business', 'category'],
    });
  }

  getByOffers(offers: Offer[]): Promise<Post[]> {
    const post_ids = offers.map((offer) => offer.post.id);
    return this.postRepository.find({
      where: { id: In(post_ids) },
      relations: ['business', 'category'],
    });
  }

  getByBusiness(business_id: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { business: { id: business_id } },
      relations: ['business', 'category'],
    });
  }

  createPost(postData: CreatePostDto): Promise<Post> {
    const newPost = this.postRepository.create(postData);
    return this.postRepository.save(newPost);
  }
}

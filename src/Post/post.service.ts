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

  getByCategory(categoryId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { category: { id: categoryId } },
      relations: ['business', 'category'],
    });
  }

  getById(postId: number): Promise<Post> {
    return this.postRepository.findOne({
      where: { id: postId },
      relations: ['business', 'category'],
    });
  }

  getByOffers(offers: Offer[]): Promise<Post[]> {
    const postIds = offers.map((offer) => offer.post.id);
    return this.postRepository.find({
      where: { id: In(postIds) },
      relations: ['business', 'category'],
    });
  }

  getByBusiness(cuit: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { business: { cuit: cuit } },
      relations: ['business', 'category'],
    });
  }

  async createPost(postData: CreatePostDto): Promise<boolean> {
    const post = this.postRepository.create(postData);
    try {
      await this.postRepository.insert(post);
    } catch (e) {
      return false;
    }
    return true;
  }
}

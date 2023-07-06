import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from './post.entity';
import { Offer } from '../Offer/offer.entity';
import { Business } from '../Business/business.entity';
import { Category } from '../Category/category.entity';
import { CreatePostDto } from './create-post.dto';

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

  getPostById(postId: number): Promise<Post> {
    return this.postRepository.findOne({
      where: { id: postId },
      relations: ['business', 'category'],
    });
  }

  getPostsByOffers(offers: Offer[]): Promise<Post[]> {
    const postIds = offers.map((offer) => offer.post.id);
    return this.postRepository.find({
      where: { id: In(postIds) },
      relations: ['business', 'category'],
    });
  }

  getPostsByBusiness(cuit: number): Promise<Post[]> {
    return this.postRepository.find({
      where: { business: { cuit: cuit } },
      relations: ['business', 'category'],
    });
  }

  async createPost(
    business: Business,
    category: Category,
    postDto: CreatePostDto,
  ): Promise<Post | null> {
    const post = this.postRepository.create({
      business: business,
      category: category,
      item: postDto.item,
      description: postDto.description,
      budgetMin: postDto.budgetMin,
      budgetMax: postDto.budgetMax,
      deadline: postDto.deadline,
    });
    try {
      return await this.postRepository.save(post);
    } catch (e) {
      return null;
    }
  }

  async deletePost(id: number) {
    await this.postRepository.delete({ id: id });
  }
}

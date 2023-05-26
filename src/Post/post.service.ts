import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  getAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  getByBusiness(business_id: number): Promise<Post[]> {
    return this.postRepository.findBy({ business: { id: business_id } });
  }

  createPost(postData: CreatePostDto): Promise<Post> {
    const newPost = this.postRepository.create(postData);
    return this.postRepository.save(newPost);
  }
}

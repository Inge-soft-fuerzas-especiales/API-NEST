import { Body, Controller, Get, Post } from '@nestjs/common';
import { Post as _Post } from './post.entity';
import { PostService } from './post.service';
import { CreatePostDto } from './create-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAll(): Promise<_Post[]> {
    return this.postService.getAll();
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }
}

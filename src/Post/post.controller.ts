import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Post as _Post } from './post.entity';
import { PostService } from './post.service';
import { CreatePostDto } from './create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';

@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly authzService: AuthzService,
  ) {}

  @Get('all')
  getAll(): Promise<_Post[]> {
    return this.postService.getAll();
  }

  @Get()
  async getOwn(@Headers('authorization') authorization): Promise<_Post[]> {
    const user = await this.authzService.getCurrentUser(authorization);
    return await this.postService.getByBusiness(user.employed_at.id);
  }

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Headers('authorization') authorization,
  ): Promise<_Post> {
    createPostDto.business = await this.authzService.getCurrentBusiness(
      authorization,
    );
    return this.postService.createPost(createPostDto);
  }
}

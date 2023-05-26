import { Body, Controller, Get, Headers, Post, UseGuards } from "@nestjs/common";
import { Post as _Post } from './post.entity';
import { PostService } from './post.service';
import { CreatePostDto } from './create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';
import { UserService } from '../User/user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
    private readonly authzService: AuthzService,
  ) {}

  @Get('all')
  getAll(): Promise<_Post[]> {
    return this.postService.getAll();
  }

  @Get()
  async getOwn(@Headers('authorization') authorization): Promise<_Post[]> {
    const authz_id = this.authzService.getUserId(authorization);
    const user = await this.userService.getByAuthzId(authz_id);
    return await this.postService.getByBusiness(user.employed_at.id);
  }

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }
}

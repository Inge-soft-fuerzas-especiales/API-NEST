import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';
import { User } from './user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly authzService: AuthzService) {}

  @Get()
  async getOwn(@Headers('authorization') authorization): Promise<User> {
    return this.authzService.getCurrentUser(authorization);
  }
}

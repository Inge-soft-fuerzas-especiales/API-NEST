import { Body, Controller, Get, Headers, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';
import { User } from './user.entity';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(
    private readonly authzService: AuthzService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getOwn(@Headers('authorization') authorization): Promise<User> {
    return this.authzService.getCurrentUser(authorization);
  }

  @Put()
  async addDni(@Body() { dni: dni }, @Headers('authorization') authorization) {
    const user = await this.authzService.getCurrentUser(authorization);
    if (user.dni === null) user.dni = dni;
    await this.userService.update(user);
  }

  @Get('verify')
  async getUnverified(@Headers('authorization') authorization) {
    const user = await this.authzService.getCurrentUser(authorization);
    if (!user.admin) throw new Error('Authorization rejected');
    return await this.userService.getUnverified();
  }

  @Put('verify')
  async verifyUser(
    @Body() { id: id },
    @Headers('authorization') authorization,
  ) {
    const user = await this.authzService.getCurrentUser(authorization);
    if (!user.admin) throw new Error('Authorization rejected');
    const target = await this.userService.getById(id);
    target.verified = true;
    await this.userService.update(target);
  }
}

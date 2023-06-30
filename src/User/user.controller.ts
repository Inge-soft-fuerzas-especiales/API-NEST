import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';
import { User } from './user.entity';
import { UserService } from './user.service';
import { ResponseBoolDto, ResponseDataDto } from '../response.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(
    private readonly authzService: AuthzService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async createUser(
    @Body()
    {
      dni: dni,
      name: name,
      surname: surname,
    }: { dni: number; name: string; surname: string },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const authzId = this.authzService.getUserId(authorization);

    return new ResponseBoolDto(
      await this.userService.createUser(authzId, dni, name, surname),
    );
  }

  @Get()
  async getOwn(
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<User>> {
    return new ResponseDataDto<User>(
      await this.authzService.getCurrentUser(authorization),
    );
  }

  @Get('verify')
  async getUnverified(
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<User[]>> {
    const user = await this.authzService.getCurrentUser(authorization);

    if (user === null || !user.admin) return new ResponseDataDto<User[]>(null);

    return new ResponseDataDto<User[]>(await this.userService.getUnverified());
  }

  @Put('verify')
  async verifyUser(
    @Body() { dni: dni }: { dni: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const user = await this.authzService.getCurrentUser(authorization);

    if (user === null || !user.admin) return new ResponseBoolDto(false);

    return new ResponseBoolDto(await this.userService.verify(dni));
  }
}

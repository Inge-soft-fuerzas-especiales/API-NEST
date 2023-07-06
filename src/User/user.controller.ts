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
import { User, UserRole } from './user.entity';
import { UserService } from './user.service';
import { ResponseBoolDto, ResponseDto } from '../response.dto';

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
  ): Promise<ResponseDto<User>> {
    const authzId = this.authzService.getUserAuthzId(authorization);

    return new ResponseDto<User>(
      await this.userService.createUser(authzId, dni, name, surname),
    );
  }

  @Get()
  async getUser(
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<User>> {
    return new ResponseDto<User>(
      await this.authzService.getCurrentUser(authorization),
    );
  }

  @Get('verify')
  async getUnverifiedUsers(
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<User[]>> {
    const user = await this.authzService.getCurrentUser(authorization);
    if (user === null) return new ResponseDto<User[]>(null);

    if (user.role === UserRole.ADMIN) {
      return new ResponseDto<User[]>(
        await this.userService.getUnverifiedUsers(),
      );
    } else return new ResponseDto<User[]>(null);
  }

  @Put('verify')
  async verifyUser(
    @Body() { dni: dni }: { dni: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const user = await this.authzService.getCurrentUser(authorization);
    const target = await this.userService.getUserByDni(dni);
    if (user === null || target === null) return new ResponseBoolDto(false);

    if (user.role === UserRole.ADMIN && target.role === UserRole.UNVERIFIED) {
      return new ResponseBoolDto(await this.userService.verifyUser(dni));
    } else return new ResponseBoolDto(false);
  }
}

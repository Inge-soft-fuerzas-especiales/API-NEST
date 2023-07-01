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
    const authzId = this.authzService.getUserAuthzId(authorization);

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
    if (user === null) return new ResponseDataDto<User[]>(null);

    if (user.role === UserRole.ADMIN) {
      return new ResponseDataDto<User[]>(
        await this.userService.getUnverified(),
      );
    } else return new ResponseDataDto<User[]>(null);
  }

  @Put('verify')
  async verifyUser(
    @Body() { dni: dni }: { dni: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const user = await this.authzService.getCurrentUser(authorization);
    const target = await this.userService.getByDni(dni);
    if (user === null || target === null) return new ResponseBoolDto(false);

    if (user.role === UserRole.ADMIN && target.role === UserRole.UNVERIFIED) {
      return new ResponseBoolDto(await this.userService.verify(dni));
    } else return new ResponseBoolDto(false);
  }
}

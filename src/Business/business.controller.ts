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
import { Business } from './business.entity';
import { AuthzService } from '../Authz/authz.service';
import { BusinessService } from './business.service';
import { UserService } from '../User/user.service';
import { ResponseBoolDto, ResponseDataDto } from '../response.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('business')
export class BusinessController {
  constructor(
    private readonly authzService: AuthzService,
    private readonly businessService: BusinessService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Body() { name: name, cuit: cuit }: { name: string; cuit: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const user = await this.authzService.getCurrentUser(authorization);

    if (user === null || user.employedAt !== null || user.owns !== null)
      return new ResponseBoolDto(false);

    return new ResponseBoolDto(
      await this.businessService.create(user, name, cuit),
    );
  }

  @Get()
  async getOwn(
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<Business>> {
    return new ResponseDataDto(
      await this.authzService.getCurrentBusiness(authorization),
    );
  }

  @Put('employee/add')
  async addEmployee(
    @Body() { dni: dni }: { dni: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const user = await this.userService.getByDni(dni);
    const business = await this.authzService.getCurrentBusiness(authorization);

    if (user === null || business === null || user.employedAt !== null)
      return new ResponseBoolDto(false);

    return new ResponseBoolDto(
      await this.userService.setEmployment(dni, business),
    );
  }

  @Put('employee/remove')
  async removeEmployee(
    @Body() { dni: dni }: { dni: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const user = await this.userService.getByDni(dni);
    const business = await this.authzService.getCurrentBusiness(authorization);

    if (
      user === null ||
      business === null ||
      user.employedAt === null ||
      user.employedAt.cuit !== business.cuit
    )
      return new ResponseBoolDto(false);

    return new ResponseBoolDto(await this.userService.setEmployment(dni, null));
  }

  @Get('verify')
  async getUnverified(
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<Business[]>> {
    const user = await this.authzService.getCurrentUser(authorization);

    if (user === null || !user.admin)
      return new ResponseDataDto<Business[]>(null);

    return new ResponseDataDto<Business[]>(
      await this.businessService.getUnverified(),
    );
  }

  @Put('verify')
  async verifyBusiness(
    @Body() { cuit: cuit }: { cuit: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const user = await this.authzService.getCurrentUser(authorization);

    if (user === null || !user.admin) return new ResponseBoolDto(false);

    return new ResponseBoolDto(await this.businessService.verify(cuit));
  }
}

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
import { Business, BusinessRole } from './business.entity';
import { AuthzService } from '../Authz/authz.service';
import { BusinessService } from './business.service';
import { UserService } from '../User/user.service';
import { ResponseBoolDto, ResponseDataDto } from '../response.dto';
import { UserRole } from '../User/user.entity';

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
    if (user === null) return new ResponseBoolDto(false);

    if (user.role === UserRole.VERIFIED) {
      return new ResponseBoolDto(
        await this.businessService.create(cuit, name, user),
      );
    } else return new ResponseBoolDto(false);
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
    if (user === null || business === null) return new ResponseBoolDto(false);

    if (
      user.role === UserRole.VERIFIED &&
      business.role === BusinessRole.SUBSCRIBED
    ) {
      return new ResponseBoolDto(
        await this.userService.setEmployed(dni, business),
      );
    } else return new ResponseBoolDto(false);
  }

  @Put('employee/remove')
  async removeEmployee(
    @Body() { dni: dni }: { dni: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const user = await this.userService.getByDni(dni);
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (user === null || business === null) return new ResponseBoolDto(false);

    if (
      user.role === UserRole.EMPLOYEE &&
      (business.role === BusinessRole.VERIFIED ||
        business.role === BusinessRole.SUBSCRIBED)
    ) {
      if (user.business.cuit === business.cuit)
        return new ResponseBoolDto(await this.userService.clearEmployed(dni));
      else return new ResponseBoolDto(false);
    } else return new ResponseBoolDto(false);
  }

  @Get('verify')
  async getUnverified(
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<Business[]>> {
    const user = await this.authzService.getCurrentUser(authorization);
    if (user === null) return new ResponseDataDto<Business[]>(null);

    if (user.role === UserRole.ADMIN) {
      return new ResponseDataDto<Business[]>(
        await this.businessService.getUnverified(),
      );
    } else return new ResponseDataDto<Business[]>(null);
  }

  @Put('verify')
  async verifyBusiness(
    @Body() { cuit: cuit }: { cuit: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const user = await this.authzService.getCurrentUser(authorization);
    const business = await this.businessService.getByCuit(cuit);
    if (user === null || business === null) return new ResponseBoolDto(false);

    if (
      user.role === UserRole.ADMIN &&
      business.role === BusinessRole.UNVERIFIED
    ) {
      return new ResponseBoolDto(await this.businessService.verify(cuit));
    } else return new ResponseBoolDto(false);
  }
}

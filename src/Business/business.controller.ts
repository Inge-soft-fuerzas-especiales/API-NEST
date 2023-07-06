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
import { ResponseBoolDto, ResponseDto } from '../response.dto';
import { User, UserRole } from '../User/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('business')
export class BusinessController {
  constructor(
    private readonly authzService: AuthzService,
    private readonly businessService: BusinessService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async createBusiness(
    @Body() { name: name, cuit: cuit }: { name: string; cuit: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<Business>> {
    const user = await this.authzService.getCurrentUser(authorization);
    if (user === null) return new ResponseDto<Business>(null);

    if (user.role === UserRole.VERIFIED) {
      return new ResponseDto<Business>(
        await this.businessService.create(cuit, name, user),
      );
    } else return new ResponseDto<Business>(null);
  }

  @Get()
  async getBusiness(
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<Business>> {
    return new ResponseDto(
      await this.authzService.getCurrentBusiness(authorization),
    );
  }

  @Get('employee')
  async getEmployees(
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<User[]>> {
    const user = await this.authzService.getCurrentUser(authorization);
    if (user === null) return new ResponseDto<User[]>(null);

    if (
      user.role === UserRole.OWNER &&
      user.business.role !== BusinessRole.UNVERIFIED
    ) {
      return new ResponseDto<User[]>(
        await this.userService.getEmployees(user.business.cuit),
      );
    } else return new ResponseDto<User[]>(null);
  }

  @Put('employee')
  async findEmployee(
    @Body() { dni: dni }: { dni: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<User>> {
    const user = await this.userService.getUserByDni(dni);
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (user === null || business === null) return new ResponseDto<User>(null);

    if (
      user.role === UserRole.VERIFIED &&
      business.role === BusinessRole.SUBSCRIBED
    ) {
      return new ResponseDto<User>(user);
    } else return new ResponseDto<User>(null);
  }

  @Put('employee/add')
  async addEmployee(
    @Body() { dni: dni }: { dni: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<User>> {
    const user = await this.userService.getUserByDni(dni);
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (user === null || business === null) return new ResponseDto<User>(null);

    if (
      user.role === UserRole.VERIFIED &&
      business.role === BusinessRole.SUBSCRIBED
    ) {
      const success = await this.userService.setEmployed(dni, business);
      if (success) {
        user.role = UserRole.EMPLOYEE;
        user.business = business;
        return new ResponseDto<User>(user);
      } else return new ResponseDto<User>(null);
    } else return new ResponseDto<User>(null);
  }

  @Put('employee/remove')
  async removeEmployee(
    @Body() { dni: dni }: { dni: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<User>> {
    const user = await this.userService.getUserByDni(dni);
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (user === null || business === null) return new ResponseDto<User>(null);

    if (
      user.role === UserRole.EMPLOYEE &&
      (business.role === BusinessRole.VERIFIED ||
        business.role === BusinessRole.SUBSCRIBED)
    ) {
      if (user.business.cuit === business.cuit)
        return new ResponseDto<User>(await this.userService.clearEmployed(dni));
      else return new ResponseDto<User>(null);
    } else return new ResponseDto<User>(null);
  }

  @Get('verify')
  async getUnverifiedBusinesses(
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<Business[]>> {
    const user = await this.authzService.getCurrentUser(authorization);
    if (user === null) return new ResponseDto<Business[]>(null);

    if (user.role === UserRole.ADMIN) {
      return new ResponseDto<Business[]>(
        await this.businessService.getUnverifiedBusinesses(),
      );
    } else return new ResponseDto<Business[]>(null);
  }

  @Put('verify')
  async verifyBusiness(
    @Body() { cuit: cuit }: { cuit: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const user = await this.authzService.getCurrentUser(authorization);
    const business = await this.businessService.getBusinessByCuit(cuit);
    if (user === null || business === null) return new ResponseBoolDto(false);

    if (
      user.role === UserRole.ADMIN &&
      business.role === BusinessRole.UNVERIFIED
    ) {
      return new ResponseBoolDto(
        await this.businessService.verifyBusiness(cuit),
      );
    } else return new ResponseBoolDto(false);
  }
}

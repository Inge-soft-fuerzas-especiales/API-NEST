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
    @Body() { name: name }: { name: string },
    @Headers('authorization') authorization,
  ) {
    const user = await this.authzService.getCurrentUser(authorization);
    if (user.employedAt === null && user.owns === null)
      await this.businessService.create(user, name);
  }

  @Get()
  getOwn(@Headers('authorization') authorization): Promise<Business> {
    return this.authzService.getCurrentBusiness(authorization);
  }

  @Put()
  async addCuit(
    @Body() { cuit: cuit }: { cuit: number },
    @Headers('authorization') authorization,
  ) {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business.cuit === null) business.cuit = cuit;
    await this.businessService.update(business);
  }

  @Put('employee/add')
  async addEmployee(
    @Body() { id: id }: { id: number },
    @Headers('authorization') authorization,
  ) {
    const user = await this.userService.getById(id);
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (user.employedAt === null) user.employedAt = business;
    await this.userService.update(user);
  }

  @Put('employee/remove')
  async removeEmployee(
    @Body() { id: id }: { id: number },
    @Headers('authorization') authorization,
  ) {
    const user = await this.userService.getById(id);
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (user.employedAt.id === business.id) user.employedAt = null;
    await this.userService.update(user);
  }

  @Get('verify')
  async getUnverified(@Headers('authorization') authorization) {
    const user = await this.authzService.getCurrentUser(authorization);
    if (!user.admin) throw new Error('Authorization rejected');
    return await this.businessService.getUnverified();
  }

  @Put('verify')
  async verifyBusiness(
    @Body() { id: id }: { id: number },
    @Headers('authorization') authorization,
  ) {
    const user = await this.authzService.getCurrentUser(authorization);
    if (!user.admin) throw new Error('Authorization rejected');
    const target = await this.businessService.getById(id);
    target.verified = true;
    await this.businessService.update(target);
  }
}

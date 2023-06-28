import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
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

  @Get()
  getOwn(@Headers('authorization') authorization): Promise<Business> {
    return this.authzService.getCurrentBusiness(authorization);
  }

  @Post()
  async addCuit(
    @Body() { cuit: cuit }: { cuit: number },
    @Headers('authorization') authorization,
  ) {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business.cuit === null) business.cuit = cuit;
    await this.businessService.update(business);
  }

  @Get('verify')
  async getUnverified(@Headers('authorization') authorization) {
    const user = await this.authzService.getCurrentUser(authorization);
    if (!user.admin) throw new Error('Authorization rejected');
    return await this.businessService.getUnverified();
  }

  @Post('verify')
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

import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Business } from './business.entity';
import { AuthzService } from '../Authz/authz.service';

@UseGuards(AuthGuard('jwt'))
@Controller('business')
export class BusinessController {
  constructor(private readonly authzService: AuthzService) {}

  @Get()
  getOwn(@Headers('authorization') authorization): Promise<Business> {
    return this.authzService.getCurrentBusiness(authorization);
  }
}

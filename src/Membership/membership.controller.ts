import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MembershipService } from './membership.service';
import { Membership } from './memebership.entity';
import { AuthzService } from '../Authz/authz.service';

@UseGuards(AuthGuard('jwt'))
@Controller('membership')
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly authzService: AuthzService,
  ) {}

  @Get()
  async getOwn(@Headers('authorization') authorization): Promise<Membership> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    return this.membershipService.getByBusiness(business.id);
  }
}

import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MembershipService } from './membership.service';
import { Membership } from './memebership.entity';
import { AuthzService } from '../Authz/authz.service';
import { ResponseDataDto } from '../response.dto';
import { BusinessRole } from '../Business/business.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('membership')
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly authzService: AuthzService,
  ) {}

  @Get()
  async getOwn(
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<Membership>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDataDto<Membership>(null);

    if (business.role === BusinessRole.SUBSCRIBED)
      return new ResponseDataDto<Membership>(business.membership);
    else return new ResponseDataDto<Membership>(null);
  }
}

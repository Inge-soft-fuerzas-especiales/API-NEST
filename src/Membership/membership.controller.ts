import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MembershipService } from './membership.service';
import { Membership } from './memebership.entity';
import { AuthzService } from '../Authz/authz.service';
import { ResponseDto } from '../response.dto';
import { BusinessRole } from '../Business/business.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('membership')
export class MembershipController {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly authzService: AuthzService,
  ) {}

  @Get()
  async getMembership(
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<Membership>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDto<Membership>(null);

    if (business.role === BusinessRole.SUBSCRIBED)
      return new ResponseDto<Membership>(business.membership);
    else return new ResponseDto<Membership>(null);
  }
}

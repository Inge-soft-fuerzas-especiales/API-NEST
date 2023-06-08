import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../User/user.service';
import { User } from '../User/user.entity';
import { Business } from '../Business/business.entity';
import { BusinessService } from '../Business/business.service';

@Injectable()
export class AuthzService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly businessService: BusinessService,
  ) {}

  getUserId(authorization: string): string {
    const accessToken = authorization.split(' ')[1];
    const decodedToken = this.jwtService.decode(accessToken);
    return decodedToken.sub;
  }

  async getCurrentUser(authorization: string): Promise<User> {
    const authz_id = this.getUserId(authorization);
    return await this.userService.getByAuthzId(authz_id);
  }

  async getCurrentBusiness(authorization: string): Promise<Business> {
    const user = await this.getCurrentUser(authorization);
    if (user.owns != null)
      return await this.businessService.getById(user.owns.id);
    if (user.employed_at != null)
      return await this.businessService.getById(user.employed_at.id);
    return null;
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../User/user.service';
import { User, UserRole } from '../User/user.entity';
import { Business } from '../Business/business.entity';
import { BusinessService } from '../Business/business.service';

@Injectable()
export class AuthzService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly businessService: BusinessService,
  ) {}

  getUserAuthzId(authorization: string): string {
    const accessToken = authorization.split(' ')[1];
    const decodedToken = this.jwtService.decode(accessToken);
    return decodedToken.sub;
  }

  async getCurrentUser(authorization: string): Promise<User> {
    const authzId = this.getUserAuthzId(authorization);
    return await this.userService.getByAuthzId(authzId);
  }

  async getCurrentBusiness(authorization: string): Promise<Business> {
    const user = await this.getCurrentUser(authorization);
    if (user === null) return null;

    switch (user.role) {
      case UserRole.OWNER:
        return await this.businessService.getByCuit(user.owns.cuit);
      case UserRole.EMPLOYEE:
        return await this.businessService.getByCuit(user.employedAt.cuit);
      default:
        return null;
    }
  }
}

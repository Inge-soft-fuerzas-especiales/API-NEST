import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthzService {
  constructor(private readonly jwtService: JwtService) {}

  getUserId(authorization: string): string {
    const accessToken = authorization.split(' ')[1];
    const decodedToken = this.jwtService.decode(accessToken);
    return decodedToken.sub;
  }
}

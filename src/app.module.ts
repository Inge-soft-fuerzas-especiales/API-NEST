import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './Category/category.entity';
import { CategoryController } from './Category/category.controller';
import { CategoryService } from './Category/category.service';
import { Post } from './Post/post.entity';
import { Offer } from './Offer/offer.entity';
import { PostController } from './Post/post.controller';
import { OfferController } from './Offer/offer.controller';
import { PostService } from './Post/post.service';
import { OfferService } from './Offer/offer.service';
import { Business } from './Business/business.entity';
import { Membership } from './Membership/memebership.entity';
import { User } from './User/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './Authz/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './User/user.service';
import { AuthzService } from './Authz/authz.service';
import { BusinessService } from './Business/business.service';
import { MembershipService } from './Membership/membership.service';
import { BusinessController } from "./Business/business.controller";
import { MembershipController } from "./Membership/membership.controller";
import { UserController } from "./User/user.controller";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'fuerzasespeciales-ingesoft.database.windows.net',
      port: 1433,
      username: 'ingesoftadmin',
      password: 'tequeremosbotti<3',
      database: 'IngeSoft-FuerzasEspeciales',
      entities: [Business, Category, Membership, Offer, Post, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Business,
      Category,
      Membership,
      Offer,
      Post,
      User,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    BusinessController,
    CategoryController,
    MembershipController,
    OfferController,
    PostController,
    UserController,
  ],
  providers: [
    AuthzService,
    JwtService,
    JwtStrategy,
    BusinessService,
    CategoryService,
    MembershipService,
    OfferService,
    PostService,
    UserService,
  ],
})
export class AppModule {}

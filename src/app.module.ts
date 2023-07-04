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
import { BusinessController } from './Business/business.controller';
import { MembershipController } from './Membership/membership.controller';
import { UserController } from './User/user.controller';
import { SearchController } from './Search/search.controller';
import { SearchService } from './Search/search.service';
import { NotificationService } from './Notification/notification.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-empty-fog-495166.us-east-1.postgres.vercel-storage.com',
      port: 5432,
      username: 'default',
      password: 'Ljz3mDWYlb8Z',
      database: 'verceldb',
      entities: [Business, Category, Membership, Offer, Post, User],
      synchronize: true,
      ssl: true,
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
    SearchController,
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
    SearchService,
    NotificationService,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Post } from './post.entity';
import { Offer } from './offer.entity';
import { PostController } from './post.controller';
import { OfferController } from './offer.controller';
import { PostService } from './post.service';
import { OfferService } from './offer.service';
import { AuthzModule } from './authz.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'fuerzasespeciales-ingesoft.database.windows.net',
      port: 1433,
      username: 'ingesoftadmin',
      password: 'tequeremosbotti<3',
      database: 'IngeSoft-FuerzasEspeciales',
      entities: [Category, Post, Offer],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Category, Post, Offer]),
    AuthzModule,
  ],
  controllers: [CategoryController, PostController, OfferController],
  providers: [CategoryService, PostService, OfferService],
})
export class AppModule {}

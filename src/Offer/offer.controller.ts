import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Offer } from './offer.entity';
import { OfferService } from './offer.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';
import { PostService } from '../Post/post.service';
import { ResponseDataDto } from '../response.dto';
import { BusinessRole } from '../Business/business.entity';
import { CreateOfferDto } from './create-offer.dto';
import { NotificationService } from '../Notification/notification.service';

@UseGuards(AuthGuard('jwt'))
@Controller('offers')
export class OfferController {
  constructor(
    private readonly offerService: OfferService,
    private readonly authzService: AuthzService,
    private readonly postService: PostService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get(':postId')
  async getByPost(
    @Param('postId') postId: number,
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<Offer[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    const post = await this.postService.getById(postId);
    if (business === null || post === null)
      return new ResponseDataDto<Offer[]>(null);

    if (business.cuit !== post.business.cuit)
      return new ResponseDataDto<Offer[]>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      return new ResponseDataDto<Offer[]>(
        await this.offerService.getByPost(postId),
      );
    } else return new ResponseDataDto<Offer[]>(null);
  }

  @Get('owned/:postId')
  async getByPostOffered(
    @Param('postId') postId: number,
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<Offer[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDataDto<Offer[]>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      return new ResponseDataDto<Offer[]>(
        await this.offerService.getByPostOffered(postId, business.cuit),
      );
    } else return new ResponseDataDto<Offer[]>(null);
  }

  @Post()
  async createOffer(
    @Body() offerDto: CreateOfferDto,
    @Headers('authorization') authorization,
  ): Promise<ResponseDataDto<Offer>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    const post = await this.postService.getById(offerDto.postId);
    if (business === null || post === null)
      return new ResponseDataDto<Offer>(null);

    if (business.cuit === post.business.cuit)
      return new ResponseDataDto<Offer>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      const offer = await this.offerService.createOffer(
        business,
        post,
        offerDto,
      );

      if (offer !== null) await this.notificationService.newOffer(offer);
      return new ResponseDataDto<Offer>(offer);
    } else return new ResponseDataDto<Offer>(null);
  }
}

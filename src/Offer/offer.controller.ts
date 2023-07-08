import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Offer, OfferState } from './offer.entity';
import { OfferService } from './offer.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthzService } from '../Authz/authz.service';
import { PostService } from '../Post/post.service';
import { ResponseBoolDto, ResponseDto } from '../response.dto';
import { BusinessRole } from '../Business/business.entity';
import { CreateOfferDto } from './create-offer.dto';
import { NotificationService } from '../Notification/notification.service';
import { PostState } from '../Post/post.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('offers')
export class OfferController {
  constructor(
    private readonly offerService: OfferService,
    private readonly authzService: AuthzService,
    private readonly postService: PostService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post()
  async createOffer(
    @Body() offerDto: CreateOfferDto,
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<Offer>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    const post = await this.postService.getPostById(offerDto.postId);
    if (business === null || post === null) return new ResponseDto<Offer>(null);

    if (business.cuit === post.business.cuit)
      return new ResponseDto<Offer>(null);

    if (
      business.role === BusinessRole.SUBSCRIBED &&
      post.state === PostState.OPEN
    ) {
      const offer = await this.offerService.createOffer(
        business,
        post,
        offerDto,
      );

      if (offer !== null) await this.notificationService.newOffer(offer);
      return new ResponseDto<Offer>(offer);
    } else return new ResponseDto<Offer>(null);
  }

  @Get(':postId')
  async getOffersByPost(
    @Param('postId') postId: number,
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<Offer[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    const post = await this.postService.getPostById(postId);
    if (business === null || post === null)
      return new ResponseDto<Offer[]>(null);

    if (business.cuit !== post.business.cuit)
      return new ResponseDto<Offer[]>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      return new ResponseDto<Offer[]>(
        await this.offerService.getOffersByPost(postId),
      );
    } else return new ResponseDto<Offer[]>(null);
  }

  @Get('owned/:postId')
  async getMyOffersByPost(
    @Param('postId') postId: number,
    @Headers('authorization') authorization,
  ): Promise<ResponseDto<Offer[]>> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    if (business === null) return new ResponseDto<Offer[]>(null);

    if (business.role === BusinessRole.SUBSCRIBED) {
      return new ResponseDto<Offer[]>(
        await this.offerService.getMyOffersByPost(postId, business.cuit),
      );
    } else return new ResponseDto<Offer[]>(null);
  }

  @Post('cancel')
  async cancelOffer(
    @Body() { offerId: offerId }: { offerId: number },
    @Headers('authorization') authorization,
  ): Promise<ResponseBoolDto> {
    const business = await this.authzService.getCurrentBusiness(authorization);
    const offer = await this.offerService.getOfferById(offerId);
    if (business === null || offer === null) return new ResponseBoolDto(false);

    if (offer.business.cuit !== business.cuit)
      return new ResponseBoolDto(false);

    if (
      business.role === BusinessRole.SUBSCRIBED &&
      offer.post.state === PostState.OPEN &&
      offer.state === OfferState.OPEN
    ) {
      await this.offerService.cancelOffer(offerId);
      await this.notificationService.cancelledOffer(offer);
      return new ResponseBoolDto(true);
    } else return new ResponseBoolDto(false);
  }
}

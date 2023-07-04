import { Novu } from '@novu/node';
import { Injectable } from '@nestjs/common';
import { Offer } from '../Offer/offer.entity';

@Injectable()
export class NotificationService {
  async newOffer(offer: Offer) {
    const novu = new Novu('392b8bcec4cb70ce8dd8b9125690cb3f');

    await novu.trigger('new-offer', {
      to: {
        subscriberId: offer.post.business.cuit.toString(),
      },
      payload: {
        postItem: offer.post.item,
        businessName: offer.business.name,
      },
    });
  }
}

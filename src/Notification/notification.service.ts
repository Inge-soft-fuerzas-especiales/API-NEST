import { Novu } from '@novu/node';
import { Injectable } from '@nestjs/common';
import { Offer } from '../Offer/offer.entity';
import { Post } from '../Post/post.entity';

@Injectable()
export class NotificationService {
  private apiKey = process.env.NOVU_KEY;

  async newOffer(offer: Offer) {
    const novu = new Novu(this.apiKey);

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

  async cancelledOffer(offer: Offer) {
    const novu = new Novu(this.apiKey);

    await novu.trigger('cancelled-offer', {
      to: {
        subscriberId: offer.post.business.cuit.toString(),
      },
      payload: {
        postItem: offer.post.item,
        businessName: offer.business.name,
      },
    });
  }

  async selectedOffer(post: Post, offer: Offer) {
    const novu = new Novu(this.apiKey);

    await novu.trigger('selected-offer', {
      to: {
        subscriberId: offer.business.cuit.toString(),
      },
      payload: {
        postItem: post.item,
        businessName: post.business.name,
      },
    });
  }

  async expiredPost(post: Post) {
    const novu = new Novu(this.apiKey);

    await novu.trigger('expired-post', {
      to: {
        subscriberId: post.business.cuit.toString(),
      },
      payload: {
        postItem: post.item,
        deadline: post.deadline.toLocaleDateString('es-AR', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        }),
      },
    });
  }

  async closedPost(post: Post, offers: Offer[]) {
    const novu = new Novu(this.apiKey);

    const offerers = new Set(offers.map((offer) => offer.business.cuit));

    for (const cuit of offerers) {
      await novu.trigger('closed-post', {
        to: {
          subscriberId: cuit.toString(),
        },
        payload: {
          postItem: post.item,
          businessName: post.business.name,
        },
      });
    }
  }
}

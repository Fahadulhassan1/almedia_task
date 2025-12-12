import { BaseOfferProvider } from './base.provider';
import { Offer } from '../../offer.entity';
import { generateSlug } from '../utils/slug.generator';
import { PROVIDER_ERRORS, HTTP_ERRORS } from '../constants/error.constants';
import { PROVIDER_NAMES } from '../constants/api.constants';

interface Offer1Payload {
  query: {
    pubid: string;
    appid: number;
    country: string;
    platform: string;
  };
  response: {
    currency_name: string;
    offers_count: number;
    offers: Offer1Offer[];
  };
}

interface Offer1Offer {
  offer_id: string;
  offer_name: string;
  offer_desc: string;
  call_to_action: string;
  disclaimer?: string;
  offer_url: string;
  offer_url_easy: string;
  payout: number;
  payout_type: string;
  amount: number;
  image_url: string;
  image_url_220x124: string;
  countries: string[];
  platform: 'desktop' | 'mobile';
  device: string;
  category: Record<string, string>;
  last_modified: number;
  preview_url: string;
  package_id: string;
  verticals: Array<{
    vertical_id: string;
    vertical_name: string;
  }>;
}

export class Offer1Provider extends BaseOfferProvider {
  readonly providerName = PROVIDER_NAMES.OFFER1;

  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async fetchOffers(): Promise<Offer1Payload> {
    // In a real implementation, this would make an HTTP request
    // For now, we'll assume the payload structure matches what was provided
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error(PROVIDER_ERRORS.FETCH_FAILED(this.providerName, response.statusText));
    }
    return (await response.json()) as Offer1Payload;
  }

  transformOffers(payload: Offer1Payload): Offer[] {
    if (!payload?.response?.offers || !Array.isArray(payload.response.offers)) {
      return [];
    }

    return payload.response.offers.map((offer) => {
      const transformedOffer = new Offer();
      
      transformedOffer.externalOfferId = offer.offer_id;
      transformedOffer.name = offer.offer_name;
      transformedOffer.slug = generateSlug(offer.offer_name);
      transformedOffer.description = offer.offer_desc || '';
      transformedOffer.requirements = offer.call_to_action || '';
      transformedOffer.thumbnail = offer.image_url || '';
      transformedOffer.offerUrlTemplate = offer.offer_url || '';
      transformedOffer.providerName = this.providerName;

      // Map platform and device to isDesktop, isAndroid, isIos
      const platform = offer.platform?.toLowerCase();
      const device = offer.device?.toLowerCase();

      if (platform === 'desktop') {
        transformedOffer.isDesktop = 1;
        transformedOffer.isAndroid = 0;
        transformedOffer.isIos = 0;
      } else if (platform === 'mobile') {
        transformedOffer.isDesktop = 0;
        if (device === 'iphone_ipad') {
          transformedOffer.isAndroid = 0;
          transformedOffer.isIos = 1;
        } else {
          transformedOffer.isAndroid = 1;
          transformedOffer.isIos = 0;
        }
      } else {
        // Default to all platforms if not specified
        transformedOffer.isDesktop = 1;
        transformedOffer.isAndroid = 1;
        transformedOffer.isIos = 1;
      }

      return transformedOffer;
    });
  }
}


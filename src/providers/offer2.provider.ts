import { BaseOfferProvider } from './base.provider';
import { Offer } from '../../offer.entity';
import { generateSlug } from '../utils/slug.generator';
import { PROVIDER_ERRORS, HTTP_ERRORS } from '../constants/error.constants';
import { PROVIDER_NAMES } from '../constants/api.constants';

interface Offer2Payload {
  status: string;
  data: Record<string, Offer2Campaign>;
}

interface Offer2Campaign {
  Offer: {
    campaign_id: number;
    store_id: number | null;
    tracking_type: string;
    campaign_vertical: string;
    currency_name_singular: string;
    currency_name_plural: string;
    network_epc: string;
    icon: string;
    name: string;
    tracking_url: string;
    instructions: string;
    disclaimer: string | null;
    description: string;
    short_description: string;
    offer_sticker_text_1: string | null;
    offer_sticker_text_2: string | null;
    offer_sticker_text_3: string | null;
    offer_sticker_color_1: string | null;
    offer_sticker_color_2: string | null;
    offer_sticker_color_3: string | null;
    sort_order_setting: number | null;
    category_1: string;
    category_2: string | null;
    amount: number;
    payout_usd: number;
    start_datetime: string;
    end_datetime: string;
    is_multi_reward: boolean;
  };
  Country: {
    include: Record<string, any>;
    exclude: any[];
  };
  State: {
    include: any[];
    exclude: any[];
  };
  City: {
    include: any[];
    exclude: any[];
  };
  Connection_Type: {
    cellular: boolean;
    wifi: boolean;
  };
  Device: {
    include: any[];
    exclude: any[];
  };
  OS: {
    android: boolean;
    ios: boolean;
    web: boolean;
    min_ios: number | null;
    max_ios: number | null;
    min_android: number | null;
    max_android: number | null;
  };
}

export class Offer2Provider extends BaseOfferProvider {
  readonly providerName = PROVIDER_NAMES.OFFER2;

  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async fetchOffers(): Promise<Offer2Payload> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error(PROVIDER_ERRORS.FETCH_FAILED(this.providerName, response.statusText));
    }
    const data = await response.json() as Offer2Payload;
    
    if (data.status !== 'success') {
      throw new Error(`Provider ${this.providerName} returned unsuccessful status: ${data.status}`);
    }
    
    return data;
  }

  transformOffers(payload: Offer2Payload): Offer[] {
    if (!payload?.data || typeof payload.data !== 'object') {
      return [];
    }

    return Object.values(payload.data).map((campaign) => {
      const offerData = campaign.Offer;
      const osData = campaign.OS;

      const transformedOffer = new Offer();
      
      transformedOffer.externalOfferId = offerData.campaign_id.toString();
      transformedOffer.name = offerData.name;
      transformedOffer.slug = generateSlug(offerData.name);
      transformedOffer.description = offerData.description || '';
      transformedOffer.requirements = offerData.instructions || '';
      transformedOffer.thumbnail = offerData.icon || '';
      transformedOffer.offerUrlTemplate = offerData.tracking_url || '';
      transformedOffer.providerName = this.providerName;

      // Map OS flags to isDesktop, isAndroid, isIos
      transformedOffer.isDesktop = osData.web ? 1 : 0;
      transformedOffer.isAndroid = osData.android ? 1 : 0;
      transformedOffer.isIos = osData.ios ? 1 : 0;

      return transformedOffer;
    });
  }
}


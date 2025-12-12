import { Offer1Provider } from '../../src/providers/offer1.provider';
import { payload as offer1PayloadRaw } from '../../offer1.payload';

// Type the payload properly for tests
const offer1Payload = offer1PayloadRaw as any;

// Mock fetch globally
global.fetch = jest.fn();

describe('Offer1Provider', () => {
  let provider: Offer1Provider;

  beforeEach(() => {
    provider = new Offer1Provider('https://api.offer1.com/offers');
    jest.clearAllMocks();
  });

  describe('fetchOffers', () => {
    it('should fetch offers successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(offer1Payload),
      };
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await provider.fetchOffers();
      
      expect(fetch).toHaveBeenCalledWith('https://api.offer1.com/offers');
      expect(result).toEqual(offer1Payload);
    });

    it('should handle fetch errors', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Internal Server Error',
      };
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      await expect(provider.fetchOffers()).rejects.toThrow(
        'Failed to fetch offers from offer1: Internal Server Error'
      );
    });
  });

  describe('transformOffers', () => {
    it('should transform offer1 payload correctly', () => {
      const offers = provider.transformOffers(offer1Payload);
      
      expect(offers).toHaveLength(1);
      
      const offer = offers[0];
      expect(offer.name).toBe('MyGym - iOS');
      expect(offer.externalOfferId).toBe('19524555');
      expect(offer.description).toBe('Play and reach level 23 within 14 days.');
      expect(offer.requirements).toBe('Play and reach level 23 within 14 days.');
      expect(offer.providerName).toBe('offer1');
      expect(offer.slug).toBe('mygym-ios');
    });

    it('should handle platform mapping for mobile iPhone/iPad', () => {
      const offers = provider.transformOffers(offer1Payload);
      const offer = offers[0];
      
      // The payload has platform: 'mobile', device: 'iphone_ipad'
      expect(offer.isDesktop).toBe(0);
      expect(offer.isAndroid).toBe(0);
      expect(offer.isIos).toBe(1);
    });

    it('should handle desktop platform', () => {
      const desktopPayload = {
        ...offer1Payload,
        response: {
          ...offer1Payload.response,
          offers: [{
            ...offer1Payload.response.offers[0],
            platform: 'desktop' as const,
            device: 'windows',
          }],
        },
      };
      
      const offers = provider.transformOffers(desktopPayload);
      const offer = offers[0];
      
      expect(offer.isDesktop).toBe(1);
      expect(offer.isAndroid).toBe(0);
      expect(offer.isIos).toBe(0);
    });

    it('should handle mobile Android', () => {
      const androidPayload = {
        ...offer1Payload,
        response: {
          ...offer1Payload.response,
          offers: [{
            ...offer1Payload.response.offers[0],
            platform: 'mobile' as const,
            device: 'android',
          }],
        },
      };
      
      const offers = provider.transformOffers(androidPayload);
      const offer = offers[0];
      
      expect(offer.isDesktop).toBe(0);
      expect(offer.isAndroid).toBe(1);
      expect(offer.isIos).toBe(0);
    });

    it('should handle invalid payload', () => {
      const offers = provider.transformOffers({} as any);
      expect(offers).toHaveLength(0);
    });

    it('should handle empty offers array', () => {
      const emptyPayload = {
        ...offer1Payload,
        response: {
          ...offer1Payload.response,
          offers: [],
        },
      };
      
      const offers = provider.transformOffers(emptyPayload);
      expect(offers).toHaveLength(0);
    });

    it('should default to all platforms when platform is unknown', () => {
      const unknownPlatformPayload = {
        ...offer1Payload,
        response: {
          ...offer1Payload.response,
          offers: [{
            ...offer1Payload.response.offers[0],
            platform: 'unknown' as any, // Unknown platform
            device: 'unknown',
          }],
        },
      };
      
      const offers = provider.transformOffers(unknownPlatformPayload);
      const offer = offers[0];
      
      // Should default to all platforms
      expect(offer.isDesktop).toBe(1);
      expect(offer.isAndroid).toBe(1);
      expect(offer.isIos).toBe(1);
    });
  });
});

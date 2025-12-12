import { Offer2Provider } from '../../src/providers/offer2.provider';
import { payload as offer2PayloadRaw } from '../../offer2.payload';

// Type the payload properly for tests
const offer2Payload = offer2PayloadRaw as any;

// Mock fetch globally
global.fetch = jest.fn();

describe('Offer2Provider', () => {
  let provider: Offer2Provider;

  beforeEach(() => {
    provider = new Offer2Provider('https://api.offer2.com/offers');
    jest.clearAllMocks();
  });

  describe('fetchOffers', () => {
    it('should fetch offers successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(offer2Payload),
      };
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await provider.fetchOffers();
      
      expect(fetch).toHaveBeenCalledWith('https://api.offer2.com/offers');
      expect(result).toEqual(offer2Payload);
    });

    it('should handle unsuccessful status', async () => {
      const errorPayload = { status: 'error' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(errorPayload),
      };
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      await expect(provider.fetchOffers()).rejects.toThrow(
        'Provider offer2 returned unsuccessful status: error'
      );
    });

    it('should handle HTTP error responses', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Internal Server Error',
      };
      
      (fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      await expect(provider.fetchOffers()).rejects.toThrow(
        'Failed to fetch offers from offer2: Internal Server Error'
      );
      
      expect(fetch).toHaveBeenCalledWith('https://api.offer2.com/offers');
    });
  });

  describe('transformOffers', () => {
    it('should transform offer2 payload correctly', () => {
      const offers = provider.transformOffers(offer2Payload);
      
      expect(offers).toHaveLength(1);
      
      const offer = offers[0];
      expect(offer.name).toBe('Sofi');
      expect(offer.externalOfferId).toBe('15828');
      expect(offer.description).toBe('SoFi is a one-stop shop for your finances, designed to help you Get Your Money Right.');
      expect(offer.requirements).toBe('Register with VALID personal information, Make a minimum deposit of $50,Redeem your points! *New Users Only!');
      expect(offer.providerName).toBe('offer2');
      expect(offer.slug).toBe('sofi');
    });

    it('should handle OS mapping correctly', () => {
      const offers = provider.transformOffers(offer2Payload);
      const offer = offers[0];
      
      // The payload has android: false, ios: true, web: true
      expect(offer.isDesktop).toBe(1); // web: true
      expect(offer.isAndroid).toBe(0); // android: false
      expect(offer.isIos).toBe(1); // ios: true
    });

    it('should handle different OS configurations', () => {
      const androidPayload = {
        ...offer2Payload,
        data: {
          '15828': {
            ...offer2Payload.data['15828'],
            OS: {
              android: true,
              ios: false,
              web: false,
            },
          },
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

    it('should handle empty data object', () => {
      const emptyPayload = {
        status: 'success',
        data: {},
      };
      
      const offers = provider.transformOffers(emptyPayload);
      expect(offers).toHaveLength(0);
    });
  });
});

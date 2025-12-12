import { Offer1Provider } from '../../src/providers/offer1.provider';

// Mock fetch globally
global.fetch = jest.fn();

describe('Offer1Provider - Edge Cases', () => {
  let provider: Offer1Provider;

  beforeEach(() => {
    provider = new Offer1Provider('https://api.offer1.com/offers');
    jest.clearAllMocks();
  });

  describe('platform mapping edge cases', () => {
    it('should default to all platforms when platform is unknown', () => {
      const unknownPlatformPayload = {
        query: {
          pubid: "1",
          appid: 1,
          country: "",
          platform: "all",
        },
        response: {
          currency_name: "Coins",
          offers_count: 1,
          offers: [{
            offer_id: "12345",
            offer_name: "Test Offer",
            offer_desc: "Test description",
            call_to_action: "Test action",
            disclaimer: "Test disclaimer",
            offer_url: "https://example.com/offer",
            offer_url_easy: "https://example.com/offer-easy",
            payout: 10.0,
            payout_type: "cpe",
            amount: 1000,
            image_url: "https://example.com/image.jpg",
            image_url_220x124: "https://example.com/image-small.jpg",
            countries: ["US"],
            platform: "unknown" as any, // Unknown platform
            device: "unknown",
            category: { "1": "Test" },
            last_modified: 1645095666,
            preview_url: "https://example.com/preview",
            package_id: "test.package",
            verticals: [],
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

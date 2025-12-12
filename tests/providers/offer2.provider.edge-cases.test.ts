import { Offer2Provider } from '../../src/providers/offer2.provider';

// Mock fetch globally
global.fetch = jest.fn();

describe('Offer2Provider - Edge Cases', () => {
  let provider: Offer2Provider;

  beforeEach(() => {
    provider = new Offer2Provider('https://api.offer2.com/offers');
    jest.clearAllMocks();
  });

  describe('HTTP error handling', () => {
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
});

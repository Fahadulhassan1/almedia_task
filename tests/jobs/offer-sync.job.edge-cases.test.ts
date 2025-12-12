import { OfferSyncJob } from '../../src/jobs/offer-sync.job';
import { OfferService } from '../../src/services/offer.service';
import { IOfferProvider } from '../../src/providers/base.provider';
import { Offer } from '../../offer.entity';

// Mock the OfferService
jest.mock('../../src/services/offer.service');

describe('OfferSyncJob - Edge Cases', () => {
  let syncJob: OfferSyncJob;
  let mockOfferService: jest.Mocked<OfferService>;

  beforeEach(() => {
    mockOfferService = {
      saveOffers: jest.fn(),
    } as any;
    
    syncJob = new OfferSyncJob(mockOfferService);
  });

  const createTestOffer = (id: string): Offer => {
    const offer = new Offer();
    offer.id = parseInt(id);
    offer.name = `Test Offer ${id}`;
    offer.slug = `test-offer-${id}`;
    offer.description = 'Test description';
    offer.requirements = 'Test requirements';
    offer.thumbnail = 'https://example.com/image.jpg';
    offer.offerUrlTemplate = 'https://example.com/offer';
    offer.providerName = 'test-provider';
    offer.externalOfferId = id;
    offer.isDesktop = 1;
    offer.isAndroid = 0;
    offer.isIos = 0;
    return offer;
  };

  describe('processProviders fatal error handling', () => {
    it('should handle processProvider throwing an unexpected error', async () => {
      const mockProvider: jest.Mocked<IOfferProvider> = {
        providerName: 'test-provider',
        fetchOffers: jest.fn(),
        transformOffers: jest.fn(),
      };

      // Make processProvider itself throw an error (this is different from fetchOffers throwing)
      // We need to make the job's processProvider method throw, not the provider methods
      const originalProcessProvider = syncJob.processProvider;
      syncJob.processProvider = jest.fn().mockRejectedValue(new Error('Unexpected job error'));

      const results = await syncJob.processProviders([mockProvider]);

      expect(results).toHaveLength(1);
      expect(results[0].providerName).toBe('test-provider');
      expect(results[0].errors[0]).toContain('Fatal error: Unexpected job error');
      expect(results[0].totalOffers).toBe(0);

      // Restore the original method
      syncJob.processProvider = originalProcessProvider;
    });
  });

  describe('summary with errors/warnings', () => {
    it('should display error count in summary when errors exist', async () => {
      const mockProvider: jest.Mocked<IOfferProvider> = {
        providerName: 'test-provider',
        fetchOffers: jest.fn(),
        transformOffers: jest.fn(),
      };

      // Create an offer with validation error
      const invalidOffer = createTestOffer('1');
      invalidOffer.name = ''; // This will cause validation error

      const mockPayload = { offers: ['offer1'] };
      mockProvider.fetchOffers.mockResolvedValue(mockPayload);
      mockProvider.transformOffers.mockReturnValue([invalidOffer]);

      // Spy on console.log to verify error reporting
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const results = await syncJob.processProviders([mockProvider]);

      expect(results[0].errors.length).toBeGreaterThan(0);
      
      // Verify that the error count was logged in summary
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Errors/Warnings:'));
      
      consoleSpy.mockRestore();
    });
  });
});

import { OfferService } from '../../src/services/offer.service';
import { Offer } from '../../offer.entity';
import { DataSource, Repository, EntityManager } from 'typeorm';

// Mock TypeORM decorators and classes
jest.mock('typeorm', () => ({
  DataSource: jest.fn(),
  Repository: jest.fn(),
  EntityManager: jest.fn(),
  Entity: () => (target: any) => target,
  PrimaryGeneratedColumn: () => (target: any, key: string) => {},
  Column: () => (target: any, key: string) => {},
}));

// Mock the Offer entity to avoid decorator issues
jest.mock('../../offer.entity', () => ({
  Offer: class MockOffer {
    id?: number;
    name?: string;
    slug?: string;
    description?: string;
    requirements?: string;
    thumbnail?: string;
    isDesktop?: number;
    isAndroid?: number;
    isIos?: number;
    offerUrlTemplate?: string;
    providerName?: string;
    externalOfferId?: string;
  }
}));

describe('OfferService', () => {
  let offerService: OfferService;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockRepository: jest.Mocked<Repository<Offer>>;
  let mockEntityManager: jest.Mocked<EntityManager>;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    } as any;

    // Create mock entity manager for transactions
    mockEntityManager = {
      getRepository: jest.fn(),
    } as any;

    // Create mock data source
    mockDataSource = {
      getRepository: jest.fn(),
      transaction: jest.fn(),
    } as any;

    // Setup default behavior
    mockDataSource.getRepository.mockReturnValue(mockRepository);
    mockEntityManager.getRepository.mockReturnValue(mockRepository);

    // Create service instance
    offerService = new OfferService(mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  describe('saveOffer', () => {
    it('should insert a new offer when slug does not exist', async () => {
      const offer = createTestOffer('1');
      const savedOffer = { ...offer };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue(savedOffer);

      const result = await offerService.saveOffer(offer);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { slug: offer.slug },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(offer);
      expect(result).toEqual(savedOffer);
    });

    it('should update existing offer when slug exists', async () => {
      const newOffer = createTestOffer('1');
      const existingOffer = createTestOffer('1');
      existingOffer.name = 'Old Name';
      
      const updatedOffer = { ...existingOffer, ...newOffer };

      mockRepository.findOne.mockResolvedValue(existingOffer);
      mockRepository.save.mockResolvedValue(updatedOffer);

      const result = await offerService.saveOffer(newOffer);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { slug: newOffer.slug },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(existingOffer);
      expect(result).toEqual(updatedOffer);
    });

    it('should handle repository errors', async () => {
      const offer = createTestOffer('1');
      const error = new Error('Database error');

      mockRepository.findOne.mockRejectedValue(error);

      await expect(offerService.saveOffer(offer)).rejects.toThrow('Database error');
    });
  });

  describe('saveOffers', () => {
    it('should return empty array for empty input', async () => {
      const result = await offerService.saveOffers([]);
      expect(result).toEqual([]);
      expect(mockDataSource.transaction).not.toHaveBeenCalled();
    });

    it('should save multiple offers in a transaction', async () => {
      const offers = [createTestOffer('1'), createTestOffer('2')];
      const savedOffers = [...offers];

      // Mock transaction behavior
      mockDataSource.transaction.mockImplementation(async (callback: any) => {
        return await callback(mockEntityManager);
      });

      // Mock repository behavior inside transaction
      mockRepository.findOne.mockResolvedValue(null); // No existing offers
      mockRepository.save.mockImplementation((offer: any) => Promise.resolve(offer as Offer));

      const result = await offerService.saveOffers(offers);

      expect(mockDataSource.transaction).toHaveBeenCalled();
      expect(mockEntityManager.getRepository).toHaveBeenCalledWith(Offer);
      expect(mockRepository.save).toHaveBeenCalledTimes(2);
      expect(result).toEqual(savedOffers);
    });

    it('should update existing offers in transaction', async () => {
      const newOffers = [createTestOffer('1'), createTestOffer('2')];
      const existingOffer1 = createTestOffer('1');
      existingOffer1.name = 'Old Name 1';
      const existingOffer2 = createTestOffer('2');
      existingOffer2.name = 'Old Name 2';

      mockDataSource.transaction.mockImplementation(async (callback: any) => {
        return await callback(mockEntityManager);
      });

      // Mock finding existing offers
      mockRepository.findOne
        .mockResolvedValueOnce(existingOffer1)
        .mockResolvedValueOnce(existingOffer2);

      mockRepository.save.mockImplementation((offer: any) => Promise.resolve(offer as Offer));

      const result = await offerService.saveOffers(newOffers);

      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockRepository.save).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });

    it('should handle mixed new and existing offers', async () => {
      const offers = [createTestOffer('1'), createTestOffer('2')];
      const existingOffer = createTestOffer('1');

      mockDataSource.transaction.mockImplementation(async (callback: any) => {
        return await callback(mockEntityManager);
      });

      // First offer exists, second is new
      mockRepository.findOne
        .mockResolvedValueOnce(existingOffer)
        .mockResolvedValueOnce(null);

      mockRepository.save.mockImplementation((offer: any) => Promise.resolve(offer as Offer));

      const result = await offerService.saveOffers(offers);

      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockRepository.save).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });

    it('should handle transaction errors', async () => {
      const offers = [createTestOffer('1')];
      const error = new Error('Transaction failed');

      mockDataSource.transaction.mockRejectedValue(error);

      await expect(offerService.saveOffers(offers)).rejects.toThrow('Transaction failed');
    });

    it('should handle save errors within transaction', async () => {
      const offers = [createTestOffer('1')];
      const error = new Error('Save failed');

      mockDataSource.transaction.mockImplementation(async (callback: any) => {
        return await callback(mockEntityManager);
      });

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.save.mockRejectedValue(error);

      await expect(offerService.saveOffers(offers)).rejects.toThrow('Save failed');
    });
  });

  describe('findBySlug', () => {
    it('should find offer by slug', async () => {
      const offer = createTestOffer('1');
      mockRepository.findOne.mockResolvedValue(offer);

      const result = await offerService.findBySlug('test-offer-1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { slug: 'test-offer-1' },
      });
      expect(result).toEqual(offer);
    });

    it('should return null when offer not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await offerService.findBySlug('non-existent-slug');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { slug: 'non-existent-slug' },
      });
      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.findOne.mockRejectedValue(error);

      await expect(offerService.findBySlug('test-slug')).rejects.toThrow('Database error');
    });
  });

  describe('findByProvider', () => {
    it('should find offers by provider name', async () => {
      const offers = [createTestOffer('1'), createTestOffer('2')];
      mockRepository.find.mockResolvedValue(offers);

      const result = await offerService.findByProvider('test-provider');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { providerName: 'test-provider' },
      });
      expect(result).toEqual(offers);
    });

    it('should return empty array when no offers found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await offerService.findByProvider('unknown-provider');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { providerName: 'unknown-provider' },
      });
      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.find.mockRejectedValue(error);

      await expect(offerService.findByProvider('test-provider')).rejects.toThrow('Database error');
    });
  });

  describe('constructor', () => {
    it('should initialize with DataSource and get repository', () => {
      expect(mockDataSource.getRepository).toHaveBeenCalledWith(Offer);
    });
  });

  describe('upsert behavior integration', () => {
    it('should demonstrate complete upsert workflow', async () => {
      const originalOffer = createTestOffer('1');
      originalOffer.name = 'Original Name';
      
      const updatedOffer = createTestOffer('1');
      updatedOffer.name = 'Updated Name';
      updatedOffer.description = 'Updated Description';

      // First save (insert)
      mockRepository.findOne.mockResolvedValueOnce(null);
      mockRepository.save.mockResolvedValueOnce(originalOffer);

      const firstResult = await offerService.saveOffer(originalOffer);
      expect(firstResult).toEqual(originalOffer);

      // Second save (update)
      mockRepository.findOne.mockResolvedValueOnce(originalOffer);
      const mergedOffer = { ...originalOffer, ...updatedOffer };
      mockRepository.save.mockResolvedValueOnce(mergedOffer);

      const secondResult = await offerService.saveOffer(updatedOffer);
      expect(secondResult.name).toBe('Updated Name');
      expect(secondResult.description).toBe('Updated Description');
    });
  });
});

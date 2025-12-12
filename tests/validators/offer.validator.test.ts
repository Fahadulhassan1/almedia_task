import { OfferValidator } from '../../src/validators/offer.validator';
import { Offer } from '../../offer.entity';

describe('OfferValidator', () => {
  let validator: OfferValidator;

  beforeEach(() => {
    validator = new OfferValidator();
  });

  const createValidOffer = (): Offer => {
    const offer = new Offer();
    offer.name = 'Test Offer';
    offer.slug = 'test-offer';
    offer.description = 'Test description';
    offer.requirements = 'Test requirements';
    offer.thumbnail = 'https://example.com/image.jpg';
    offer.offerUrlTemplate = 'https://example.com/offer';
    offer.providerName = 'test-provider';
    offer.externalOfferId = 'ext-123';
    offer.isDesktop = 1;
    offer.isAndroid = 0;
    offer.isIos = 0;
    return offer;
  };

  describe('validate', () => {
    it('should validate a correct offer', () => {
      const offer = createValidOffer();
      const result = validator.validate(offer);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require offer name', () => {
      const offer = createValidOffer();
      offer.name = '';
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Offer name is required');
    });

    it('should validate name length', () => {
      const offer = createValidOffer();
      offer.name = 'x'.repeat(256); // Too long
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Offer name must be 255 characters or less');
    });

    it('should require slug', () => {
      const offer = createValidOffer();
      offer.slug = '';
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Offer slug is required');
    });

    it('should require description', () => {
      const offer = createValidOffer();
      offer.description = '';
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Offer description is required');
    });

    it('should require requirements', () => {
      const offer = createValidOffer();
      offer.requirements = '';
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Offer requirements are required');
    });

    it('should validate thumbnail URL', () => {
      const offer = createValidOffer();
      offer.thumbnail = 'invalid-url';
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Offer thumbnail must be a valid URL');
    });

    it('should validate offer URL template', () => {
      const offer = createValidOffer();
      offer.offerUrlTemplate = 'not-a-url';
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Offer URL template must be a valid URL');
    });

    it('should require at least one platform', () => {
      const offer = createValidOffer();
      offer.isDesktop = 0;
      offer.isAndroid = 0;
      offer.isIos = 0;
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one platform (desktop, Android, or iOS) must be enabled');
    });

    it('should validate platform flag values', () => {
      const offer = createValidOffer();
      offer.isDesktop = 2; // Invalid value
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('isDesktop must be 0 or 1');
    });

    it('should require provider name', () => {
      const offer = createValidOffer();
      offer.providerName = '';
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Provider name is required');
    });

    it('should require external offer ID', () => {
      const offer = createValidOffer();
      offer.externalOfferId = '';
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('External offer ID is required');
    });

    it('should validate slug length limit', () => {
      const offer = createValidOffer();
      offer.slug = 'x'.repeat(256); // Too long
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Offer slug must be 255 characters or less');
    });

    it('should validate thumbnail length limit', () => {
      const offer = createValidOffer();
      offer.thumbnail = 'https://example.com/' + 'x'.repeat(300); // Too long
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Offer thumbnail URL must be 255 characters or less');
    });

    it('should validate offer URL template length limit', () => {
      const offer = createValidOffer();
      offer.offerUrlTemplate = 'https://example.com/' + 'x'.repeat(300); // Too long
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Offer URL template must be 256 characters or less');
    });

    it('should validate platform flag values for isAndroid', () => {
      const offer = createValidOffer();
      offer.isAndroid = 2; // Invalid value
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('isAndroid must be 0 or 1');
    });

    it('should validate platform flag values for isIos', () => {
      const offer = createValidOffer();
      offer.isIos = -1; // Invalid value
      
      const result = validator.validate(offer);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('isIos must be 0 or 1');
    });
  });

  describe('validateBatch', () => {
    it('should validate multiple offers', () => {
      const offers = [createValidOffer(), createValidOffer()];
      offers[1].name = 'Second Offer';
      offers[1].slug = 'second-offer';
      
      const results = validator.validateBatch(offers);
      
      expect(results.size).toBe(2);
      expect(results.get(0)?.isValid).toBe(true);
      expect(results.get(1)?.isValid).toBe(true);
    });

    it('should handle mixed valid/invalid offers', () => {
      const offers = [createValidOffer(), createValidOffer()];
      offers[1].name = ''; // Invalid
      
      const results = validator.validateBatch(offers);
      
      expect(results.get(0)?.isValid).toBe(true);
      expect(results.get(1)?.isValid).toBe(false);
      expect(results.get(1)?.errors).toContain('Offer name is required');
    });
  });
});

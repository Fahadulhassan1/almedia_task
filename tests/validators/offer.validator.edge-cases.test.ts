import { OfferValidator } from '../../src/validators/offer.validator';
import { Offer } from '../../offer.entity';

describe('OfferValidator - Additional Edge Cases', () => {
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

  describe('uncovered validation paths', () => {
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
});

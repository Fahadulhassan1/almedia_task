import {
  VALIDATION_LIMITS,
  PLATFORM_FLAGS,
  PLATFORMS,
  VALIDATION_ERRORS,
} from '../../src/constants/validation.constants';

describe('ValidationConstants', () => {
  describe('VALIDATION_LIMITS', () => {
    it('should have correct field length limits', () => {
      expect(VALIDATION_LIMITS.NAME_MAX_LENGTH).toBe(255);
      expect(VALIDATION_LIMITS.SLUG_MAX_LENGTH).toBe(255);
      expect(VALIDATION_LIMITS.THUMBNAIL_MAX_LENGTH).toBe(255);
      expect(VALIDATION_LIMITS.OFFER_URL_TEMPLATE_MAX_LENGTH).toBe(256);
      expect(VALIDATION_LIMITS.PROVIDER_NAME_MAX_LENGTH).toBe(255);
      expect(VALIDATION_LIMITS.EXTERNAL_OFFER_ID_MAX_LENGTH).toBe(255);
    });
  });

  describe('PLATFORM_FLAGS', () => {
    it('should have correct platform flag values', () => {
      expect(PLATFORM_FLAGS.ENABLED).toBe(1);
      expect(PLATFORM_FLAGS.DISABLED).toBe(0);
      expect(PLATFORM_FLAGS.VALID_VALUES).toEqual([0, 1]);
    });
  });

  describe('PLATFORMS', () => {
    it('should have correct platform names', () => {
      expect(PLATFORMS.DESKTOP).toBe('desktop');
      expect(PLATFORMS.ANDROID).toBe('Android');
      expect(PLATFORMS.IOS).toBe('iOS');
    });
  });

  describe('VALIDATION_ERRORS', () => {
    it('should have correct required field error messages', () => {
      expect(VALIDATION_ERRORS.OFFER_NAME_REQUIRED).toBe('Offer name is required');
      expect(VALIDATION_ERRORS.OFFER_SLUG_REQUIRED).toBe('Offer slug is required');
      expect(VALIDATION_ERRORS.PROVIDER_NAME_REQUIRED).toBe('Provider name is required');
    });

    it('should have correct length validation error messages', () => {
      expect(VALIDATION_ERRORS.OFFER_NAME_TOO_LONG).toBe('Offer name must be 255 characters or less');
      expect(VALIDATION_ERRORS.OFFER_URL_TEMPLATE_TOO_LONG).toBe('Offer URL template must be 256 characters or less');
    });

    it('should have correct URL validation error messages', () => {
      expect(VALIDATION_ERRORS.OFFER_THUMBNAIL_INVALID_URL).toBe('Offer thumbnail must be a valid URL');
      expect(VALIDATION_ERRORS.OFFER_URL_TEMPLATE_INVALID_URL).toBe('Offer URL template must be a valid URL');
    });

    it('should have correct platform validation error messages', () => {
      expect(VALIDATION_ERRORS.PLATFORM_REQUIRED).toContain('At least one platform');
      expect(VALIDATION_ERRORS.IS_DESKTOP_INVALID).toBe('isDesktop must be 0 or 1');
      expect(VALIDATION_ERRORS.IS_ANDROID_INVALID).toBe('isAndroid must be 0 or 1');
      expect(VALIDATION_ERRORS.IS_IOS_INVALID).toBe('isIos must be 0 or 1');
    });
  });
});

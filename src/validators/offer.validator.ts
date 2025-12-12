import { Offer } from '../../offer.entity';
import { 
  VALIDATION_LIMITS, 
  PLATFORM_FLAGS, 
  VALIDATION_ERRORS 
} from '../constants/validation.constants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates an Offer entity to ensure it meets all requirements
 */
export class OfferValidator {
  /**
   * Validates a single offer
   * @param offer The offer to validate
   * @returns Validation result with isValid flag and array of error messages
   */
  validate(offer: Offer): ValidationResult {
    const errors: string[] = [];

    // Required fields validation
    if (!offer.name || offer.name.trim().length === 0) {
      errors.push(VALIDATION_ERRORS.OFFER_NAME_REQUIRED);
    } else if (offer.name.length > VALIDATION_LIMITS.NAME_MAX_LENGTH) {
      errors.push(VALIDATION_ERRORS.OFFER_NAME_TOO_LONG);
    }

    if (!offer.slug || offer.slug.trim().length === 0) {
      errors.push(VALIDATION_ERRORS.OFFER_SLUG_REQUIRED);
    } else if (offer.slug.length > VALIDATION_LIMITS.SLUG_MAX_LENGTH) {
      errors.push(VALIDATION_ERRORS.OFFER_SLUG_TOO_LONG);
    }

    if (!offer.description || offer.description.trim().length === 0) {
      errors.push(VALIDATION_ERRORS.OFFER_DESCRIPTION_REQUIRED);
    }

    if (!offer.requirements || offer.requirements.trim().length === 0) {
      errors.push(VALIDATION_ERRORS.OFFER_REQUIREMENTS_REQUIRED);
    }

    if (!offer.thumbnail || offer.thumbnail.trim().length === 0) {
      errors.push(VALIDATION_ERRORS.OFFER_THUMBNAIL_REQUIRED);
    } else if (offer.thumbnail.length > VALIDATION_LIMITS.THUMBNAIL_MAX_LENGTH) {
      errors.push(VALIDATION_ERRORS.OFFER_THUMBNAIL_TOO_LONG);
    } else if (!this.isValidUrl(offer.thumbnail)) {
      errors.push(VALIDATION_ERRORS.OFFER_THUMBNAIL_INVALID_URL);
    }

    if (!offer.offerUrlTemplate || offer.offerUrlTemplate.trim().length === 0) {
      errors.push(VALIDATION_ERRORS.OFFER_URL_TEMPLATE_REQUIRED);
    } else if (offer.offerUrlTemplate.length > VALIDATION_LIMITS.OFFER_URL_TEMPLATE_MAX_LENGTH) {
      errors.push(VALIDATION_ERRORS.OFFER_URL_TEMPLATE_TOO_LONG);
    } else if (!this.isValidUrl(offer.offerUrlTemplate)) {
      errors.push(VALIDATION_ERRORS.OFFER_URL_TEMPLATE_INVALID_URL);
    }

    if (!offer.providerName || offer.providerName.trim().length === 0) {
      errors.push(VALIDATION_ERRORS.PROVIDER_NAME_REQUIRED);
    }

    if (!offer.externalOfferId || offer.externalOfferId.trim().length === 0) {
      errors.push(VALIDATION_ERRORS.EXTERNAL_OFFER_ID_REQUIRED);
    }

    // Platform flags validation - at least one platform must be enabled
    if (offer.isDesktop === PLATFORM_FLAGS.DISABLED && 
        offer.isAndroid === PLATFORM_FLAGS.DISABLED && 
        offer.isIos === PLATFORM_FLAGS.DISABLED) {
      errors.push(VALIDATION_ERRORS.PLATFORM_REQUIRED);
    }

    // Platform flags must be 0 or 1
    if (!PLATFORM_FLAGS.VALID_VALUES.includes(offer.isDesktop)) {
      errors.push(VALIDATION_ERRORS.IS_DESKTOP_INVALID);
    }
    if (!PLATFORM_FLAGS.VALID_VALUES.includes(offer.isAndroid)) {
      errors.push(VALIDATION_ERRORS.IS_ANDROID_INVALID);
    }
    if (!PLATFORM_FLAGS.VALID_VALUES.includes(offer.isIos)) {
      errors.push(VALIDATION_ERRORS.IS_IOS_INVALID);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates multiple offers
   * @param offers Array of offers to validate
   * @returns Map of offer index to validation result
   */
  validateBatch(offers: Offer[]): Map<number, ValidationResult> {
    const results = new Map<number, ValidationResult>();
    
    offers.forEach((offer, index) => {
      results.set(index, this.validate(offer));
    });

    return results;
  }

  /**
   * Simple URL validation
   * @param url The URL string to validate
   * @returns True if the URL appears valid
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}


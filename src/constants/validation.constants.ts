/**
 * Validation constants for offer validation
 */

// Field length limits
export const VALIDATION_LIMITS = {
  NAME_MAX_LENGTH: 255,
  SLUG_MAX_LENGTH: 255,
  THUMBNAIL_MAX_LENGTH: 255,
  OFFER_URL_TEMPLATE_MAX_LENGTH: 256,
  PROVIDER_NAME_MAX_LENGTH: 255,
  EXTERNAL_OFFER_ID_MAX_LENGTH: 255,
} as const;

// Platform flag values
export const PLATFORM_FLAGS = {
  ENABLED: 1,
  DISABLED: 0,
  VALID_VALUES: [0, 1] as number[],
} as const;

// Platform names
export const PLATFORMS = {
  DESKTOP: 'desktop',
  ANDROID: 'Android',
  IOS: 'iOS',
} as const;

// Validation error messages
export const VALIDATION_ERRORS = {
  // Required field errors
  OFFER_NAME_REQUIRED: 'Offer name is required',
  OFFER_SLUG_REQUIRED: 'Offer slug is required',
  OFFER_DESCRIPTION_REQUIRED: 'Offer description is required',
  OFFER_REQUIREMENTS_REQUIRED: 'Offer requirements are required',
  OFFER_THUMBNAIL_REQUIRED: 'Offer thumbnail URL is required',
  OFFER_URL_TEMPLATE_REQUIRED: 'Offer URL template is required',
  PROVIDER_NAME_REQUIRED: 'Provider name is required',
  EXTERNAL_OFFER_ID_REQUIRED: 'External offer ID is required',

  // Length validation errors
  OFFER_NAME_TOO_LONG: `Offer name must be ${VALIDATION_LIMITS.NAME_MAX_LENGTH} characters or less`,
  OFFER_SLUG_TOO_LONG: `Offer slug must be ${VALIDATION_LIMITS.SLUG_MAX_LENGTH} characters or less`,
  OFFER_THUMBNAIL_TOO_LONG: `Offer thumbnail URL must be ${VALIDATION_LIMITS.THUMBNAIL_MAX_LENGTH} characters or less`,
  OFFER_URL_TEMPLATE_TOO_LONG: `Offer URL template must be ${VALIDATION_LIMITS.OFFER_URL_TEMPLATE_MAX_LENGTH} characters or less`,

  // URL validation errors
  OFFER_THUMBNAIL_INVALID_URL: 'Offer thumbnail must be a valid URL',
  OFFER_URL_TEMPLATE_INVALID_URL: 'Offer URL template must be a valid URL',

  // Platform validation errors
  PLATFORM_REQUIRED: `At least one platform (${PLATFORMS.DESKTOP}, ${PLATFORMS.ANDROID}, or ${PLATFORMS.IOS}) must be enabled`,
  IS_DESKTOP_INVALID: `isDesktop must be ${PLATFORM_FLAGS.DISABLED} or ${PLATFORM_FLAGS.ENABLED}`,
  IS_ANDROID_INVALID: `isAndroid must be ${PLATFORM_FLAGS.DISABLED} or ${PLATFORM_FLAGS.ENABLED}`,
  IS_IOS_INVALID: `isIos must be ${PLATFORM_FLAGS.DISABLED} or ${PLATFORM_FLAGS.ENABLED}`,
} as const;

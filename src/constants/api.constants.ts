/**
 * API and configuration constants
 */

// Default API URLs
export const DEFAULT_API_URLS = {
  OFFER1: 'https://api.offer1.com/offers',
  OFFER2: 'https://api.offer2.com/offers',
  OFFER3: 'https://api.offer3.com/offers',
} as const;

// Environment variable keys
export const ENV_KEYS = {
  OFFER1_API_URL: 'OFFER1_API_URL',
  OFFER2_API_URL: 'OFFER2_API_URL',
  OFFER3_API_URL: 'OFFER3_API_URL',
} as const;

// Provider names
export const PROVIDER_NAMES = {
  OFFER1: 'offer1',
  OFFER2: 'offer2',
  OFFER3: 'offer3',
} as const;

// Database field name mappings
export const DB_FIELD_NAMES = {
  IS_DESKTOP: 'is_desktop',
  IS_ANDROID: 'is_android',
  IS_IOS: 'is_ios',
  OFFER_URL_TEMPLATE: 'offer_url_template',
  PROVIDER_NAME: 'provider_name',
  EXTERNAL_OFFER_ID: 'external_offer_id',
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

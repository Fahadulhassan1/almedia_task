import {
  DEFAULT_API_URLS,
  ENV_KEYS,
  PROVIDER_NAMES,
  DB_FIELD_NAMES,
  HTTP_STATUS,
} from '../../src/constants/api.constants';

describe('ApiConstants', () => {
  describe('DEFAULT_API_URLS', () => {
    it('should have correct default API URLs', () => {
      expect(DEFAULT_API_URLS.OFFER1).toBe('https://api.offer1.com/offers');
      expect(DEFAULT_API_URLS.OFFER2).toBe('https://api.offer2.com/offers');
      expect(DEFAULT_API_URLS.OFFER3).toBe('https://api.offer3.com/offers');
    });
  });

  describe('ENV_KEYS', () => {
    it('should have correct environment variable keys', () => {
      expect(ENV_KEYS.OFFER1_API_URL).toBe('OFFER1_API_URL');
      expect(ENV_KEYS.OFFER2_API_URL).toBe('OFFER2_API_URL');
      expect(ENV_KEYS.OFFER3_API_URL).toBe('OFFER3_API_URL');
    });
  });

  describe('PROVIDER_NAMES', () => {
    it('should have correct provider names', () => {
      expect(PROVIDER_NAMES.OFFER1).toBe('offer1');
      expect(PROVIDER_NAMES.OFFER2).toBe('offer2');
      expect(PROVIDER_NAMES.OFFER3).toBe('offer3');
    });
  });

  describe('DB_FIELD_NAMES', () => {
    it('should have correct database field name mappings', () => {
      expect(DB_FIELD_NAMES.IS_DESKTOP).toBe('is_desktop');
      expect(DB_FIELD_NAMES.IS_ANDROID).toBe('is_android');
      expect(DB_FIELD_NAMES.IS_IOS).toBe('is_ios');
      expect(DB_FIELD_NAMES.OFFER_URL_TEMPLATE).toBe('offer_url_template');
      expect(DB_FIELD_NAMES.PROVIDER_NAME).toBe('provider_name');
      expect(DB_FIELD_NAMES.EXTERNAL_OFFER_ID).toBe('external_offer_id');
    });
  });

  describe('HTTP_STATUS', () => {
    it('should have correct HTTP status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HTTP_STATUS.SERVICE_UNAVAILABLE).toBe(503);
    });
  });
});

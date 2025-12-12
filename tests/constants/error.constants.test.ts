import {
  HTTP_ERRORS,
  PROVIDER_ERRORS,
  JOB_ERRORS,
} from '../../src/constants/error.constants';

describe('ErrorConstants', () => {
  describe('HTTP_ERRORS', () => {
    it('should have correct HTTP error messages', () => {
      expect(HTTP_ERRORS.INTERNAL_SERVER_ERROR).toBe('Internal Server Error');
      expect(HTTP_ERRORS.NETWORK_ERROR).toBe('Network Error');
      expect(HTTP_ERRORS.UNAUTHORIZED_ERROR).toBe('Unauthorized');
      expect(HTTP_ERRORS.NOT_FOUND_ERROR).toBe('Not Found');
    });
  });

  describe('PROVIDER_ERRORS', () => {
    it('should generate correct provider error messages', () => {
      const providerName = 'test-provider';
      const error = 'Connection failed';

      expect(PROVIDER_ERRORS.FETCH_FAILED(providerName, error))
        .toBe('Failed to fetch offers from test-provider: Connection failed');
      
      expect(PROVIDER_ERRORS.TRANSFORM_FAILED(providerName, error))
        .toBe('Failed to transform offers for test-provider: Connection failed');
      
      expect(PROVIDER_ERRORS.VALIDATION_FAILED(providerName, error))
        .toBe('Validation failed for test-provider: Connection failed');
      
      expect(PROVIDER_ERRORS.SAVE_FAILED(providerName, error))
        .toBe('Failed to save offers for test-provider: Connection failed');
    });
  });

  describe('JOB_ERRORS', () => {
    it('should generate correct job error messages', () => {
      const error = 'Database connection lost';

      expect(JOB_ERRORS.FATAL_ERROR(error)).toBe('Fatal error: Database connection lost');
      expect(JOB_ERRORS.UNEXPECTED_ERROR(error)).toBe('Unexpected job error: Database connection lost');
    });
  });
});

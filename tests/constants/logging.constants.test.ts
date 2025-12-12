import {
  JOB_MESSAGES,
  SUMMARY_MESSAGES,
  PROVIDER_CONFIG_MESSAGES,
} from '../../src/constants/logging.constants';

describe('LoggingConstants', () => {
  describe('JOB_MESSAGES', () => {
    it('should generate correct job messages', () => {
      expect(JOB_MESSAGES.STARTING_SYNC(3)).toBe('Starting offer sync job for 3 provider(s)...');
      expect(JOB_MESSAGES.FETCHING_OFFERS('offer1')).toBe('[offer1] Fetching offers...');
      expect(JOB_MESSAGES.TRANSFORMING_OFFERS('offer2')).toBe('[offer2] Transforming offers...');
      expect(JOB_MESSAGES.VALIDATING_OFFERS('offer1', 10)).toBe('[offer1] Validating 10 offers...');
      expect(JOB_MESSAGES.SAVING_OFFERS('offer2', 5)).toBe('[offer2] Saving 5 valid offers...');
      expect(JOB_MESSAGES.SUCCESSFULLY_SAVED('offer1', 8)).toBe('[offer1] Successfully saved 8 offers');
      expect(JOB_MESSAGES.PROVIDER_FATAL_ERROR('offer2', 'Network error')).toBe('[offer2] Fatal error: Network error');
    });
  });

  describe('SUMMARY_MESSAGES', () => {
    it('should have correct summary message templates', () => {
      expect(SUMMARY_MESSAGES.HEADER).toBe('\n=== Offer Sync Job Summary ===');
      expect(SUMMARY_MESSAGES.PROVIDER_HEADER('offer1')).toBe('\nProvider: offer1');
      expect(SUMMARY_MESSAGES.TOTAL_OFFERS(10)).toBe('  Total offers: 10');
      expect(SUMMARY_MESSAGES.VALID_OFFERS(8)).toBe('  Valid offers: 8');
      expect(SUMMARY_MESSAGES.INVALID_OFFERS(2)).toBe('  Invalid offers: 2');
      expect(SUMMARY_MESSAGES.SAVED_OFFERS(8)).toBe('  Saved offers: 8');
      expect(SUMMARY_MESSAGES.ERRORS_WARNINGS(1)).toBe('  Errors/Warnings: 1');
      expect(SUMMARY_MESSAGES.OVERALL_HEADER).toBe('\n=== Overall Summary ===');
      expect(SUMMARY_MESSAGES.TOTAL_PROCESSED(20)).toBe('Total offers processed: 20');
      expect(SUMMARY_MESSAGES.TOTAL_VALID(16)).toBe('Total valid offers: 16');
      expect(SUMMARY_MESSAGES.TOTAL_SAVED(16)).toBe('Total offers saved: 16');
    });
  });

  describe('PROVIDER_CONFIG_MESSAGES', () => {
    it('should generate correct provider config messages', () => {
      expect(PROVIDER_CONFIG_MESSAGES.SKIPPING_DISABLED('offer3'))
        .toBe('Skipping disabled provider: offer3');
    });
  });
});

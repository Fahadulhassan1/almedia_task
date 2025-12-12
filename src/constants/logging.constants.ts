/**
 * Logging messages and templates
 */

// Job logging messages
export const JOB_MESSAGES = {
  STARTING_SYNC: (providerCount: number) => 
    `Starting offer sync job for ${providerCount} provider(s)...`,
  FETCHING_OFFERS: (providerName: string) => 
    `[${providerName}] Fetching offers...`,
  TRANSFORMING_OFFERS: (providerName: string) => 
    `[${providerName}] Transforming offers...`,
  VALIDATING_OFFERS: (providerName: string, count: number) => 
    `[${providerName}] Validating ${count} offers...`,
  SAVING_OFFERS: (providerName: string, count: number) => 
    `[${providerName}] Saving ${count} valid offers...`,
  SUCCESSFULLY_SAVED: (providerName: string, count: number) => 
    `[${providerName}] Successfully saved ${count} offers`,
  PROVIDER_FATAL_ERROR: (providerName: string, error: string) => 
    `[${providerName}] Fatal error: ${error}`,
} as const;

// Summary logging templates
export const SUMMARY_MESSAGES = {
  HEADER: '\n=== Offer Sync Job Summary ===',
  PROVIDER_HEADER: (providerName: string) => `\nProvider: ${providerName}`,
  TOTAL_OFFERS: (count: number) => `  Total offers: ${count}`,
  VALID_OFFERS: (count: number) => `  Valid offers: ${count}`,
  INVALID_OFFERS: (count: number) => `  Invalid offers: ${count}`,
  SAVED_OFFERS: (count: number) => `  Saved offers: ${count}`,
  ERRORS_WARNINGS: (count: number) => `  Errors/Warnings: ${count}`,
  OVERALL_HEADER: '\n=== Overall Summary ===',
  TOTAL_PROCESSED: (count: number) => `Total offers processed: ${count}`,
  TOTAL_VALID: (count: number) => `Total valid offers: ${count}`,
  TOTAL_SAVED: (count: number) => `Total offers saved: ${count}`,
} as const;

// Provider configuration messages
export const PROVIDER_CONFIG_MESSAGES = {
  SKIPPING_DISABLED: (providerName: string) => 
    `Skipping disabled provider: ${providerName}`,
} as const;

/**
 * Error messages for provider operations
 */

// HTTP Error messages
export const HTTP_ERRORS = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  NETWORK_ERROR: 'Network Error',
  TIMEOUT_ERROR: 'Request Timeout',
  UNAUTHORIZED_ERROR: 'Unauthorized',
  FORBIDDEN_ERROR: 'Forbidden',
  NOT_FOUND_ERROR: 'Not Found',
  BAD_REQUEST_ERROR: 'Bad Request',
} as const;

// Provider error message templates
export const PROVIDER_ERRORS = {
  FETCH_FAILED: (providerName: string, error: string) => 
    `Failed to fetch offers from ${providerName}: ${error}`,
  TRANSFORM_FAILED: (providerName: string, error: string) => 
    `Failed to transform offers for ${providerName}: ${error}`,
  VALIDATION_FAILED: (providerName: string, error: string) => 
    `Validation failed for ${providerName}: ${error}`,
  SAVE_FAILED: (providerName: string, error: string) => 
    `Failed to save offers for ${providerName}: ${error}`,
} as const;

// Job error messages
export const JOB_ERRORS = {
  FATAL_ERROR: (error: string) => `Fatal error: ${error}`,
  UNEXPECTED_ERROR: (error: string) => `Unexpected job error: ${error}`,
} as const;

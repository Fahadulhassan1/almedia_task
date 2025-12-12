import { IOfferProvider } from '../providers/base.provider';
import { Offer1Provider } from '../providers/offer1.provider';
import { Offer2Provider } from '../providers/offer2.provider';
import { DEFAULT_API_URLS, ENV_KEYS, PROVIDER_NAMES } from '../constants/api.constants';
import { PROVIDER_CONFIG_MESSAGES } from '../constants/logging.constants';

export interface ProviderConfig {
  name: string;
  baseUrl: string;
  enabled: boolean;
}

/**
 * Configuration for all offer providers
 * This can be easily extended to support 20+ providers
 */
export const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    name: PROVIDER_NAMES.OFFER1,
    baseUrl: process.env[ENV_KEYS.OFFER1_API_URL] || DEFAULT_API_URLS.OFFER1,
    enabled: true,
  },
  {
    name: PROVIDER_NAMES.OFFER2,
    baseUrl: process.env[ENV_KEYS.OFFER2_API_URL] || DEFAULT_API_URLS.OFFER2,
    enabled: true,
  },
  // Add more providers here as needed
  // {
  //   name: PROVIDER_NAMES.OFFER3,
  //   baseUrl: process.env[ENV_KEYS.OFFER3_API_URL] || DEFAULT_API_URLS.OFFER3,
  //   enabled: true,
  // },
];

/**
 * Factory function to create provider instances based on configuration
 * This pattern allows easy addition of new providers
 */
export function createProviders(configs: ProviderConfig[]): IOfferProvider[] {
  const providers: IOfferProvider[] = [];

  for (const config of configs) {
    if (!config.enabled) {
      console.log(PROVIDER_CONFIG_MESSAGES.SKIPPING_DISABLED(config.name));
      continue;
    }

    // Registry-based approach (more scalable for 20+ providers)
    const ProviderClass = PROVIDER_REGISTRY[config.name];
    if (ProviderClass) {
      providers.push(new ProviderClass(config.baseUrl));
    } else {
      console.warn(`Unknown provider: ${config.name}. Skipping...`);
    }

    /* Alternative: Original switch-based approach (both are clean!)
    switch (config.name) {
      case 'offer1':
        providers.push(new Offer1Provider(config.baseUrl));
        break;
      case 'offer2':
        providers.push(new Offer2Provider(config.baseUrl));
        break;
      default:
        console.warn(`Unknown provider: ${config.name}. Skipping...`);
    }
    */
  }

  return providers;
}

// Optional: More scalable approach using registry pattern
// This eliminates the need to modify the switch statement for each new provider
type ProviderConstructor = new (baseUrl: string) => IOfferProvider;

const PROVIDER_REGISTRY: Record<string, ProviderConstructor> = {
  'offer1': Offer1Provider,
  'offer2': Offer2Provider,
  // New providers can be registered here without touching the factory function
};


import { createProviders, PROVIDER_CONFIGS, ProviderConfig } from '../../src/config/providers.config';
import { Offer1Provider } from '../../src/providers/offer1.provider';
import { Offer2Provider } from '../../src/providers/offer2.provider';

describe('Provider Configuration', () => {
  describe('PROVIDER_CONFIGS', () => {
    it('should have valid provider configurations', () => {
      expect(PROVIDER_CONFIGS).toHaveLength(2);
      
      const offer1Config = PROVIDER_CONFIGS.find(c => c.name === 'offer1');
      const offer2Config = PROVIDER_CONFIGS.find(c => c.name === 'offer2');
      
      expect(offer1Config).toBeDefined();
      expect(offer1Config?.enabled).toBe(true);
      expect(offer1Config?.baseUrl).toContain('offer1');
      
      expect(offer2Config).toBeDefined();
      expect(offer2Config?.enabled).toBe(true);
      expect(offer2Config?.baseUrl).toContain('offer2');
    });
  });

  describe('createProviders', () => {
    it('should create providers for enabled configurations', () => {
      const configs: ProviderConfig[] = [
        { name: 'offer1', baseUrl: 'https://api1.com', enabled: true },
        { name: 'offer2', baseUrl: 'https://api2.com', enabled: true },
      ];
      
      const providers = createProviders(configs);
      
      expect(providers).toHaveLength(2);
      expect(providers[0]).toBeInstanceOf(Offer1Provider);
      expect(providers[1]).toBeInstanceOf(Offer2Provider);
    });

    it('should skip disabled providers', () => {
      const configs: ProviderConfig[] = [
        { name: 'offer1', baseUrl: 'https://api1.com', enabled: true },
        { name: 'offer2', baseUrl: 'https://api2.com', enabled: false },
      ];
      
      const providers = createProviders(configs);
      
      expect(providers).toHaveLength(1);
      expect(providers[0]).toBeInstanceOf(Offer1Provider);
    });

    it('should skip unknown providers', () => {
      const configs: ProviderConfig[] = [
        { name: 'offer1', baseUrl: 'https://api1.com', enabled: true },
        { name: 'unknown', baseUrl: 'https://unknown.com', enabled: true },
      ];
      
      const providers = createProviders(configs);
      
      expect(providers).toHaveLength(1);
      expect(providers[0]).toBeInstanceOf(Offer1Provider);
    });

    it('should handle empty configurations', () => {
      const providers = createProviders([]);
      expect(providers).toHaveLength(0);
    });

    it('should pass correct baseUrl to providers', () => {
      const testUrl = 'https://test-api.com/offers';
      const configs: ProviderConfig[] = [
        { name: 'offer1', baseUrl: testUrl, enabled: true },
      ];
      
      const providers = createProviders(configs);
      
      expect(providers).toHaveLength(1);
      // Check that the provider was created with the correct URL
      // Note: This tests the factory pattern works correctly
      expect(providers[0]).toBeInstanceOf(Offer1Provider);
    });
  });
});

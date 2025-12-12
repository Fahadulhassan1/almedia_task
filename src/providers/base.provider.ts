import { Offer } from '../../offer.entity';

/**
 * Base interface for all offer providers
 * Each provider must implement this interface to ensure consistent behavior
 */
export interface IOfferProvider {
  /**
   * Unique identifier for the provider
   */
  readonly providerName: string;

  /**
   * Fetches offers from the external provider API
   * @returns Raw payload from the provider
   */
  fetchOffers(): Promise<any>;

  /**
   * Transforms provider-specific payload to Offer entities
   * @param payload Raw payload from the provider
   * @returns Array of transformed Offer entities
   */
  transformOffers(payload: any): Offer[];
}

/**
 * Abstract base class for offer providers
 * Provides common functionality and enforces the provider contract
 */
export abstract class BaseOfferProvider implements IOfferProvider {
  abstract readonly providerName: string;
  protected readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetches offers from the external provider API
   * Should be implemented by each provider
   */
  abstract fetchOffers(): Promise<any>;

  /**
   * Transforms provider-specific payload to Offer entities
   * Should be implemented by each provider
   */
  abstract transformOffers(payload: any): Offer[];
}


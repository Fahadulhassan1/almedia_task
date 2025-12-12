import { Offer } from '../../offer.entity';
import { DataSource, Repository } from 'typeorm';

/**
 * Service for database operations related to offers
 */
export class OfferService {
  private offerRepository: Repository<Offer>;

  constructor(private dataSource: DataSource) {
    this.offerRepository = dataSource.getRepository(Offer);
  }

  /**
   * Saves a single offer to the database
   * Uses upsert logic: updates if slug exists, otherwise inserts
   * @param offer The offer to save
   * @returns The saved offer
   */
  async saveOffer(offer: Offer): Promise<Offer> {
    // Check if offer with same slug exists
    const existingOffer = await this.offerRepository.findOne({
      where: { slug: offer.slug },
    });

    if (existingOffer) {
      // Update existing offer
      Object.assign(existingOffer, offer);
      return await this.offerRepository.save(existingOffer);
    } else {
      // Insert new offer
      return await this.offerRepository.save(offer);
    }
  }

  /**
   * Saves multiple offers to the database in a transaction
   * @param offers Array of offers to save
   * @returns Array of saved offers
   */
  async saveOffers(offers: Offer[]): Promise<Offer[]> {
    if (offers.length === 0) {
      return [];
    }

    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      const repository = transactionalEntityManager.getRepository(Offer);
      const savedOffers: Offer[] = [];

      for (const offer of offers) {
        const existingOffer = await repository.findOne({
          where: { slug: offer.slug },
        });

        if (existingOffer) {
          Object.assign(existingOffer, offer);
          savedOffers.push(await repository.save(existingOffer));
        } else {
          savedOffers.push(await repository.save(offer));
        }
      }

      return savedOffers;
    });
  }

  /**
   * Finds an offer by slug
   * @param slug The slug to search for
   * @returns The offer if found, null otherwise
   */
  async findBySlug(slug: string): Promise<Offer | null> {
    return await this.offerRepository.findOne({
      where: { slug },
    });
  }

  /**
   * Finds offers by provider name
   * @param providerName The provider name to filter by
   * @returns Array of offers from the specified provider
   */
  async findByProvider(providerName: string): Promise<Offer[]> {
    return await this.offerRepository.find({
      where: { providerName },
    });
  }
}


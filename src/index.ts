import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Offer } from '../offer.entity';
import { OfferService } from './services/offer.service';
import { OfferSyncJob } from './jobs/offer-sync.job';
import { PROVIDER_CONFIGS, createProviders } from './config/providers.config';

/**
 * Main entry point for the offer sync job
 * This demonstrates how to use the system
 */
async function main() {
  // Initialize database connection
  // In a real application, this would come from environment variables
  const dataSource = new DataSource({
    type: 'mysql', // or 'postgres', 'sqlite', etc.
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'almedia',
    entities: [Offer],
    synchronize: process.env.NODE_ENV !== 'production', // Auto-sync schema in development
    logging: process.env.NODE_ENV === 'development',
  });

  try {
    // Initialize database connection
    await dataSource.initialize();
    console.log('Database connection established');

    // Create offer service
    const offerService = new OfferService(dataSource);

    // Create providers from configuration
    const providers = createProviders(PROVIDER_CONFIGS);
    console.log(`Initialized ${providers.length} provider(s)`);

    // Create and run the sync job
    const syncJob = new OfferSyncJob(offerService);
    await syncJob.processProviders(providers);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    // Close database connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { main };


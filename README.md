# Almedia Offer Sync Job

A scalable job system for extracting, validating, transforming, and storing offers from multiple external offer network providers.

## Features

- **Scalable Architecture**: Designed to easily handle 20+ providers
- **Provider Abstraction**: Clean interface-based design for adding new providers
- **Validation**: Comprehensive validation with detailed error reporting
- **Error Handling**: Graceful error handling - invalid offers are skipped with warnings
- **Database Integration**: TypeORM-based database operations with transaction support
- **Extensible**: Easy to add new providers by implementing the `IOfferProvider` interface

## Architecture

### Core Components

1. **Providers** (`src/providers/`)
   - `base.provider.ts`: Base interface and abstract class
   - `offer1.provider.ts`: Implementation for provider 1
   - `offer2.provider.ts`: Implementation for provider 2

2. **Validators** (`src/validators/`)
   - `offer.validator.ts`: Validates offers before saving

3. **Services** (`src/services/`)
   - `offer.service.ts`: Database operations for offers

4. **Jobs** (`src/jobs/`)
   - `offer-sync.job.ts`: Main orchestrator for syncing offers

5. **Config** (`src/config/`)
   - `providers.config.ts`: Provider configuration and factory

6. **Utils** (`src/utils/`)
   - `slug.generator.ts`: Generates URL-friendly slugs

## Requirements

- Node.js 18+ (for native `fetch` support) or Node.js 16+ with `node-fetch` package
- TypeScript 5.0+
- MySQL/PostgreSQL/SQLite database

## Installation

```bash
npm install
```

## Configuration

Configure providers in `src/config/providers.config.ts` or via environment variables:

- `OFFER1_API_URL`: API URL for provider 1
- `OFFER2_API_URL`: API URL for provider 2
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name

## Usage

### Build

```bash
npm run build
```

### Run

```bash
npm start
```

### Development

```bash
npm run dev
```

## Adding New Providers

To add a new provider:

1. Create a new provider class in `src/providers/` extending `BaseOfferProvider`
2. Implement the `fetchOffers()` and `transformOffers()` methods
3. Add the provider configuration to `PROVIDER_CONFIGS` in `src/config/providers.config.ts`
4. Add a case in the `createProviders()` factory function

Example:

```typescript
// src/providers/offer3.provider.ts
export class Offer3Provider extends BaseOfferProvider {
  readonly providerName = 'offer3';
  
  async fetchOffers(): Promise<any> {
    // Implementation
  }
  
  transformOffers(payload: any): Offer[] {
    // Implementation
  }
}
```

## Processing Flow

1. **Fetch**: Each provider fetches offers from its API endpoint
2. **Transform**: Provider-specific payloads are transformed to `Offer` entities
3. **Validate**: Each offer is validated against business rules
4. **Filter**: Invalid offers are skipped with warnings
5. **Save**: Valid offers are saved to the database (upsert by slug)

## Error Handling

- Individual invalid offers are skipped with detailed warnings
- Provider-level errors don't stop processing of other providers
- All errors are logged and included in the processing summary

## Database Schema

The system uses the `Offer` entity with the following key fields:
- `slug`: Unique identifier (used for upserts)
- `providerName`: Identifies the source provider
- `externalOfferId`: Original ID from the provider
- Platform flags: `isDesktop`, `isAndroid`, `isIos`

## Project Structure

```
almedia_task/
├── src/
│   ├── providers/          # Provider implementations
│   │   ├── base.provider.ts
│   │   ├── offer1.provider.ts
│   │   └── offer2.provider.ts
│   ├── validators/         # Validation logic
│   │   └── offer.validator.ts
│   ├── services/           # Business logic services
│   │   └── offer.service.ts
│   ├── jobs/               # Job orchestrators
│   │   └── offer-sync.job.ts
│   ├── config/             # Configuration
│   │   └── providers.config.ts
│   ├── utils/              # Utility functions
│   │   └── slug.generator.ts
│   └── index.ts            # Main entry point
├── offer.entity.ts         # Offer entity definition
├── offer1.payload.ts       # Example payload from provider 1
├── offer2.payload.ts       # Example payload from provider 2
├── package.json
├── tsconfig.json
└── README.md
```


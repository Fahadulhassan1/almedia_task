import { IOfferProvider } from '../providers/base.provider';
import { OfferValidator } from '../validators/offer.validator';
import { OfferService } from '../services/offer.service';
import { JOB_MESSAGES, SUMMARY_MESSAGES } from '../constants/logging.constants';
import { JOB_ERRORS } from '../constants/error.constants';
import { Offer } from '../../offer.entity';

interface ProcessingResult {
  providerName: string;
  totalOffers: number;
  validOffers: number;
  invalidOffers: number;
  savedOffers: number;
  errors: string[];
}

/**
 * Main job responsible for syncing offers from multiple providers
 */
export class OfferSyncJob {
  private validator: OfferValidator;
  private offerService: OfferService;

  constructor(offerService: OfferService) {
    this.validator = new OfferValidator();
    this.offerService = offerService;
  }

  /**
   * Processes offers from a single provider
   * @param provider The provider to fetch offers from
   * @returns Processing result with statistics
   */
  async processProvider(provider: IOfferProvider): Promise<ProcessingResult> {
    const result: ProcessingResult = {
      providerName: provider.providerName,
      totalOffers: 0,
      validOffers: 0,
      invalidOffers: 0,
      savedOffers: 0,
      errors: [],
    };

    try {
      // Fetch offers from provider
      console.log(JOB_MESSAGES.FETCHING_OFFERS(provider.providerName));
      const payload = await provider.fetchOffers();

      // Transform offers
      console.log(JOB_MESSAGES.TRANSFORMING_OFFERS(provider.providerName));
      const transformedOffers = provider.transformOffers(payload);
      result.totalOffers = transformedOffers.length;

      if (transformedOffers.length === 0) {
        console.warn(`[${provider.providerName}] No offers found in payload`);
        return result;
      }

      // Validate offers
      console.log(JOB_MESSAGES.VALIDATING_OFFERS(provider.providerName, transformedOffers.length));
      const validationResults = this.validator.validateBatch(transformedOffers);

      // Separate valid and invalid offers
      const validOffers: Offer[] = [];
      const invalidOffers: Array<{ offer: Offer; errors: string[] }> = [];

      validationResults.forEach((validationResult, index) => {
        const offer = transformedOffers[index];
        
        if (validationResult.isValid) {
          validOffers.push(offer);
          result.validOffers++;
        } else {
          invalidOffers.push({
            offer,
            errors: validationResult.errors,
          });
          result.invalidOffers++;
          
          // Log warning for invalid offer
          const warningMessage = `[${provider.providerName}] Skipping invalid offer "${offer.name}" (ID: ${offer.externalOfferId}): ${validationResult.errors.join(', ')}`;
          console.warn(warningMessage);
          result.errors.push(warningMessage);
        }
      });

      // Save valid offers
      if (validOffers.length > 0) {
        console.log(JOB_MESSAGES.SAVING_OFFERS(provider.providerName, validOffers.length));
        try {
          const savedOffers = await this.offerService.saveOffers(validOffers);
          result.savedOffers = savedOffers.length;
          console.log(JOB_MESSAGES.SUCCESSFULLY_SAVED(provider.providerName, savedOffers.length));
        } catch (error) {
          const errorMessage = `[${provider.providerName}] Error saving offers: ${error instanceof Error ? error.message : String(error)}`;
          console.error(errorMessage);
          result.errors.push(errorMessage);
        }
      } else {
        console.warn(`[${provider.providerName}] No valid offers to save`);
      }

    } catch (error) {
      const errorMessage = `[${provider.providerName}] Error processing provider: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);
      result.errors.push(errorMessage);
    }

    return result;
  }

  /**
   * Processes offers from multiple providers
   * @param providers Array of providers to process
   * @returns Array of processing results for each provider
   */
  async processProviders(providers: IOfferProvider[]): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = [];

    console.log(JOB_MESSAGES.STARTING_SYNC(providers.length));

    for (const provider of providers) {
      try {
        const result = await this.processProvider(provider);
        results.push(result);
      } catch (error) {
        console.error(JOB_MESSAGES.PROVIDER_FATAL_ERROR(provider.providerName, error instanceof Error ? error.message : String(error)));
        results.push({
          providerName: provider.providerName,
          totalOffers: 0,
          validOffers: 0,
          invalidOffers: 0,
          savedOffers: 0,
          errors: [JOB_ERRORS.FATAL_ERROR(error instanceof Error ? error.message : String(error))],
        });
      }
    }

    // Print summary
    this.printSummary(results);

    return results;
  }

  /**
   * Prints a summary of the processing results
   */
  private printSummary(results: ProcessingResult[]): void {
    console.log(SUMMARY_MESSAGES.HEADER);
    
    let totalOffers = 0;
    let totalValid = 0;
    let totalInvalid = 0;
    let totalSaved = 0;

    results.forEach((result) => {
      console.log(SUMMARY_MESSAGES.PROVIDER_HEADER(result.providerName));
      console.log(SUMMARY_MESSAGES.TOTAL_OFFERS(result.totalOffers));
      console.log(SUMMARY_MESSAGES.VALID_OFFERS(result.validOffers));
      console.log(SUMMARY_MESSAGES.INVALID_OFFERS(result.invalidOffers));
      console.log(SUMMARY_MESSAGES.SAVED_OFFERS(result.savedOffers));
      
      if (result.errors.length > 0) {
        console.log(SUMMARY_MESSAGES.ERRORS_WARNINGS(result.errors.length));
      }

      totalOffers += result.totalOffers;
      totalValid += result.validOffers;
      totalInvalid += result.invalidOffers;
      totalSaved += result.savedOffers;
    });

    console.log(SUMMARY_MESSAGES.OVERALL_HEADER);
    console.log(SUMMARY_MESSAGES.TOTAL_PROCESSED(totalOffers));
    console.log(SUMMARY_MESSAGES.TOTAL_VALID(totalValid));
    console.log(SUMMARY_MESSAGES.INVALID_OFFERS(totalInvalid));
    console.log(SUMMARY_MESSAGES.TOTAL_SAVED(totalSaved));
    console.log('=============================\n');
  }
}


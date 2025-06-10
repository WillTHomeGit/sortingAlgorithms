/**
 * @file test-data-generator.service.ts
 * @description
 * This file provides the `TestDataGenerator` class, which is responsible for
 * pre-generating all the necessary test data (arrays) for the performance
 * benchmarking suite. It creates various array types (scenarios) and sizes
 * based on the configured settings, ensuring that each algorithm is tested
 * against a consistent and diverse set of inputs.
 */

import { ALGORITHMS_TO_TEST } from '../../config/algorithms.config';
import { TestScenario } from '../../config/test-scenarios.config';
import { PERFORMANCE_TEST_SIZES } from '../../config/performance-test.config';
import { getCompatibleScenariosFor } from '../../config/scenario-helper';
import { BenchmarkSettings } from '../benchmark.config';
import { LoggerService } from './logger.service';
import { MasterTestData } from '../types';

/**
 * A service responsible for generating all test data required for benchmarking.
 * It creates arrays for various scenarios and sizes to ensure comprehensive testing.
 */
export class TestDataGenerator {
    /**
     * Initializes the TestDataGenerator with a logger service.
     * @param logger - Service for logging progress during data generation.
     */
    constructor(private readonly logger: LoggerService) {}

    /**
     * Generates a comprehensive set of test data for all compatible scenarios and array sizes.
     * The data is structured as a `MasterTestData` map for easy access during benchmarking.
     * @returns A `MasterTestData` object containing all pre-generated test arrays.
     */
    public generateAll(): MasterTestData {
        this.logger.info('--- Pre-generating all test data... ---');

        // Initialize the master map to store all generated test data.
        const masterTestData: MasterTestData = new Map();
        // Get a unique list of all scenarios that will be tested across all algorithms.
        const allScenarios = this.getAllUniqueScenarios();

        // Iterate through each unique test scenario.
        for (const scenario of allScenarios) {
            // Create a map to hold test arrays for different sizes within the current scenario.
            const scenarioData = new Map<number, number[][]>();
            // Iterate through each defined array size for performance testing.
            for (const size of PERFORMANCE_TEST_SIZES) {
                // Skip size 0 as it's not a valid test size.
                if (size === 0) continue;
                // Determine the number of samples (arrays) to generate for the current size.
                const sampleSize = BenchmarkSettings.getSampleSize(size);
                const testArrays: number[][] = [];
                // Generate the specified number of test arrays using the scenario's generator function.
                for (let i = 0; i < sampleSize; i++) {
                    testArrays.push(scenario.generator(size));
                }
                // Store the generated test arrays for the current size.
                scenarioData.set(size, testArrays);
            }
            // Store the scenario's data (arrays for all sizes) in the master test data map.
            masterTestData.set(scenario.name, scenarioData);
        }

        this.logger.info('--- Test data generation complete. ---');
        return masterTestData;
    }

    /**
     * Retrieves a unique list of all `TestScenario` objects that are compatible
     * with any of the algorithms configured for testing.
     * This ensures that data is only generated for relevant scenarios.
     * @returns An array of unique `TestScenario` objects.
     */
    private getAllUniqueScenarios(): TestScenario[] {
        // Flatten all compatible scenarios from all algorithms into a single array,
        // then reduce them into a Map to ensure uniqueness by scenario name.
        const scenariosMap = ALGORITHMS_TO_TEST
            .flatMap(getCompatibleScenariosFor)
            .reduce((map, scenario) => map.set(scenario.name, scenario), new Map<string, TestScenario>());
        // Convert the Map values back to an array of unique TestScenario objects.
        return Array.from(scenariosMap.values());
    }
}
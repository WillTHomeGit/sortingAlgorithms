// src/runners/performance-tester.ts

import { LoggerService } from '../benchmarking/services/logger.service';
import { ResultManager } from '../benchmarking/services/result-manager.service';
import { TestDataGenerator } from '../benchmarking/services/test-data-generator.service';
import { BenchmarkRunner } from '../benchmarking/benchmark-runner';

/**
 * The main entry point for the performance benchmark.
 * This file is the "Composition Root". It is responsible for:
 * 1. Instantiating all the necessary services (dependencies).
 * 2. Injecting those services into the main application class (`BenchmarkRunner`).
 * 3. Kicking off the application logic.
 */
async function main() {
    // 1. Instantiate services
    const logger = new LoggerService();
    const resultManager = new ResultManager(logger);
    const testDataGenerator = new TestDataGenerator(logger);

    // 2. Inject dependencies into the main runner
    const runner = new BenchmarkRunner(
        logger,
        testDataGenerator,
        resultManager
    );

    // 3. Run the application
    try {
        await runner.run();
    } catch (error) {
        logger.error('A fatal error occurred during the benchmark run:', error);
        process.exit(1); // Exit with an error code
    }
}

// Execute the main function
main();
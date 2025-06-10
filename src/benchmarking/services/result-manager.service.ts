/**
 * @file result-manager.service.ts
 * @description
 * This file provides the `ResultManager` class, responsible for collecting,
 * storing, and saving the performance benchmark results to a file.
 * It ensures that results are persisted in a structured format (JSON)
 * for later analysis and reporting.
 */

import * as fs from 'fs';
import * as path from 'path';
import { PerformanceResult } from '../types';
import { BenchmarkSettings } from '../benchmark.config';
import { LoggerService } from './logger.service';

/**
 * Manages the collection and persistence of performance benchmark results.
 */
export class ResultManager {
    // An array to store all collected performance results.
    private readonly results: PerformanceResult[] = [];

    /**
     * Initializes the ResultManager with a logger service.
     * @param logger - Service for logging messages, including success or failure of saving results.
     */
    constructor(private readonly logger: LoggerService) {}

    /**
     * Adds a single performance result to the collection.
     * @param result - The `PerformanceResult` object to add.
     */
    public add(result: PerformanceResult): void {
        this.results.push(result);
    }

    /**
     * Saves all collected performance results to a JSON file.
     * It creates the reports directory if it doesn't exist and handles file writing errors.
     */
    public save(): void {
        const { REPORTS_DIR, RESULTS_FILENAME } = BenchmarkSettings;
        // Ensure the reports directory exists, create it recursively if not.
        if (!fs.existsSync(REPORTS_DIR)) {
            fs.mkdirSync(REPORTS_DIR, { recursive: true });
        }
        
        // Construct the full output path for the results file.
        const outputPath = path.join(REPORTS_DIR, RESULTS_FILENAME);
        
        try {
            // Write the results array to the file as pretty-printed JSON.
            fs.writeFileSync(outputPath, JSON.stringify(this.results, null, 2));
            this.logger.info(`\nResults successfully saved to: ${path.resolve(outputPath)}`);
        } catch (error) {
            // Log an error if saving fails.
            this.logger.error(`Failed to save results to file: ${outputPath}`, error);
        }
    }
}
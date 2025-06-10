/**
 * @file benchmark-runner.ts
 * @description
 * This file implements the `BenchmarkRunner` class, which orchestrates the
 * performance testing of various sorting algorithms across different data scenarios and array sizes.
 * It manages the execution flow, logs progress, collects performance metrics,
 * and handles early termination of tests based on defined thresholds.
 */

import { performance } from 'perf_hooks';
import { ALGORITHMS_TO_TEST, Algorithm } from '../config/algorithms.config';
import { PERFORMANCE_TEST_SIZES } from '../config/performance-test.config';
import { getCompatibleScenariosFor } from '../config/scenario-helper';
import { BenchmarkSettings } from './benchmark.config';
import { LoggerService } from './services/logger.service';
import { ResultManager } from './services/result-manager.service';
import { TestDataGenerator } from './services/test-data-generator.service';
import { MasterTestData } from './types';

/**
 * Orchestrates the execution of performance benchmarks for sorting algorithms.
 * It runs algorithms against various data scenarios and array sizes,
 * measures their performance, and manages the collection and reporting of results.
 */
export class BenchmarkRunner {
    // Start time of the benchmark suite.
    private totalStartTime: number = 0;
    // Stores previous results to detect performance changes.
    private readonly previousResults = new Map<string, { size: number; time: number }>();
    // Tracks scenarios abandoned due to performance.
    private readonly abandonedScenarios = new Set<string>();

    /**
     * Initializes the BenchmarkRunner with necessary services.
     * @param logger - Service for logging benchmark progress and results.
     * @param testDataGenerator - Service for generating test data arrays.
     * @param resultManager - Service for managing and saving benchmark results.
     */
    constructor(
        private readonly logger: LoggerService,
        private readonly testDataGenerator: TestDataGenerator,
        private readonly resultManager: ResultManager
    ) {}

    /**
     * Starts the benchmark suite, generates data, runs tests, and saves results.
     */
    public async run(): Promise<void> {
        this.logger.header('Starting Performance Benchmark Suite');
        this.totalStartTime = performance.now();

        // Generate all test data.
        const testData = this.testDataGenerator.generateAll();

        // Test each algorithm.
        for (const algorithm of ALGORITHMS_TO_TEST) {
            this.runTestsForAlgorithm(algorithm, testData);
        }

        // Save results.
        this.resultManager.save();
        // Log total duration.
        this.logFooter();
    }
    
    /**
     * Tests an algorithm across scenarios and sizes.
     * @param algorithm - Algorithm to test.
     * @param testData - Pre-generated test data.
     */
    private runTestsForAlgorithm(algorithm: Algorithm, testData: MasterTestData): void {
        this.logger.log(`\n--- Testing Algorithm: "${algorithm.name}" ---`);
        // Get compatible scenarios.
        const compatibleScenarios = getCompatibleScenariosFor(algorithm);

        // For each compatible scenario:
        for (const scenario of compatibleScenarios) {
            this.logger.log(`  - Scenario: "${scenario.name}"`);
            // Create a unique scenario key.
            const scenarioKey = `${algorithm.name}|${scenario.name}`;
            // Get scenario-specific test data.
            const scenarioData = testData.get(scenario.name);

            // Skip if no data.
            if (!scenarioData) continue;

            // For each array size:
            for (const size of PERFORMANCE_TEST_SIZES) {
                // Skip size 0.
                if (size === 0) continue;
                // Break if scenario abandoned.
                if (this.abandonedScenarios.has(scenarioKey)) break;

                // Get test arrays for size and scenario.
                const testArrays = scenarioData.get(size);
                // Skip if no test arrays.
                if (!testArrays) continue;

                // Measure algorithm performance.
                const { averageTime, totalSampleTime } = this.measurePerformance(algorithm, testArrays);
                
                // Log performance results.
                this.logger.log(`    - Size: ${size.toLocaleString().padEnd(8)}: ${averageTime.toFixed(4)} ms (avg of ${testArrays.length} runs in ${totalSampleTime.toFixed(2)} ms)`);
                
                // Add result to manager.
                this.resultManager.add({ algorithmName: algorithm.name, scenarioName: scenario.name, arraySize: size, executionTime: averageTime });
                // Check if scenario should be abandoned.
                this.checkForBailOut(averageTime, size, scenarioKey);
                // Store current result.
                this.previousResults.set(scenarioKey, { size, time: averageTime });
            }
        }
    }

    /**
     * Measures algorithm execution time.
     * @param algorithm - Algorithm to measure.
     * @param testArrays - Arrays to sort.
     * @returns Average and total sample time.
     */
    private measurePerformance(algorithm: Algorithm, testArrays: number[][]) {
        const sampleTimes: number[] = [];
        // Run algorithm for each array and record time.
        for (const array of testArrays) {
            const start = performance.now();
            // Run algorithm on array copy.
            algorithm.fn([...array]);
            const end = performance.now();
            sampleTimes.push(end - start);
        }
        // Calculate total sample time.
        const totalSampleTime = sampleTimes.reduce((sum, time) => sum + time, 0);
        // Calculate average time.
        const averageTime = sampleTimes.length > 0 ? totalSampleTime / sampleTimes.length : 0;
        return { averageTime, totalSampleTime };
    }

    /**
     * Checks if a scenario should be abandoned due to time or quadratic behavior.
     * @param averageTime - Current average time.
     * @param size - Current array size.
     * @param scenarioKey - Algorithm-scenario key.
     */
    private checkForBailOut(averageTime: number, size: number, scenarioKey: string): void {
        // Abandon scenario if time exceeds max.
        if (averageTime > BenchmarkSettings.MAX_EXECUTION_TIME_MS) {
            this.logger.warn(`      ↳ TIME CAP REACHED for ${scenarioKey}. Abandoning scenario.`);
            this.abandonedScenarios.add(scenarioKey);
            return;
        }

        // Get previous result for degradation check.
        const prevResult = this.previousResults.get(scenarioKey);
        // Check for quadratic behavior if previous result exists and time is significant.
        if (prevResult && averageTime > BenchmarkSettings.MIN_TIME_FOR_DETECTION_MS) {
            const sizeRatio = size / prevResult.size;
            const timeRatio = averageTime / prevResult.time;
            // If size and time increased, calculate degradation.
            if (sizeRatio > 1 && timeRatio > 1) {
                const degradationRatio = timeRatio / sizeRatio;
                // If degradation exceeds threshold, abandon.
                if (degradationRatio > BenchmarkSettings.QUADRATIC_BEHAVIOR_THRESHOLD) {
                    this.logger.warn(`      ↳ DETECTED QUADRATIC BEHAVIOR for ${scenarioKey}. Abandoning scenario.`);
                    this.abandonedScenarios.add(scenarioKey);
                }
            }
        }
    }

    /**
     * Logs benchmark suite completion and total duration.
     */
    private logFooter(): void {
        const totalDuration = (performance.now() - this.totalStartTime) / 1000;
        this.logger.header('Benchmark Suite Complete');
        this.logger.log(`Total execution time: ${totalDuration.toFixed(2)} seconds.`);
    }
}
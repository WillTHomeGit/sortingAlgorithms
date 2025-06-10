/**
 * @file performance-tester.ts
 * @description
 * This is the main script for running the performance benchmark suite.
 * It uses a `BenchmarkRunner` to manage the test run, generating a `performance-results.json` file.
 *
 * This runner includes two safety features:
 * 1. A hard time limit for each test to prevent endless runs.
 * 2. A dynamic detector to stop tests showing slow, quadratic (O(n^2)) behavior early.
 */

import { performance } from 'perf_hooks';
import * as fs from 'fs';
import * as path from 'path';
import { ALGORITHMS_TO_TEST, Algorithm } from '../config/algorithms.config';
import { PERFORMANCE_TEST_SIZES } from '../config/performance-test.config';
import { TestScenario } from '../config/test-scenarios.config';
import { getCompatibleScenariosFor } from '../config/scenario-helper';
// Removed worker pool import as it's part of the parallel processing logic.

// All tuning parameters for the benchmark consolidated here.
const benchmarkConfig = {
    /** Max time (in ms) a single benchmark is allowed to run. */
    MAX_EXECUTION_TIME_MS: 60,

    /** When size doubles, if time increases by more than this factor, it's considered quadratic. */
    QUADRATIC_BEHAVIOR_THRESHOLD: 500,

    /** Minimum execution time (in ms) before trend detection kicks in. */
    MIN_TIME_FOR_DETECTION_MS: 10,

    /**
     * Determines how many times to run a test for a given array size.
     * Smaller arrays run more samples for better accuracy.
     */
    getSampleSize: (size: number): number => {
        if (size < 50) return 100;
        if (size < 500) return 25;
        if (size < 5000) return 10;
        return 5;
    }
};

// Interface for the structure of each result record.
export interface PerformanceResult {
    algorithmName: string;
    scenarioName: string;
    arraySize: number;
    executionTime: number;
}

/**
 * Manages the entire benchmark process: running tests, logging, and saving results.
 */
class BenchmarkRunner {
    private readonly results: PerformanceResult[] = [];
    private totalStartTime: number = 0;
    // Stores the last measured time for a given algorithm/scenario to detect trends.
    private readonly previousResults: Map<string, { size: number; time: number }> = new Map();
    // Tracks scenarios that have been abandoned due to performance issues.
    private readonly abandonedScenarios: Set<string> = new Set();

    /**
     * Kicks off the benchmark suite.
     * This is now a standard synchronous function.
     */
    public run(): void {
        this.logHeader();
        this.totalStartTime = performance.now();

        for (const algorithm of ALGORITHMS_TO_TEST) {
            this.runTestsForAlgorithm(algorithm);
        }

        this.logFooter();
        this.saveResults();
        // No worker pool to destroy in a synchronous setup.
    }

    /**
     * Runs all relevant test scenarios for a given algorithm.
     */
    private runTestsForAlgorithm(algorithm: Algorithm): void {
        console.log(`\n--- Testing Algorithm: "${algorithm.name}" ---`);
        const compatibleScenarios = getCompatibleScenariosFor(algorithm);
        for (const scenario of compatibleScenarios) {
            this.runTestForScenario(algorithm, scenario);
        }
    }

    /**
     * Runs tests for all specified array sizes within a given algorithm and scenario.
     */
    private runTestForScenario(algorithm: Algorithm, scenario: TestScenario): void {
        const scenarioKey = `${algorithm.name}|${scenario.name}`;
        console.log(`  - Scenario: "${scenario.name}"`);

        for (const size of PERFORMANCE_TEST_SIZES) {
            // Skip size 0 and bail out if this scenario was previously abandoned.
            if (size === 0) continue;
            if (this.abandonedScenarios.has(scenarioKey)) break;

            // Measure how long the algorithm takes for this size.
            const { averageTime, totalSampleTime, sampleSize } = this.measurePerformance(algorithm, scenario, size);

            console.log(`    - Size: ${size.toLocaleString().padEnd(8)}: ${averageTime.toFixed(4)} ms (avg of ${sampleSize} runs in ${totalSampleTime.toFixed(2)} ms)`);

            // Store the result.
            this.results.push({ algorithmName: algorithm.name, scenarioName: scenario.name, arraySize: size, executionTime: averageTime });

            // Check if we should stop testing this scenario early.
            this.checkForBailOut(averageTime, size, scenarioKey);

            // Record this result for the next trend detection check.
            this.previousResults.set(scenarioKey, { size, time: averageTime });
        }
    }

    /**
     * Executes the algorithm multiple times for a specific configuration
     * and calculates the average execution time.
     */
    private measurePerformance(algorithm: Algorithm, scenario: TestScenario, size: number) {
        const sampleSize = benchmarkConfig.getSampleSize(size);
        const masterArray = scenario.generator(size); // Generate the array once.
        const sampleTimes: number[] = [];

        for (let i = 0; i < sampleSize; i++) {
            const start = performance.now();
            // No 'await' needed as all algorithm functions are now synchronous.
            algorithm.fn([...masterArray]);
            const end = performance.now();
            sampleTimes.push(end - start);
        }

        const totalSampleTime = sampleTimes.reduce((sum, time) => sum + time, 0);
        const averageTime = totalSampleTime / sampleTimes.length;

        return { averageTime, totalSampleTime, sampleSize };
    }

    /**
     * Determines if a scenario should be abandoned due to excessive time or poor scaling.
     */
    private checkForBailOut(averageTime: number, size: number, scenarioKey: string): void {
        // First safety net: Hard time cap.
        if (averageTime > benchmarkConfig.MAX_EXECUTION_TIME_MS) {
            console.log(`      ↳ TIME CAP REACHED. Execution exceeded ${benchmarkConfig.MAX_EXECUTION_TIME_MS}ms. Abandoning scenario.`);
            this.abandonedScenarios.add(scenarioKey);
            return;
        }

        // Second safety net: Quadratic behavior detection.
        const prevResult = this.previousResults.get(scenarioKey);
        // Only check if we have a previous result and the current time is significant enough.
        if (prevResult && averageTime > benchmarkConfig.MIN_TIME_FOR_DETECTION_MS) {
            const sizeRatio = size / prevResult.size;
            const timeRatio = averageTime / prevResult.time;

            // If array size increased and time increased...
            if (sizeRatio > 1 && timeRatio > 1) {
                // Calculate how much worse performance got relative to size increase.
                const degradationRatio = timeRatio / sizeRatio;
                if (degradationRatio > benchmarkConfig.QUADRATIC_BEHAVIOR_THRESHOLD) {
                    console.log(`      ↳ DETECTED QUADRATIC BEHAVIOR. Abandoning scenario.`);
                    this.abandonedScenarios.add(scenarioKey);
                }
            }
        }
    }

    /**
     * Saves all collected performance results to a JSON file.
     */
    private saveResults(): void {
        const reportsDir = path.join(__dirname, '../../reports');
        if (!fs.existsSync(reportsDir)) { fs.mkdirSync(reportsDir, { recursive: true }); }
        const outputPath = path.join(reportsDir, 'performance-results.json');
        try {
            fs.writeFileSync(outputPath, JSON.stringify(this.results, null, 2));
            console.log(`\nResults successfully saved to: ${path.relative(process.cwd(), outputPath)}`);
        } catch (error) {
            console.error(`\nFailed to save results to file: ${outputPath}`, error);
        }
    }

    /** Logs a simple header message when the benchmark starts. */
    private logHeader(): void { console.log('================================================\nSTARTING PERFORMANCE BENCHMARK SUITE\n================================================'); }

    /** Logs a summary message when the benchmark completes. */
    private logFooter(): void {
        const totalDuration = (performance.now() - this.totalStartTime) / 1000;
        console.log('\n================================================\nBENCHMARK SUITE COMPLETE');
        console.log(`Total execution time: ${totalDuration.toFixed(2)} seconds.`);
    }
}

// Create and run the benchmark.
const runner = new BenchmarkRunner();
runner.run();
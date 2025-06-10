/**
 * @file benchmark.config.ts
 * @description
 * This file defines configuration settings for the performance benchmarking suite.
 * It includes thresholds for execution time, parameters for detecting quadratic behavior,
 * and rules for determining the sample size for each test run based on array size.
 * It also specifies the output directory and filename for benchmark results.
 */

/**
 * Defines various settings and thresholds used throughout the benchmarking process.
 */
export const BenchmarkSettings = {
    /** Max execution time for a single test (ms). Exceeding this abandons the scenario. */
    MAX_EXECUTION_TIME_MS: 60,

    /** Threshold for detecting quadratic (O(n^2)) behavior. */
    QUADRATIC_BEHAVIOR_THRESHOLD: 500,

    /** Minimum execution time (ms) for quadratic behavior detection to be active. */
    MIN_TIME_FOR_DETECTION_MS: 10,

    /**
     * Determines the number of samples (test arrays) for a given array size.
     * Balances thoroughness with benchmark duration.
     * @param size - The array size.
     * @returns Number of samples to use.
     */
    getSampleSize: (size: number): number => {
        if (size < 50) return 200;
        if (size < 500) return 100;
        if (size < 1000) return 50;
        if (size < 2000) return 40;
        if (size < 3000) return 30;
        if (size < 6000) return 20;
        if (size < 10000) return 10;
        return 5;
    },

    /** Directory for saving benchmark reports. */
    REPORTS_DIR: './reports',
    /** Filename for detailed performance results (JSON). */
    RESULTS_FILENAME: 'performance-results.json',
};
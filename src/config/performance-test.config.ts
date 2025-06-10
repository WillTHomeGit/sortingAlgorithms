/**
 * @file performance-test.config.ts
 * @description
 * This file configures the parameters for performance testing of sorting algorithms.
 * It defines static test array sizes and parameters for dynamically generating
 * incremental test sizes, along with the number of samples to run per size.
 */

/**
 * Configuration object for performance tests.
 */
export const performanceTestConfig = {
    /**
     * An array of specific, fixed sizes for test arrays.
     */
    staticTestSizes: [
        100_000
    ],

    /**
     * Parameters for generating a range of test sizes dynamically.
     */
    dynamicTestParameters: {
        enabled: true, // Whether to use dynamic test sizes
        startingSize: 5, // The smallest array size to test
        maxSize: 30_000, // The largest array size to test
        growthFactor: 1.1 // Factor by which array size increases in each step
    },

    /**
     * The number of times each algorithm will be run for a given array size.
     */
    samplesPerSize: 5,
};

/**
 * Generates an array of incrementally growing test sizes based on provided parameters.
 * @param params - Object containing startingSize, maxSize, and growthFactor.
 * @returns An array of numbers representing the test sizes.
 */
function generateIncrementalTestSizes(params: { startingSize: number, maxSize: number, growthFactor: number }): number[] {
    const sizes: number[] = [];
    let current = params.startingSize;
    while (current <= params.maxSize) {
        sizes.push(Math.floor(current));
        current *= params.growthFactor;
    }
    return sizes;
}

// Combine static and dynamically generated sizes, ensuring uniqueness.
const combinedSizes = new Set<number>(performanceTestConfig.staticTestSizes);

// If dynamic test parameters are enabled, generate and add them to the set.
if (performanceTestConfig.dynamicTestParameters.enabled) {
    const dynamicSizes = generateIncrementalTestSizes(performanceTestConfig.dynamicTestParameters);
    
    dynamicSizes.forEach(size => combinedSizes.add(size));
}

// Convert the set back to an array and sort it for consistent testing order.
const finalSizes = Array.from(combinedSizes).sort((a, b) => a - b);

/**
 * The final, sorted array of all test sizes to be used in performance benchmarks.
 */
export const PERFORMANCE_TEST_SIZES = finalSizes;
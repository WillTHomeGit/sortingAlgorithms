/**
 * @file performance-test.config.ts
 * @description
 * This file acts as the primary "control panel" for the performance benchmark runner.
 * It contains all the parameters that dictate how the performance tests are executed,
 * such as the list of array sizes to test against, the number of samples to take
 * for each test, and the threshold for skipping slow algorithms.
 *
 * It demonstrates how to combine a static list of sizes with dynamically generated
 * ones to create a comprehensive yet flexible set of test parameters.
 */

export const performanceTestConfig = {
    /**
     * A fixed list of array sizes to benchmark against for specific data points.
     */
    staticTestSizes: [
        100_000
    ],

    /**
     * Parameters to dynamically generate additional test sizes.
     */
    dynamicTestParameters: {
        enabled: true, // You can set this to false to turn off dynamic generation
        startingSize: 5,
        maxSize: 30_000,
        growthFactor: 1.1
    },

    /**
     * The number of times to run each sort to get a stable average time.
     */
    samplesPerSize: 5,
};

// STEP 2: Define your generator function (your code is perfect).
function generateIncrementalTestSizes(params: { startingSize: number, maxSize: number, growthFactor: number }): number[] {
    const sizes: number[] = [];
    let current = params.startingSize;
    while (current <= params.maxSize) {
        sizes.push(Math.floor(current));
        current *= params.growthFactor;
    }
    return sizes;
}

// STEP 3: Generate, combine, and export the final list of test sizes.

// Start with the static list. Using a Set automatically handles duplicates for us.
const combinedSizes = new Set<number>(performanceTestConfig.staticTestSizes);

// Check if dynamic generation is enabled
if (performanceTestConfig.dynamicTestParameters.enabled) {
    // Run your function and SAVE the result
    const dynamicSizes = generateIncrementalTestSizes(performanceTestConfig.dynamicTestParameters);
    
    // Add the newly generated sizes to our set
    dynamicSizes.forEach(size => combinedSizes.add(size));
}

// Convert the Set back to an array and sortSD it numerically.
const finalSizes = Array.from(combinedSizes).sort((a, b) => a - b);


// STEP 4: EXPORT the final, ready-to-use array.
/**
 * The definitive list of array sizes to be used in the performance benchmark.
 * This list is a combination of the static and dynamically generated sizes.
 */
export const PERFORMANCE_TEST_SIZES = finalSizes;
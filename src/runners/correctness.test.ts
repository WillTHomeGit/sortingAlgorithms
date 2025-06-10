/**
 * @file correctness.test.ts
 * @description
 * This file contains the test suite for verifying the correctness of sorting algorithms.
 * It iterates through various algorithms and test scenarios, ensuring that each algorithm
 * correctly sorts arrays of different sizes and types, and does not mutate the original input array.
 */

import { describe, it, expect } from '@jest/globals';
import { ALGORITHMS_TO_TEST, Algorithm } from '../config/algorithms.config';
import { TestScenario } from '../config/test-scenarios.config';
import { getCompatibleScenariosFor } from '../config/scenario-helper';

/**
 * Defines a set of array sizes to be used for correctness testing.
 * Includes edge cases like empty, single-element, and small arrays, as well as a larger size.
 */
const CORRECTNESS_TEST_SIZES = [0, 1, 2, 17, 100];

/**
 * Generates the expected sorted result for a given array using JavaScript's native sort.
 * This serves as the ground truth for correctness assertions.
 * @param arr - The input array to be sorted.
 * @returns A new array containing the sorted elements.
 */
const getExpectedResult = (arr: number[]): number[] => [...arr].sort((a, b) => a - b);

/**
 * Main test suite for sorting algorithm correctness.
 * It dynamically generates tests for each algorithm and compatible scenario.
 */
describe('Sorting Algorithm Correctness Suite', () => {

    // Iterate over each algorithm defined in the configuration.
    ALGORITHMS_TO_TEST.forEach((algorithm: Algorithm) => {
        describe(`Algorithm: ${algorithm.name}`, () => {
            
            // Determine which test scenarios are compatible with the current algorithm.
            const compatibleScenarios = getCompatibleScenariosFor(algorithm);

            // For each compatible scenario, run a nested test suite.
            compatibleScenarios.forEach((scenario: TestScenario) => {
                describe(`Scenario: ${scenario.name}`, () => {
                    
                    // Run the same test for each defined correctness test size.
                    it.each(
                        CORRECTNESS_TEST_SIZES.map(size => [size])
                    )('should correctly sort and not mutate an array of size %s', (size) => {
                        // Arrange: Prepare the input data and expected output.
                        const inputArray = scenario.generator(size); // Generate array based on scenario and size.
                        const originalSnapshot = [...inputArray]; // Create a copy to check for mutation.
                        const expectedOutput = getExpectedResult(inputArray); // Get the correctly sorted version.
                        
                        // Act: Execute the algorithm's sorting function.
                        const actualOutput = algorithm.fn(inputArray);
                        
                        // Assert: Verify the results.
                        expect(actualOutput).toEqual(expectedOutput); // Check if the output is correctly sorted.
                        expect(inputArray).toEqual(originalSnapshot); // Check if the original array was not modified.
                    });
                });
            });
        });
    });
});
/**
 * @file correctness.test.ts
 * @description
 * This suite tests the correctness and immutability of all sorting algorithms.
 * It dynamically generates tests for each algorithm, scenario, and array size,
 * ensuring thorough verification and easy debugging.
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import { ALGORITHMS_TO_TEST, Algorithm } from '../config/algorithms.config';
import { TestScenario } from '../config/test-scenarios.config';
import { getCompatibleScenariosFor } from '../config/scenario-helper';

// Array sizes for correctness tests. Includes edge cases and small arrays.
const CORRECTNESS_TEST_SIZES = [0, 1, 2, 17, 100];

/**
 * Generates the expected sorted array using native `.sort()`.
 * This serves as our "ground truth" for correctness.
 * @param arr The unsorted input array.
 * @returns A new, numerically sorted array.
 */
const getExpectedResult = (arr: number[]): number[] => {
  // Use a copy to avoid modifying the original array.
  // `a - b` is crucial for correct numeric sorting.
  return [...arr].sort((a, b) => a - b);
};

describe('Sorting Algorithm Correctness Suite', () => {

  // Loop through each sorting algorithm defined in the config.
  ALGORITHMS_TO_TEST.forEach((algorithm: Algorithm) => {
    describe(`Algorithm: ${algorithm.name}`, () => {
      // Get only scenarios that this algorithm is set up to handle.
      const compatibleScenarios = getCompatibleScenariosFor(algorithm);

      // For each compatible scenario...
      compatibleScenarios.forEach((scenario: TestScenario) => {

        describe(`Scenario: ${scenario.name}`, () => {

          // ...test against specific array sizes.
          CORRECTNESS_TEST_SIZES.forEach((size: number) => {

            let inputArray: number[];
            let originalSnapshot: number[]; // A copy of the input before sorting
            let actualOutput: number[];     // The result from the algorithm
            let expectedOutput: number[];   // The known correct sorted array

            // Setup for the 'it' blocks. Runs once per size/scenario combo.
            // This is efficient, as the array generation and sort execution happen only once.
            beforeAll(() => {
              // Arrange data
              inputArray = scenario.generator(size);
              originalSnapshot = [...inputArray]; // Save original state to check immutability
              expectedOutput = getExpectedResult(inputArray);

              // Act: Run the algorithm (now purely synchronous)
              actualOutput = algorithm.fn(inputArray);
            });

            // Test 1: Check if the algorithm's output is correctly sorted.
            it(`should produce a correctly sorted array for size ${size}`, () => {
              expect(actualOutput).toEqual(expectedOutput);
            });

            // Test 2: Check if the algorithm mutated the original input array.
            it(`should not mutate the original input array for size ${size}`, () => {
              expect(inputArray).toEqual(originalSnapshot);
            });

          }); // End of size loop
        }); // End of scenario describe
      }); // End of scenario loop
    }); // End of algorithm describe
  }); // End of algorithm loop
}); // End of main suite
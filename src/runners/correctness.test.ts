/**
 * @file correctness.test.ts
 * @description
 * This file contains the correctness test suite for all sorting algorithms.
 *
 * It is designed to be highly modular and descriptive. It dynamically generates
 * a test case for every combination of algorithm, test scenario, and array size.
 *
 * For each combination, it verifies two critical properties:
 * 1.  Correctness: The output of the algorithm is a numerically sorted array.
 * 2.  Immutability: The algorithm does not modify (mutate) the original input array.
 *
 * This structured approach ensures that test reports are granular and that failures
 * can be quickly traced to the specific algorithm and data conditions that caused them.
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import { ALGORITHMS_TO_TEST, Algorithm } from '../config/algorithms.config';
import { TestScenario } from '../config/test-scenarios.config';
import { getCompatibleScenariosFor } from '../config/scenario-helper';

// =============================================================================
// TEST CONSTANTS
// =============================================================================

/**
 * A curated list of array sizes for correctness checks.
 * This includes important edge cases (0, 1) and small, non-trivial sizes
 * to ensure algorithms handle different scales correctly without being slow.
 */
const CORRECTNESS_TEST_SIZES = [0, 1, 2, 17, 100];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Establishes the "ground truth" for what a correctly sorted array should look like.
 * It uses JavaScript's built-in, highly-optimized Timsort algorithm.
 * @param arr The unsorted input array.
 * @returns A new array containing the elements of the input, sorted numerically.
 */
const getExpectedResult = (arr: number[]): number[] => {
  // Create a copy to ensure the helper itself is a pure function.
  const sortedArr = [...arr];
  // The compare function `(a, b) => a - b` is essential for sorting numbers correctly.
  sortedArr.sort((a, b) => a - b);
  return sortedArr;
};

// =============================================================================
// TEST SUITE
// =============================================================================

describe('Sorting Algorithm Correctness Suite', () => {

  // Level 1: Iterate over each algorithm from the configuration.
  ALGORITHMS_TO_TEST.forEach((algorithm: Algorithm) => {
    describe(`Algorithm: ${algorithm.name}`, () => {
      // Get only the scenarios that this specific algorithm can handle.
      const compatibleScenarios = getCompatibleScenariosFor(algorithm);

      // Now loop over the pre-filtered list.
      compatibleScenarios.forEach((scenario: TestScenario) => {
        
        describe(`Scenario: ${scenario.name}`, () => {
        
            
          // Level 3: For each scenario, test against all specified sizes.
          CORRECTNESS_TEST_SIZES.forEach((size: number) => {

            // We use `beforeAll` within this `describe` block to set up the context
            // for the two `it` blocks below. This is efficient as we only generate
            // the array and run the algorithm *once* per size.
            let inputArray: number[];
            let originalSnapshot: number[];
            let actualOutput: number[];
            let expectedOutput: number[];

            beforeAll(() => {
              // --- ARRANGE ---
              inputArray = scenario.generator(size);
              originalSnapshot = [...inputArray]; // Critical for the immutability check.
              expectedOutput = getExpectedResult(inputArray);
              
              // --- ACT ---
              actualOutput = algorithm.fn(inputArray);
            });

            /**
             * Test 1: Verify Correctness
             * This test checks if the output from the algorithm matches the
             * expected sorted array.
             */
            it(`should produce a correctly sorted array for size ${size}`, () => {
              // --- ASSERT ---
              expect(actualOutput).toEqual(expectedOutput);
            });

            /**
             * Test 2: Verify Immutability
             * This test ensures that the algorithm has not changed the original
             * input array, a core requirement of this project.
             */
            it(`should not mutate the original input array for size ${size}`, () => {
              // --- ASSERT ---
              expect(inputArray).toEqual(originalSnapshot);
            });

          }); // End of size loop
        }); // End of scenario describe
      }); // End of scenario loop
    }); // End of algorithm describe
  }); // End of algorithm loop
}); // End of main suite
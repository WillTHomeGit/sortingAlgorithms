/**
 * @file test-scenarios.config.ts
 * @description
 * This file defines the complete set of data conditions, or "scenarios,"
 * used to test the sorting algorithms. Each scenario specifies a particular type of array
 * (e.g., random, sorted, reversed, float-based, etc.) that presents a unique
 * challenge or highlights a specific performance characteristic of an algorithm.
 */

import { generateRandomArray, generateSortedArray, generateNearlySortedArray } from "../data/testArrayGenerator";

/**
 * The underlying type structure for each "Scenario Generator".
 * This defines a simple function that the test runner can call with just the array size.
 */
export type ScenarioGenerator = (size: number) => number[];

/**
 * The structure for each test scenario configuration.
 */
export interface TestScenario {
    name: string; // A descriptive name for test reports and charts.
    generator: ScenarioGenerator; // The function that creates the array for the scenario.
    dataType: 'integer' | 'float'; // The type of data in the array (integer or float).
}

/**
 * The master list of test scenarios that your runners will import and loop through.
 */
export const scenariosToTest: TestScenario[] = [
    // Scenarios using generateRandomArray
    {
        name: 'on a random array of integers',
        // We use an arrow function to "wrap" the original generator,
        // providing the specific arguments we want for this test case.
        generator: (size) => generateRandomArray(size, size * Math.floor(Math.random() * 10) + 1, 'integer'),
        dataType: 'integer',
    },
    {
        name: 'on a random array of floats',
        generator: (size) => generateRandomArray(size, size * Math.floor(Math.random() * 10) + 1, 'float'),
        dataType: 'float',
    },
    {
        name: 'on a random integer array with many duplicates',
        // By setting a low max magnitude, we ensure many numbers will be repeated.
        generator: (size) => generateRandomArray(size, Math.floor(size / 10), 'integer'),
        dataType: 'integer',
    },
    {
        name: 'on a random integer array with a sparse distribution (large values)',
        // Here, we make the max value HUGE compared to the array size.
        // This is the worst-case for Counting Sort's memory and k-dependent loop.
        generator: (size) => generateRandomArray(size, size * 100, 'integer'),
        dataType: 'integer',
    },

    // Scenarios using generateSortedArray
    {
        name: 'on a perfectly sorted ascending array',
        generator: (size) => generateSortedArray(size, 'integer', false),
        dataType: 'integer',
    },
    {
        name: 'on a perfectly sorted descending (reversed) array',
        // This is a classic "worst-case" scenario for many sorting algorithms like basic QuickSort.
        generator: (size) => generateSortedArray(size, 'integer', true),
        dataType: 'integer',
    },
    {
        name: 'on a perfectly sorted array of floats',
        generator: (size) => generateSortedArray(size, 'float', false),
        dataType: 'float'
    },

    // Scenarios using generateNearlySortedArray
    {
        name: 'on a nearly sorted (5% chaos) ascending array',
        // This often represents a "best-case" for algorithms like Insertion Sort.
        generator: (size) => generateNearlySortedArray(size, 5, false, 'integer'),
        dataType: 'integer',
    },
    {
        name: 'on a nearly sorted (5% chaos) descending array',
        generator: (size) => generateNearlySortedArray(size, 5, true, 'integer'),
        dataType: 'integer',
    },
    {
        name: 'on a highly shuffled (40% chaos) array',
        generator: (size) => generateNearlySortedArray(size, 40, false, 'integer'),
        dataType: 'integer',
    },
    
];

/**
 * @file types.ts
 * @description
 * This file defines TypeScript interfaces and types used across the benchmarking module.
 * It includes the structure for storing individual performance test results and
 * the complex type for the master test data generated for all scenarios and array sizes.
 */

/**
 * Represents a single performance test result.
 */
export interface PerformanceResult {
    /** Algorithm name. */
    algorithmName: string;
    /** Data scenario name. */
    scenarioName: string;
    /** Array size. */
    arraySize: number;
    /** Execution time in milliseconds. */
    executionTime: number;
}

/**
 * Comprehensive collection of all test data.
 * Map: scenario name (string) -> Map: array size (number) -> number[][] (test instances).
 */
export type MasterTestData = Map<string, Map<number, number[][]>>;
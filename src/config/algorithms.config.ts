/**
 * @file algorithms.config.ts
 * @description
 * This file serves as the master registry for all sorting algorithms available in the project.
 * It is the single source of truth for defining an algorithm's properties, including its
 * human-readable name, its function implementation, and its operational metadata
 * (e.g., whether it's slow or what data types it accepts).
 *
 * To add, remove, or modify an algorithm for all test suites (correctness, performance, etc.),
 * this is the only file you need to change.
 */


// 1. IMPORT THE ALGORITHMS
// We import everything exported from the `../algorithms/index.ts` barrel file
// into a single "algorithms" namespace. This keeps the import list clean.
import * as algorithms from '../algorithms';

// 2. DEFINE THE DATA STRUCTURES (TYPES)
// A consistent function signature for all sorting algorithms.
export type SortingFunction = (arr: number[]) => number[];

// The data types an algorithm is designed to handle.
export type AcceptedData = 'integers' | 'all'; // 'all' includes floats and negatives

// The structure for each algorithm object in our master list.
export interface Algorithm {
    name: string;        // The human-readable name for reports and charts.
    fn: SortingFunction; // The actual sorting function to be executed.
    accepts?: AcceptedData; // << --- ADD THIS NEW PROPERTY
}

// 3. CREATE AND EXPORT THE MASTER LIST
// This is the array that will be imported by your test runners.
export const ALGORITHMS_TO_TEST: Algorithm[] = [
  // --- Slow O(n^2) Algorithms ---
  { name: 'Bubble Sort',       fn: algorithms.bubbleSort},
  { name: 'Bubble Sort Smart', fn: algorithms.bubbleSortSmart},
  { name: 'Insertion Sort',    fn: algorithms.insertionSort},
  { name: 'Selection Sort',    fn: algorithms.selectionSort},
  
  // --- Faster O(n log n) Algorithms ---
  { name: 'Merge Sort',        fn: algorithms.mergeSort },
  { name: 'Quick Sort',        fn: algorithms.quickSort },
  { name: 'Heap Sort',         fn: algorithms.heapSort },
  { name: 'Shell Sort',        fn: algorithms.shellSort },

  // --- Specialized/Linear Time Algorithms ---
  // We now formally declare that these only accept non-negative integers.
  { name: 'Counting Sort',     fn: algorithms.countingSort,     accepts: 'integers' },
  { name: 'Radix Sort',        fn: algorithms.radixSort,        accepts: 'integers' },
  { name: 'Bitwise Radix Sort',fn: algorithms.bitwiseRadixSort, accepts: 'integers' },

  // --- Hybrid and Distribution-Based Algorithms ---
  { name: 'Timsort (Native)', fn: algorithms.timSort },
  // { name: 'Timsort (Native)', fn: algorithms.timSort1 },
  { name: 'Bucket Sort',      fn: algorithms.bucketSort },
];
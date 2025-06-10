/**
 * @file algorithms.config.ts
 * @description
 * This file serves as the master registry for all sorting algorithms available in the project.
 * It is the single source of truth for defining an algorithm's properties, including its
 * human-readable name and its function implementation.
 */

import * as algorithms from '../algorithms';

// --- TYPES ---
// A consistent function signature for all sorting algorithms.
// It is now purely synchronous.
export type SortingFunction = (arr: number[]) => number[];
// The data types an algorithm is designed to handle.
export type AcceptedData = 'integers' | 'all';

// The structure for each algorithm object in our master list.
export interface Algorithm {
    name: string;
    fn: SortingFunction;
    accepts?: AcceptedData;
}

// --- MASTER LIST ---
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

  // --- Hybrid and Other Algorithms ---
  { name: 'Timsort (Native)', fn: (arr) => [...arr].sort((a,b) => a-b) }, // Simplified native sort
  { name: 'Bucket Sort',      fn: algorithms.bucketSort },
];
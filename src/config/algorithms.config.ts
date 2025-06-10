/**
 * @file algorithms.config.ts
 * @description
 * This file defines the configuration for the sorting algorithms to be tested.
 * It includes the `Algorithm` interface and a list of all algorithms available for benchmarking.
 */

import * as algorithms from '../algorithms';

/**
 * Defines the signature for a sorting function.
 */
export type SortingFunction = (arr: number[]) => number[];

/**
 * Specifies the type of data an algorithm can accept.
 */
export type AcceptedData = 'integers' | 'all';

/**
 * Represents a single sorting algorithm with its name, function, and accepted data types.
 */
export interface Algorithm {
    name: string;
    fn: SortingFunction;
    accepts?: AcceptedData; // Optional: specifies if the algorithm only accepts integers
}

/**
 * The master list of sorting algorithms to be included in performance tests.
 * Each entry includes the algorithm's display name and its corresponding function.
 */
export const ALGORITHMS_TO_TEST: Algorithm[] = [
  { name: 'Bubble Sort',       fn: algorithms.bubbleSort},
  { name: 'Bubble Sort Smart', fn: algorithms.bubbleSortSmart},
  { name: 'Insertion Sort',    fn: algorithms.insertionSort},
  { name: 'Selection Sort',    fn: algorithms.selectionSort},
  
  { name: 'Merge Sort',        fn: algorithms.mergeSort },
  { name: 'Quick Sort',        fn: algorithms.quickSort },
  { name: 'Heap Sort',         fn: algorithms.heapSort },
  { name: 'Shell Sort',        fn: algorithms.shellSort },

  // Algorithms specifically designed for integer data
  { name: 'Counting Sort',     fn: algorithms.countingSort,     accepts: 'integers' },
  { name: 'Radix Sort',        fn: algorithms.radixSort,        accepts: 'integers' },
  { name: 'Bitwise Radix Sort',fn: algorithms.bitwiseRadixSort, accepts: 'integers' },

  // Native JavaScript sort for comparison
  { name: 'Timsort (Native)', fn: (arr) => [...arr].sort((a,b) => a-b) },
  { name: 'Bucket Sort',      fn: algorithms.bucketSort },
];
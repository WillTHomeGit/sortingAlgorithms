import { insertionSort } from './insertion-sort'; // We'll use Insertion Sort for the buckets!

/**
 * An implementation of Bucket Sort, which distributes elements into a number
 * of buckets and then sorts each bucket individually. It is highly effective
 * for uniformly distributed data and can handle floats.
 * @param arr The original array.
 * @param bucketSize The number of elements each bucket can hold. Defaults to 5.
 * @returns A new, sorted array.
 */
export function bucketSort(arr: number[], bucketSize: number = 5): number[] {
    if (arr.length <= 1) {
        return [...arr];
    }

    // 1. Find min and max values to determine the range.
    let min = arr[0];
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
        } else if (arr[i] > max) {
            max = arr[i];
        }
    }

    // 2. Create the buckets.
    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

    // 3. Distribute the elements into the buckets.
    for (let i = 0; i < arr.length; i++) {
        const bucketIndex = Math.floor((arr[i] - min) / bucketSize);
        buckets[bucketIndex].push(arr[i]);
    }

    // 4. Sort each bucket and concatenate the results.
    const sortedArray: number[] = [];
    for (let i = 0; i < buckets.length; i++) {
        // Using Insertion Sort is efficient here as buckets are likely small.
        const sortedBucket = insertionSort(buckets[i]);
        sortedArray.push(...sortedBucket);
    }

    return sortedArray;
}
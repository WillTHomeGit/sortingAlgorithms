
/**
 * Swaps two elements in an array.
 * @param arr The array.
 * @param i Index of the first element.
 * @param j Index of the second element.
 */
function swap(arr: number[], i: number, j: number): void {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

/**
 * Partitions the array segment using the last element as the pivot.
 * Elements smaller than the pivot are moved to the left, and larger to the right.
 * @param arr The array to partition.
 * @param low The starting index of the segment.
 * @param high The ending index of the segment.
 * @returns The final index of the pivot.
 */
function partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1; // Index of smaller element

    for (let j = low; j < high; j++) {
        // If the current element is smaller than or equal to the pivot
        if (arr[j] <= pivot) {
            i++;
            swap(arr, i, j);
        }
    }

    // Place the pivot element in its correct position
    swap(arr, i + 1, high);
    return i + 1;
}

/**
 * A robust Quick Sort implementation that uses median-of-three pivot selection
 * to avoid worst-case behavior on sorted or nearly-sorted arrays.
 * @param arr The array to sort.
 * @param low The starting index.
 * @param high The ending index.
 */
function robustQuickSort(arr: number[], low: number, high: number): void {
    if (low < high) {
        // --- Median-of-Three Pivot Selection ---
        const mid = Math.floor(low + (high - low) / 2);

        // Order the low, mid, and high elements
        if (arr[low] > arr[mid]) swap(arr, low, mid);
        if (arr[low] > arr[high]) swap(arr, low, high);
        if (arr[mid] > arr[high]) swap(arr, mid, high);

        // Now, arr[mid] is the median. Move it to the end to be the pivot.
        swap(arr, mid, high);
        // --- End of Pivot Selection ---

        const pivotIndex = partition(arr, low, high);

        // Recursively sort the two sub-arrays
        robustQuickSort(arr, low, pivotIndex - 1);
        robustQuickSort(arr, pivotIndex + 1, high);
    }
}

/**
 * Sorts an array of numbers using the quicksort algorithm.
 * This is a recursive, divide-and-conquer algorithm.
 * The implementation uses the last element as the pivot and is not in-place,
 * meaning it returns a new sorted array.
 *
 * Average Time Complexity: O(n log n)
 * Worst-Case Time Complexity: O(n^2)
 *
 * @param arr The array of numbers to sort.
 * @returns A new array containing the numbers in sorted order.
 */
export function quickSort(arr: number[]): number[] {
    // Adhere to the project's non-mutation requirement by sorting a copy.
    const arrCopy = [...arr];
    
    if (arrCopy.length <= 1) {
        return arrCopy;
    }

    robustQuickSort(arrCopy, 0, arrCopy.length - 1);

    return arrCopy;
}
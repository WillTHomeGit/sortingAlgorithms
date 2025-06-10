/**
 * Swaps two elements in an array.
 */
function swap(arr: number[], i: number, j: number): void {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

/**
 * Partitions the array segment using the last element as the pivot.
 */
function partition(arr: number[], low: number, high: number): number {
    // The pivot is arr[high] (which was set by our median-of-three logic).
    const pivot = arr[high];
    let i = low - 1; 

    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    
    swap(arr, i + 1, high);
    return i + 1;
}

/**
 * A truly robust Quick Sort that combines median-of-three pivot selection
 * with tail-call elimination to prevent stack overflow on all inputs.
 */
function robustQuickSort(arr: number[], low: number, high: number): void {
    // **CHANGED**: The recursive block is now a while loop.
    // This loop handles the sorting of the LARGER partition, preventing deep recursion.
    while (low < high) {
        // --- Median-of-Three Pivot Selection (Your code, which is great!) ---
        const mid = Math.floor(low + (high - low) / 2);
        if (arr[low] > arr[mid]) swap(arr, low, mid);
        if (arr[low] > arr[high]) swap(arr, low, high);
        if (arr[mid] > arr[high]) swap(arr, mid, high);
        // Move the median pivot to the end for the partition function.
        swap(arr, mid, high);
        // --- End of Pivot Selection ---

        const pivotIndex = partition(arr, low, high);

        // **CHANGED**: Instead of two recursive calls, we now decide which partition is smaller.
        const leftSize = pivotIndex - 1 - low;
        const rightSize = high - (pivotIndex + 1);

        if (leftSize < rightSize) {
            // Recurse on the SMALLER (left) partition.
            robustQuickSort(arr, low, pivotIndex - 1);
            // And then loop to handle the LARGER (right) partition.
            low = pivotIndex + 1;
        } else {
            // Recurse on the SMALLER (right) partition.
            robustQuickSort(arr, pivotIndex + 1, high);
            // And then loop to handle the LARGER (left) partition.
            high = pivotIndex - 1;
        }
    }
}

/**
 * Sorts an array of numbers using the quicksort algorithm.
 */
export function quickSort(arr: number[]): number[] {
    const arrCopy = [...arr];
    if (arrCopy.length <= 1) {
        return arrCopy;
    }
    robustQuickSort(arrCopy, 0, arrCopy.length - 1);
    return arrCopy;
}
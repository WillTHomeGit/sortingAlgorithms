/**
 * Helper function for mergeSort. Merges two sorted arrays into one sorted array.
 * @param left A sorted array of numbers.
 * @param right A sorted array of numbers.
 * @returns A new, single sorted array containing all elements from left and right.
 */
function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    // Compare elements from left and right arrays and push the smaller one to the result
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++; // Move to the next element in the left array
        } else {
            result.push(right[rightIndex]);
            rightIndex++; // Move to the next element in the right array
        }
    }

    // After the loop, one of the arrays may still have elements left.
    // Concatenate the remaining elements from either the left or right array.
    // (The slice method will just return an empty array if the index is out of bounds)
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

/**
 * Sorts an array of numbers using the merge sort algorithm.
 * This is a recursive, divide-and-conquer algorithm.
 * Time Complexity: O(n log n) in all cases.
 * @param arr The array of numbers to sort.
 * @returns A new array containing the numbers in sorted order.
 */
export function mergeSort(arr: number[]): number[] {
    // Base case: an array with 0 or 1 element is already sorted
    if (arr.length <= 1) {
        return arr;
    }

    // --- Divide Phase ---
    // Split the array into two halves
    const middle = Math.floor(arr.length / 2);
    const leftHalf = arr.slice(0, middle);
    const rightHalf = arr.slice(middle);

    // Recursively sort both halves
    const sortedLeft = mergeSort(leftHalf);
    const sortedRight = mergeSort(rightHalf);

    // --- Conquer Phase ---
    // Merge the sorted halves
    return merge(sortedLeft, sortedRight);
}
/**
 * Sorts an array of non-negative integers using the counting sort algorithm.
 * This is a non-comparison based sorting technique.
 *
 * NOTE: This implementation is designed for non-negative integers and is not stable.
 * It is highly efficient when the range of input values (k) is not
 * significantly larger than the number of items (n).
 *
 * Time Complexity: O(n + k) where n is the number of elements and k is the maximum value.
 *
 * @param arr The array of non-negative integers to sort.
 * @returns A new array containing the numbers in sorted order.
 */
export function countingSort(arr: number[]) : number[] {
    // Handle trivial cases
    if (arr.length <= 1) {
        return [...arr]; // Return a copy for consistency with other functions
    }

    // --- 1. Find the maximum value ---
    // This determines the size of our temporary counting array.
    let max = 0;
    for (const num of arr) {
        if (num > max) {
            max = num;
        }
    }

    // --- 2. Create the counting array ---
    // This array will store the frequency of each number.
    // The size is `max + 1` to include 0 up to the maximum value.
    // e.g., if max is 99, we need an array of size 100 for indices 0-99.
    const counts = new Array(max + 1).fill(0);

    // --- 3. Populate the counting array ---
    // Iterate through the input array. For each number, increment its
    // corresponding index in the `counts` array.
    for (const num of arr) {
        counts[num]++;
    }

    // --- 4. Reconstruct the sorted array ---
    const sortedArray: number[] = [];
    // Iterate through the `counts` array from 0 up to the max value.
    for (let i = 0; i <= max; i++) {
        // Check if the number 'i' appeared in the original array.
        while (counts[i] > 0) {
            // As long as its count is greater than zero, push 'i' into our result.
            sortedArray.push(i);
            // Decrement the count, as we've now "placed" one instance of 'i'.
            counts[i]--;
        }
    }

    return sortedArray;
}
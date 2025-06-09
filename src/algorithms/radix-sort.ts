// Helper function for Radix Sort (not exported).
// It performs a stable counting sort on the array based on a specific digit's place value.
function countingSortForRadix(arr: number[], digitPlace: number): number[] {
    const n = arr.length;
    const output = new Array(n).fill(0);
    // Count array for digits 0-9
    const count = new Array(10).fill(0);

    // 1. Store the count of each digit at the current digitPlace
    for (let i = 0; i < n; i++) {
        const digit = Math.floor(arr[i] / digitPlace) % 10;
        count[digit]++;
    }

    // 2. Modify the count array to store the cumulative sum.
    // This gives us the correct final position for each element.
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // 3. Build the output array by placing elements in their sorted positions.
    // We iterate backwards to ensure the sort is stable.
    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / digitPlace) % 10;
        const position = count[digit] - 1;
        output[position] = arr[i];
        count[digit]--;
    }

    return output;
}

/**
 * Sorts an array of non-negative integers using the Radix Sort algorithm.
 * It sorts numbers digit by digit, from the least significant to the most significant.
 *
 * NOTE: This implementation is designed for non-negative integers.
 *
 * Time Complexity: O(d * (n + k)) where d is digits in the max number,
 * n is the number of elements, and k is the radix/base (10).
 *
 * @param arr The array of non-negative integers to sort.
 * @returns A new array containing the numbers in sorted order.
 */
export function radixSort(arr: number[]): number[] {
    // Handle trivial cases
    if (arr.length <= 1) {
        return [...arr];
    }

    // 1. Find the maximum number to determine the number of digits.
    let max = 0;
    for (const num of arr) {
        if (num > max) {
            max = num;
        }
    }

    // Create a copy to sort.
    let sortedArr = [...arr];

    // 2. Perform a counting sort for every digit place (1, 10, 100, ...).
    // The loop continues as long as there's a digit in the current place for the max number.
    for (let digitPlace = 1; Math.floor(max / digitPlace) > 0; digitPlace *= 10) {
        sortedArr = countingSortForRadix(sortedArr, digitPlace);
    }

    return sortedArr;
}
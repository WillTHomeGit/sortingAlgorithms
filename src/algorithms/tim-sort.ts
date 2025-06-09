/**
 * A wrapper for the native, highly optimized Timsort algorithm provided by
 * the JavaScript V8 engine (in Node.js and browsers). Timsort is a hybrid
 * algorithm, combining Insertion Sort and Merge Sort for exceptional performance
 * on real-world, often partially-sorted, data.
 * @param arr The original array.
 * @returns A new, sorted array.
 */
export function timSort(arr: number[]): number[] {
    // Create a copy to adhere to the non-mutation requirement.
    const arrCopy = [...arr];

    // The compare function is essential for correct numerical sorting.
    arrCopy.sort((a, b) => a - b);

    return arrCopy;
}
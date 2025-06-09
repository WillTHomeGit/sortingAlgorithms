/**
 * @file testArrayGenerator.ts
 * @description
 * This file is a utility library containing a set of "factory" functions for
 * generating test arrays. Its sole responsibility is to produce arrays with
 * specific characteristics (e.g., random, sorted, nearly sorted) on demand.
 *
 * These functions are self-contained and have no knowledge of the sorting algorithms
 * or test runners. They are the foundational data source for all testing suites.
 */

/**
 * Generates an array of random numbers, either integers or floating points.
 * @param numElements The size of the array.
 * @param maxElementMagnitude The max magnitude of any element in the random generated array.
 * @param dataType Specifies whether to generate 'integer' or 'float' numbers.
 * @returns An array of n random numbers.
 */
export function generateRandomArray(numElements: number, maxElementMagnitude: number = numElements * 2, dataType: 'integer' | 'float' = 'integer'): number[] {
    if (dataType === 'integer') {
        return Array.from({ length: numElements }, () => Math.floor(Math.random() * maxElementMagnitude));
    } else {
        return Array.from({ length: numElements }, () => Math.random() * maxElementMagnitude);
    }
}

/**
 * Generates an array of numbers that is perfectly sorted.
 * @param numElements The size of the array.
 * @param dataType Specifies whether to generate 'integer' or 'float' numbers.
 * @param descending If true, generates the array in descending order. Defaults to false (ascending).
 * @returns An array of n numbers sorted in the specified order.
 */
export function generateSortedArray(numElements: number, dataType: 'integer' | 'float' = 'integer', descending: boolean = false): number[] {
    return Array.from({ length: numElements }, (_, i) => {
        // Determine the base value (e.g., 0, 1, 2... or 9, 8, 7...)
        const baseValue = descending ? numElements - 1 - i : i;

        // Return an integer or a float based on the dataType
        if (dataType === 'integer') {
            return baseValue;
        } else {
            // For floats, add a random fraction to maintain order but prevent perfect uniformity
            return baseValue + Math.random();
        }
    });
}

/**
 * Generates an array of numbers that is almost sorted.
 * @param numElements The size of the array.
 * @param randomness How disorderly in % the array is. e.g., randomness = 5 -> 5% of elements are swapped.
 * @param descending Whether the base array should be ascending or descending.
 * @param dataType Specifies whether to generate 'integer' or 'float' numbers.
 * @returns An array of n numbers that is mostly sorted.
 */
export function generateNearlySortedArray(numElements: number, randomness: number = 5, descending: boolean = false, dataType: 'integer' | 'float' = 'integer'): number[] {
    const testArray = generateSortedArray(numElements, dataType, descending);

    const swaps = Math.floor(numElements * (randomness / 100));
    for (let i = 0; i < swaps; i++) {
        const index1 = Math.floor(Math.random() * numElements);
        const index2 = Math.floor(Math.random() * numElements);
        
        const temp = testArray[index1];
        testArray[index1] = testArray[index2];
        testArray[index2] = temp;
    }
    
    return testArray;
}
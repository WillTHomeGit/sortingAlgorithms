/**
 * Sorts an array using the Insertion Sort algorithm.
 * Creates a new array, leaving the original unchanged.
 */
export function insertionSort(arr: number[]) : number[] {
    // Create a mutable copy to sort
    const newAry: number[] = [...arr];
    const n: number = newAry.length;

    // Start from the second element (first element is considered sorted)
    for (let i = 1; i < n; i++) {
        let j: number = i - 1;  // Pointer for the sorted part
        let key: number = newAry[i]; // The element to be inserted into the sorted part

        // Shift elements in the sorted portion that are greater than 'key'
        // to make space for 'key'
        while (j >= 0 && newAry[j] > key) {
            newAry[j + 1] = newAry[j]; // Shift element right
            j = j - 1;                 // Move pointer left
        }
        // Place 'key' in its correct position
        newAry[j + 1] = key;
    }

    return newAry; // Return the sorted copy
}
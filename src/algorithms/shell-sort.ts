/**
 * Sorts an array of numbers using the Shell Sort algorithm with Knuth's gap sequence.
 * Shell sort is an optimization of insertion sort that allows the exchange of items that are far apart.
 *
 * Time Complexity: Varies by gap sequence. For this sequence, it's between O(n) and O(n^(3/2)).
 *
 * @param arr The array of numbers to sort.
 * @returns A new array containing the numbers in sorted order.
 */
export function shellSort(arr: number[]): number[] {
    const newArr = [...arr];
    const n = newArr.length;

    // --- 1. Generate the Gap Sequence (Knuth's Sequence) ---
    // Start with a gap of 1 and generate the sequence h = 3*h + 1
    // until it's larger than about a third of the array size.
    let gap = 1;
    while (gap < n / 3) {
        gap = gap * 3 + 1; // 1, 4, 13, 40, 121, ...
    }

    // --- 2. Perform Gapped Insertion Sort ---
    // Start with the largest gap and work down to a gap of 1.
    while (gap > 0) {
        // This outer loop iterates through the elements, starting from the first
        // element in the second "gapped" sub-array.
        for (let i = gap; i < n; i++) {
            // Store the current element to be inserted.
            const temp = newArr[i];
            let j = i;

            // This inner loop is the gapped insertion sort.
            // It shifts earlier, gapped elements up until the correct location for `temp` is found.
            while (j >= gap && newArr[j - gap] > temp) {
                newArr[j] = newArr[j - gap];
                j -= gap;
            }
            
            // Place temp in its correct sorted position.
            newArr[j] = temp;
        }

        // Reduce the gap for the next pass. We reverse the formula used to generate it.
        gap = Math.floor(gap / 3);
    }

    return newArr;
}
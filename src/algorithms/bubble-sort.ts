export function bubbleSort(arr: number[]): number[] {
    // Create a mutable copy of the input array
    const newAry: number[] = [...arr];
    const n: number = newAry.length;

    // Outer loop controls the number of passes
    // After each pass, the largest unsorted element is at its correct position
    for (let i: number = n-1; i > 0; i--) 
    {
        // Inner loop for comparisons and swaps
        // It goes up to i because elements after index i are already sorted
        for (let j: number = 0; j < i; j++)
        {
            // Compare adjacent elements
            if (newAry[j] > newAry[j+1]) {
                // Swap elements if they are in the wrong order
                const tElement: number = newAry[j];
                newAry[j] = newAry[j+1];
                newAry[j+1] = tElement;
            }
        }
    }
    // Return the sorted array
    return newAry;
}
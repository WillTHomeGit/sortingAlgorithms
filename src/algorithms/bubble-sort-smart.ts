/**
 * Sorts an array using an optimized Bubble Sort.
 * Includes early termination and last-swap optimization.
 * Creates a new array, original is unchanged.
 */
export function bubbleSortSmart(arr: number[]): number[] {
  // Create a mutable copy to sort
  const newAry: number[] = [...arr];
  const n: number = newAry.length;

  let changed: boolean;        // Flag if any swaps occurred in a pass
  let newEnd: number = n - 1;  // Upper bound for the inner loop (unsorted part)
  let lastSwap: number = 0;    // Index of the last swap in a pass

  // Loop until the array is sorted (no more swaps needed)
  while (newEnd > 0) {
    changed = false; // Reset for current pass
    lastSwap = 0;    // Reset for current pass

    // Iterate through the unsorted portion
    for (let j = 0; j < newEnd; j++)
    {
        // Compare adjacent elements
        if (newAry[j] > newAry[j + 1])
        {
            // Swap if out of order
            const tmp: number = newAry[j];
            newAry[j] = newAry[j+1];
            newAry[j+1] = tmp;

            changed = true;   // A swap happened
            lastSwap = j;     // Record last swap index
        }
    }

    // Optimization: If no swaps, array is sorted.
    if (!changed) break;

    // Optimization: Shrink unsorted portion.
    // Elements after lastSwap are now in place.
    newEnd = lastSwap;
  }
  return newAry;
}
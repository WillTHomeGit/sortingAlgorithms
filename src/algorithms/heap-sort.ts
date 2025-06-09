// Helper function for Heap Sort.
// This function ensures that the subtree rooted at index `i` satisfies the Max Heap property.
// `n` is the size of the heap.
function heapify(arr: number[], n: number, i: number): void {
    let largest = i; // Initialize largest as the root of the subtree
    const leftChildIndex = 2 * i + 1;
    const rightChildIndex = 2 * i + 2;

    // Check if the left child exists and is greater than the root
    if (leftChildIndex < n && arr[leftChildIndex] > arr[largest]) {
        largest = leftChildIndex;
    }

    // Check if the right child exists and is greater than the current largest element
    if (rightChildIndex < n && arr[rightChildIndex] > arr[largest]) {
        largest = rightChildIndex;
    }

    // If the largest element is not the root, we need to swap them
    if (largest !== i) {
        // Swap the root with the largest element
        [arr[i], arr[largest]] = [arr[largest], arr[i]];

        // Recursively call heapify on the affected subtree to ensure it also
        // satisfies the Max Heap property.
        heapify(arr, n, largest);
    }
}

/**
 * Sorts an array of numbers using the Heap Sort algorithm.
 *
 * Time Complexity: O(n log n) for all cases (worst, average, best).
 * Space Complexity: O(1) (in-place).
 *
 * @param arr The array of numbers to sort.
 * @returns A new array containing the numbers in sorted order.
 */
export function heapSort(arr: number[]): number[] {
    // We work on a copy to avoid mutating the original array, matching other functions.
    const heapArr = [...arr];
    const n = heapArr.length;

    // --- Phase 1: Build a Max Heap from the input array ---
    // We start from the last non-leaf node and move up to the root.
    // A non-leaf node is any node with an index less than n / 2.
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(heapArr, n, i);
    }

    // --- Phase 2: Extract elements from the heap one by one ---
    for (let i = n - 1; i > 0; i--) {
        // The largest element is at the root (index 0). Move it to the end.
        [heapArr[0], heapArr[i]] = [heapArr[i], heapArr[0]];

        // The heap is now smaller. Call heapify on the reduced heap (size `i`)
        // to fix the root, which was just disrupted by the swap.
        heapify(heapArr, i, 0);
    }

    return heapArr;
}
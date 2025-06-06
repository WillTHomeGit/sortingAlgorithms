// sortingAlgorithms.ts

const testAry: number[] = 
[
    1,4,3,2,5,6,8,7,9
];


export function bubbleSort(arr: number[]): number[] {
    const newAry: number[] = [...arr];
    const n: number = newAry.length;

    // with array = [3, 2, 1, 5, 4]
    // 1st pass = [2, 1, 3, 4, 5]
    // 2nd pass = [1, 2, 3, 4, 5]
    for (let i: number = n-1; i > 0; i--) 
    {
        for (let j: number = 0; j < i; j++)
        {
            // Swap left element with right if left > right
            if (newAry[j] > newAry[j+1]) {
                const tElement: number = newAry[j];
                newAry[j] = newAry[j+1];
                newAry[j+1] = tElement;
            }
        }
    }
    return newAry;
}


export function bubbleSortSmart(arr: number[]): number[] {
  const newAry: number[] = [...arr];
  const n: number = newAry.length;
  let changed: boolean;
  let newEnd: number = n - 1;
  let lastSwap: number = 0;

  while (newEnd > 0) {
    changed = false;
    lastSwap = 0;

    for (let j = 0; j < newEnd; j++) 
    {
        if (newAry[j] > newAry[j + 1]) 
        {
            const tmp: number = newAry[j];
            newAry[j] = newAry[j+1];
            newAry[j+1] = tmp;
            changed = true;
            lastSwap = j;
        }
    }

    if (!changed) break;
    newEnd = lastSwap;
  }
  return newAry;
}


export function insertionSort(arr: number[]) : number[] {
    const newAry: number[] = [...arr];
    const n: number = newAry.length;

    for (let i = 1; i < n; i++) {
        let j: number = i-1;
        let key: number = newAry[i];
        while (j >= 0 && newAry[j] > key) {
            newAry[j + 1] = newAry[j];
            j = j - 1;
        }
        newAry[j + 1] = key;
    }
    
    return newAry;
}


export function selectionSort(arr: number[]): number[] {
  // make a copy so we don’t mutate the original
  const newAry: number[] = [...arr];
  const n = newAry.length;

  for (let j = 0; j < n - 1; j++) {
    // start by assuming the current "j" element is the minimum
    let min = newAry[j];
    let minIndex = j;

    // look for a smaller element to the right of j
    for (let i = j + 1; i < n; i++) {
      if (newAry[i] < min) {
        min = newAry[i];
        minIndex = i;
      }
    }

    // if we found a new minimum, swap it with position j
    if (minIndex !== j) {
      newAry[minIndex] = newAry[j];
      newAry[j] = min;
    }
  }

  return newAry;
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
 * Sorts an array of numbers using the quicksort algorithm.
 * This is a recursive, divide-and-conquer algorithm.
 * The implementation uses the last element as the pivot and is not in-place,
 * meaning it returns a new sorted array.
 *
 * Average Time Complexity: O(n log n)
 * Worst-Case Time Complexity: O(n^2)
 *
 * @param arr The array of numbers to sort.
 * @returns A new array containing the numbers in sorted order.
 */
export function quickSort(arr: number[]) : number[] {
    // Base case: An array with 0 or 1 element is already sorted, so we can return it.
    if (arr.length <= 1) {
        return arr;
    }

    // --- 1. Pick a Pivot ---
    // We'll select the last element of the array as our pivot.
    const pivot = arr[arr.length - 1];

    // Create a new array containing all elements EXCEPT the pivot.
    const rest = arr.slice(0, arr.length - 1);

    // --- 2. Partition ---
    // Create two new arrays to hold elements smaller or larger than the pivot.
    const left: number[] = [];
    const right: number[] = [];

    // Loop through the remaining elements ("rest").
    // If the element is smaller than or equal to the pivot, put it in the 'left' array.
    // Otherwise, put it in the 'right' array.
    for (const element of rest) {
        if (element <= pivot) {
            left.push(element);
        } else {
            right.push(element);
        }
    }

    // --- 3. Recurse ---
    // Recursively call quicksort on the left and right arrays.
    // This will continue until we hit the base case (arrays with 1 or 0 elements).
    const sortedLeft = quickSort(left);
    const sortedRight = quickSort(right);

    // Combine the sorted left array, the pivot itself, and the sorted right array.
    // The spread syntax (...) makes this easy to read and write.
    return [...sortedLeft, pivot, ...sortedRight];
}

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


/**
 * Sorts an array of non-negative integers using a Bitwise Radix Sort.
 * This implementation sorts numbers by examining 8-bit chunks (a "byte") at a time,
 * using highly efficient bitwise operations instead of slower mathematical division and modulo.
 *
 * Time Complexity: O(d * (n + k)) where d is the number of byte-sized passes (e.g., 4 for 32-bit numbers)
 * and k is the range of a byte (256). This makes it effectively linear, O(n).
 *
 * @param arr The array of non-negative integers to sort.
 * @returns A new array containing the numbers in sorted order.
 */
export function bitwiseRadixSort(arr: number[]): number[] {
    // We work on a copy to avoid mutating the original array.
    let workArr = [...arr];
    let n = workArr.length;

    // Determine the maximum number to know how many bits to consider.
    let max = 0;
    for(const num of workArr) {
        if(num > max) {
            max = num;
        }
    }
    
    // Iterate through the bits, 8 bits at a time (one byte).
    // The loop continues as long as there are bits left to process in the largest number.
    for (let shift = 0; (max >> shift) > 0; shift += 8) {
        // This is our temporary array for this sorting pass
        const output = new Array(n).fill(0);
        
        // The counting array for a byte has 256 possible values (0-255).
        const count = new Array(256).fill(0);

        // 1. Count occurrences of each byte value.
        for (let i = 0; i < n; i++) {
            // Isolate the byte using a right shift and a bitwise AND.
            // (workArr[i] >> shift) moves the target byte to the start.
            // & 255 (or 0xFF) masks it to get just that byte's value.
            const digit = (workArr[i] >> shift) & 255;
            count[digit]++;
        }

        // 2. Create cumulative counts for a stable sort.
        for (let i = 1; i < 256; i++) {
            count[i] += count[i - 1];
        }

        // 3. Build the output array, placing numbers in their sorted positions.
        // We iterate backwards to ensure stability.
        for (let i = n - 1; i >= 0; i--) {
            const digit = (workArr[i] >> shift) & 255;
            const position = count[digit] - 1;
            output[position] = workArr[i];
            count[digit]--;
        }

        // The output of this pass becomes the input for the next.
        workArr = output;
    }

    return workArr;
}


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

// You can also test your new merge sort!
console.log("Bubble Sort Test:", bubbleSort(testAry));
console.log("Bubble Sort Smart Test:", bubbleSortSmart(testAry));
console.log("Insertion Sort Test:", insertionSort(testAry));
console.log("Selection Sort Test:", selectionSort(testAry));
console.log("Merge Sort Test:", mergeSort(testAry));
console.log("Quick Sort Test:", quickSort(testAry));
console.log("Counting Sort Test:", countingSort(testAry));
console.log("Radix Sort Test:", radixSort(testAry));
console.log("Bitwise Radix Sort Test:", bitwiseRadixSort(testAry));
console.log("Heap Sort Test:", heapSort(testAry));
console.log("Shell Sort Test:", shellSort(testAry));

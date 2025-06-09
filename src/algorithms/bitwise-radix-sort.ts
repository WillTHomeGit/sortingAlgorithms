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
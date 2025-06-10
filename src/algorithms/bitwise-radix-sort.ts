export function bitwiseRadixSort(arr: number[]): number[] {
    let workArr = [...arr];
    let n = workArr.length;

    let max = 0;
    for(const num of workArr) {
        if(num > max) {
            max = num;
        }
    }
    
    for (let shift = 0; (max >> shift) > 0; shift += 8) {
        const output = new Array(n).fill(0);
        
        const count = new Array(256).fill(0);

        for (let i = 0; i < n; i++) {
            const digit = (workArr[i] >> shift) & 255;
            count[digit]++;
        }

        for (let i = 1; i < 256; i++) {
            count[i] += count[i - 1];
        }

        for (let i = n - 1; i >= 0; i--) {
            const digit = (workArr[i] >> shift) & 255;
            const position = count[digit] - 1;
            output[position] = workArr[i];
            count[digit]--;
        }

        workArr = output;
    }

    return workArr;
}

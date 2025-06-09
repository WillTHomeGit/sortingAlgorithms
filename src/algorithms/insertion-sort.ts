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
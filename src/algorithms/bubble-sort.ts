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
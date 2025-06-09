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
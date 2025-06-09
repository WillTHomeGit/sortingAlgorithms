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
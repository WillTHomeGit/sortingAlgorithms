// Minimum run length
const MIN_MERGE = 32;

// Pre-computed constants for the galloping mode
const MIN_GALLOP = 7;
let minGallop = MIN_GALLOP;

// Temporary storage for merging runs
let tmp: any[] = [];

/**
 * Sorts an array and returns a new sorted array, leaving the original array unchanged.
 * @param arr The array to sort.
 * @param compare The comparison function.
 * @returns A new array containing the sorted elements.
 */
export function timSort1<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
  // Create a copy to ensure the original array is not mutated
  const newArr = [...arr];
  if (newArr.length < 2) {
    return newArr;
  }
  
  // Call the in-place sorting logic on the copy
  timsortInPlace(newArr, compare);
  
  return newArr;
}

/**
 * Internal Timsort implementation that sorts the array in-place.
 * @param arr The array to sort.
 * @param compare The comparison function.
 */
function timsortInPlace<T>(arr: T[], compare: (a: T, b: T) => number): void {
  let n = arr.length;
  let lo = 0;
  let hi = n;

  // Initial run
  let nRemaining = n;
  let runStart = 0;
  let runLen = 0;

  // Identify and sort initial runs
  while (nRemaining > 0) {
    runLen = countRunAndMakeAscending(arr, runStart, compare);
    binarySort(arr, runStart, runStart + runLen, compare);
    runStart += runLen;
    nRemaining -= runLen;
  }

  // Merge runs
  let stack: [number, number][] = [];
  runStart = 0;
  while (runStart < n) {
    runLen = countRunAndMakeAscending(arr, runStart, compare);
    stack.push([runStart, runLen]);
    runStart += runLen;
    mergeCollapse(arr, stack, compare);
  }

  mergeForceCollapse(arr, stack, compare);
}


function binarySort<T>(arr: T[], lo: number, hi: number, compare: (a: T, b: T) => number): void {
  for (let i = lo + 1; i < hi; i++) {
    const pivot = arr[i];
    let left = lo;
    let right = i;

    while (left < right) {
      const mid = (left + right) >>> 1;
      if (compare(pivot, arr[mid]) < 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    for (let j = i; j > left; j--) {
      arr[j] = arr[j - 1];
    }
    arr[left] = pivot;
  }
}

function countRunAndMakeAscending<T>(arr: T[], lo: number, compare: (a: T, b: T) => number): number {
  let hi = arr.length;
  let runHi = lo + 1;
  if (runHi === hi) {
    return 1;
  }

  if (compare(arr[runHi++], arr[lo]) < 0) { // Descending
    while (runHi < hi && compare(arr[runHi], arr[runHi - 1]) < 0) {
      runHi++;
    }
    reverseRange(arr, lo, runHi);
  } else { // Ascending
    while (runHi < hi && compare(arr[runHi], arr[runHi - 1]) >= 0) {
      runHi++;
    }
  }

  return runHi - lo;
}

function reverseRange<T>(arr: T[], lo: number, hi: number): void {
  hi--;
  while (lo < hi) {
    const t = arr[lo];
    arr[lo++] = arr[hi];
    arr[hi--] = t;
  }
}

function mergeCollapse<T>(arr: T[], stack: [number, number][], compare: (a: T, b: T) => number): void {
  while (stack.length > 1) {
    let n = stack.length - 2;
    if (n > 0 && stack[n - 1][1] <= stack[n][1] + stack[n + 1][1]) {
      if (stack[n - 1][1] < stack[n + 1][1]) {
        n--;
      }
      mergeAt(arr, stack, n, compare);
    } else if (stack[n][1] <= stack[n + 1][1]) {
      mergeAt(arr, stack, n, compare);
    } else {
      break;
    }
  }
}

function mergeForceCollapse<T>(arr: T[], stack: [number, number][], compare: (a: T, b: T) => number): void {
  while (stack.length > 1) {
    let n = stack.length - 2;
    if (n > 0 && stack[n - 1][1] < stack[n + 1][1]) {
      n--;
    }
    mergeAt(arr, stack, n, compare);
  }
}

function mergeAt<T>(arr: T[], stack: [number, number][], i: number, compare: (a: T, b: T) => number): void {
  let [start1, len1] = stack[i];
  let [start2, len2] = stack[i + 1];

  stack[i] = [start1, len1 + len2];
  if (i === stack.length - 2) {
    stack.pop();
  } else {
    stack[i + 1] = stack[i + 2];
    stack.length--;
  }

  const k = gallopRight(arr[start2], arr, start1, len1, 0, compare);
  start1 += k;
  len1 -= k;
  if (len1 === 0) {
    return;
  }

  len2 = gallopLeft(arr[start1 + len1 - 1], arr, start2, len2, len2 - 1, compare);
  if (len2 === 0) {
    return;
  }

  if (len1 <= len2) {
    mergeLo(arr, start1, len1, start2, len2, compare);
  } else {
    mergeHi(arr, start1, len1, start2, len2, compare);
  }
}

function mergeLo<T>(arr: T[], start1: number, len1: number, start2: number, len2: number, compare: (a: T, b: T) => number): void {
    const a = arr.slice(start1, start1 + len1);
    let cursor1 = 0;
    let cursor2 = start2;
    let dest = start1;

    arr[dest++] = arr[cursor2++];
    len2--;

    while (len1 > 0 && len2 > 0) {
        if (compare(arr[cursor2], a[cursor1]) < 0) {
            arr[dest++] = arr[cursor2++];
            len2--;
        } else {
            arr[dest++] = a[cursor1++];
            len1--;
        }
    }

    if (len1 > 0) {
        for (let i = 0; i < len1; i++) {
            arr[dest + i] = a[cursor1 + i];
        }
    }
}

function mergeHi<T>(arr: T[], start1: number, len1: number, start2: number, len2: number, compare: (a: T, b: T) => number): void {
    const b = arr.slice(start2, start2 + len2);
    let cursor1 = start1 + len1 - 1;
    let cursor2 = len2 - 1;
    let dest = start2 + len2 - 1;

    arr[dest--] = arr[cursor1--];
    len1--;

    while (len1 > 0 && len2 > 0) {
        if (compare(b[cursor2], arr[cursor1]) < 0) {
            arr[dest--] = arr[cursor1--];
            len1--;
        } else {
            arr[dest--] = b[cursor2--];
            len2--;
        }
    }

    if (len2 > 0) {
        for (let i = 0; i < len2; i++) {
            arr[dest - i] = b[cursor2 - i];
        }
    }
}

function gallopLeft<T>(key: T, arr: T[], base: number, len: number, hint: number, compare: (a: T, b: T) => number): number {
  let lastOfs = 0;
  let ofs = 1;
  if (compare(arr[base + hint], key) > 0) {
    const maxOfs = hint + 1;
    while (ofs < maxOfs && compare(arr[base + hint - ofs], key) > 0) {
      lastOfs = ofs;
      ofs = (ofs << 1) + 1;
      if (ofs <= 0) { // overflow
        ofs = maxOfs;
      }
    }
    if (ofs > maxOfs) {
      ofs = maxOfs;
    }

    const tmp = lastOfs;
    lastOfs = hint - ofs;
    ofs = hint - tmp;
  } else {
    const maxOfs = len - hint;
    while (ofs < maxOfs && compare(arr[base + hint + ofs], key) <= 0) {
      lastOfs = ofs;
      ofs = (ofs << 1) + 1;
      if (ofs <= 0) {
        ofs = maxOfs;
      }
    }
    if (ofs > maxOfs) {
      ofs = maxOfs;
    }

    lastOfs += hint;
    ofs += hint;
  }

  lastOfs++;
  while (lastOfs < ofs) {
    const m = lastOfs + ((ofs - lastOfs) >>> 1);
    if (compare(arr[base + m], key) > 0) {
      ofs = m;
    } else {
      lastOfs = m + 1;
    }
  }
  return ofs;
}

function gallopRight<T>(key: T, arr: T[], base: number, len: number, hint: number, compare: (a: T, b: T) => number): number {
  let lastOfs = 0;
  let ofs = 1;

  if (compare(key, arr[base + hint]) < 0) {
    const maxOfs = hint + 1;
    while (ofs < maxOfs && compare(key, arr[base + hint - ofs]) < 0) {
      lastOfs = ofs;
      ofs = (ofs << 1) + 1;

      if (ofs <= 0) {
        ofs = maxOfs;
      }
    }
    if (ofs > maxOfs) {
      ofs = maxOfs;
    }

    const tmp = lastOfs;
    lastOfs = hint - ofs;
    ofs = hint - tmp;
  } else {
    const maxOfs = len - hint;
    while (ofs < maxOfs && compare(key, arr[base + hint + ofs]) >= 0) {
      lastOfs = ofs;
      ofs = (ofs << 1) + 1;

      if (ofs <= 0) {
        ofs = maxOfs;
      }
    }
    if (ofs > maxOfs) {
      ofs = maxOfs;
    }

    lastOfs += hint;
    ofs += hint;
  }

  lastOfs++;
  while (lastOfs < ofs) {
    const m = lastOfs + ((ofs - lastOfs) >>> 1);
    if (compare(key, arr[base + m]) < 0) {
      ofs = m;
    } else {
      lastOfs = m + 1;
    }
  }

  return ofs;
}
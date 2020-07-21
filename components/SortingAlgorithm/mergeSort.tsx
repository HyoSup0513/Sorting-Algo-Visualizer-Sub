import { Tsetidx, delay, delaySet } from "../Views/sortingBoard";
import { SetStateAction } from "react";

// Merge Sort
export const mergeSort = async (
  arr: number[],
  setarr: (value: SetStateAction<number[]>) => void,
  setidxI: Tsetidx,
  setidxJ: Tsetidx
) => {
  //Create two arrays for sorting
  let sorted = Array.from(arr);
  let n = sorted.length;
  let buffer = new Array(n);

  for (let size = 1; size < n; size *= 2) {
    for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {
      //Get the two sub arrays
      let left = leftStart,
        right = Math.min(left + size, n),
        leftLimit = right,
        rightLimit = Math.min(right + size, n);
      //Merge the sub arrays
      await merge(
        left,
        right,
        leftLimit,
        rightLimit,
        sorted,
        buffer,
        setarr,
        setidxI,
        setidxJ
      );
    }

    //Swap the sorted sub array and merge them
    let temp = sorted;
    sorted = buffer;
    buffer = temp;
  }
  arr = sorted;
  return arr;
};

const merge = async (
  left: number,
  right: number,
  leftLimit: number,
  rightLimit: number,
  sorted: number[],
  buffer: number[],
  setarr: (value: SetStateAction<number[]>) => void,
  setidxI: Tsetidx,
  setidxJ: Tsetidx
) => {
  let i = left;
  //Compare the two sub arrays and merge them in the sorted order
  await delay(buffer, setarr);
  while (left < leftLimit && right < rightLimit) {
    await delay(buffer, setarr);
    if (sorted[left] <= sorted[right]) {
      await delaySet(i, left, setidxI);
      buffer[i++] = sorted[left++];
    } else {
      await delaySet(i, right, setidxI);
      buffer[i++] = sorted[right++];
    }
  }

  //If there are elements in the left sub arrray then add it to the result
  while (left < leftLimit) {
    await delay(buffer, setarr);
    await delaySet(i, left, setidxJ);
    buffer[i++] = sorted[left++];
  }

  //If there are elements in the right sub array then add it to the result
  while (right < rightLimit) {
    await delay(buffer, setarr);
    await delaySet(i, right, setidxJ);
    buffer[i++] = sorted[right++];
  }
};

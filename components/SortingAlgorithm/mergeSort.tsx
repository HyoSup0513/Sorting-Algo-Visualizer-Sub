import { Tsetidx, delay, delaySet } from "../Views/sortingBoard";
import { SetStateAction } from "react";
// Beep Sound
import Beep from "browser-beep";

// Merge Sort
export const mergeSort = async (
  arr: number[],
  setarr: (value: SetStateAction<number[]>) => void,
  setidxI: Tsetidx,
  setidxJ: Tsetidx,
  allowedVolume: boolean
) => {
  const beepA = Beep({ frequency: 750 });
  const beepB = Beep({ frequency: 280 });
  const beepC = Beep({ frequency: 500 });

  //Create two arrays for sorting
  let sorted = Array.from(arr);
  let n = sorted.length;
  let buffer = new Array(n);

  for (let size = 1; size < n; size *= 2) {
    if (allowedVolume) {
      beepC(1);
    }
    for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {
      if (allowedVolume) {
        beepB(1);
      }
      //Get the two sub arrays
      let left = leftStart,
        right = Math.min(left + size, n),
        leftLimit = right,
        rightLimit = Math.min(right + size, n);
      //Merge the sub arrays
      await delay(buffer, setarr);
      await delaySet(leftStart, leftStart + 1, setidxJ);
      await merge(
        left,
        right,
        leftLimit,
        rightLimit,
        sorted,
        buffer,
        setarr,
        setidxI,
        setidxJ,
        allowedVolume
      );
      await delay(buffer, setarr);
    }

    //Swap the sorted sub array and merge them
    let temp = sorted;
    sorted = buffer;
    buffer = temp;
  }

  return sorted;
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
  setidxJ: Tsetidx,
  allowedVolume: boolean
) => {
  const beepA = Beep({ frequency: 700 });

  let i = left;

  //Compare the two sub arrays and merge them in the sorted order
  while (left < leftLimit && right < rightLimit) {
    if (allowedVolume) {
      beepA(1);
    }
    if (sorted[left] <= sorted[right]) {
      await delay(buffer, setarr);
      await delaySet(i, i + 1, setidxI);
      buffer[i++] = sorted[left++];
      await delay(buffer, setarr);
    } else {
      await delay(buffer, setarr);
      await delaySet(i, i + 1, setidxI);
      buffer[i++] = sorted[right++];
      await delay(buffer, setarr);
    }
  }

  //If there are elements in the left sub arrray then add it to the result
  while (left < leftLimit) {
    await delay(buffer, setarr);
    await delaySet(i, i + 1, setidxI);
    if (allowedVolume) {
      beepA(1);
    }
    buffer[i++] = sorted[left++];
    await delay(buffer, setarr);
  }

  //If there are elements in the right sub array then add it to the result
  while (right < rightLimit) {
    await delay(buffer, setarr);
    await delaySet(i, i + 1, setidxI);
    if (allowedVolume) {
      beepA(1);
    }
    buffer[i++] = sorted[right++];
    await delay(buffer, setarr);
  }
};

import React from "react";
// For smoother visual
import { tween } from "tweening-js";
// Beep Sound
import Beep from "browser-beep";
import {
  Tsetidx,
  delaySet,
  swap,
  IExtendedBar,
  getX,
} from "../Views/sortingBoard";

export const partition = async (
  extendedBarArr: IExtendedBar[],
  left: number,
  right: number,
  setidxI: Tsetidx,
  setidxJ: Tsetidx
) => {
  // Pivot
  let x = extendedBarArr[right];
  let i = left - 1;

  const beepA = Beep({ frequency: 750 });
  const beepB = Beep({ frequency: 280 });

  let j = left;
  while (j <= right - 1) {
    if (extendedBarArr[j].value <= x.value) {
      i++;
      await delaySet(i, i + 1, setidxI);
      //beepA(1);
      await Promise.all([
        delaySet(getX(i), getX(j), extendedBarArr[i].refsetX.current),
        delaySet(getX(j), getX(i), extendedBarArr[j].refsetX.current),
      ]);
      swap(extendedBarArr, i, j);
    }
    j++;
    //beepB(1);
    await delaySet(j, j + 1, setidxJ);
  }
  await Promise.all([
    delaySet(getX(i + 1), getX(right), extendedBarArr[i + 1].refsetX.current),
    delaySet(getX(right), getX(i + 1), extendedBarArr[right].refsetX.current),
  ]);
  swap(extendedBarArr, i + 1, right);
  return i + 1;
};

export const quickSort = async (
  extendedBarArr: IExtendedBar[],
  left: number,
  right: number,
  setidxI: Tsetidx,
  setidxJ: Tsetidx
) => {
  if (left < right) {
    /* Partitioning index */
    const p = await partition(extendedBarArr, left, right, setidxI, setidxJ);
    quickSort(extendedBarArr, left, p - 1, setidxI, setidxJ);
    quickSort(extendedBarArr, p + 1, right, setidxI, setidxJ);
  }
};

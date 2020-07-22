import {
  Tsetidx,
  delaySet,
  delay,
  swap,
  getX,
  TsetX,
  IExtendedBar,
} from "../Views/sortingBoard";
import {
  useState,
  FC,
  SetStateAction,
  Dispatch,
  memo,
  MutableRefObject,
  useRef,
  useEffect,
} from "react";
import { KeyObject } from "crypto";

async function createGaps(a) {
  // if a is an array of 100, gaps would be [50, 25, 12, 6, 3, 1]
  var gaps = [];

  for (
    var i = 0, j = a.length, t;
    1 <= (t = Math.floor(j / Math.pow(2, i + 1)));
    i += 1
  ) {
    gaps[i] = t;

    if (t === 1) {
      break;
    }
  }

  if (gaps[i] !== 1) {
    gaps.push(1);
  }

  return gaps;
}

export const shellSort = async (
  a: number[],
  setidxI: Tsetidx,
  setidxJ: Tsetidx,
  setarr
) => {
  let gaps = await createGaps(a);
  let len = gaps.length;
  let temp;

  for (let i = 0, j = gaps.length, gap; i < j; i += 1) {
    gap = gaps[i];

    for (let x = gap, y = a.length; x < y; x += 1) {
      temp = a[x];

      // this performs insertion sort on subarrays
      for (var z = x; z >= gap && a[z - gap] > temp; z -= gap) {
        await delay(a, setarr);
        await delaySet(z, z - 1, setidxJ);
        a[z] = a[z - gap];
      }
      await delay(a, setarr);
      await delaySet(x, x + 1, setidxI);
      a[z] = temp;
    }
  }
};

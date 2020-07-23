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
  setidxJ: Tsetidx,
  allowedVolume: boolean
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
      console.log(allowedVolume);
      if (allowedVolume) {
        beepA(1);
      }
      await Promise.all([
        delaySet(getX(i), getX(j), extendedBarArr[i].refsetX.current),
        delaySet(getX(j), getX(i), extendedBarArr[j].refsetX.current),
      ]);
      swap(extendedBarArr, i, j);
    }
    j++;
    if (allowedVolume) {
      beepB(1);
    }
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
  setidxJ: Tsetidx,
  allowedVolume: boolean
) => {
  if (left < right) {
    /* Partitioning index */
    const p = await partition(
      extendedBarArr,
      left,
      right,
      setidxI,
      setidxJ,
      allowedVolume
    );
    quickSort(extendedBarArr, left, p - 1, setidxI, setidxJ, allowedVolume);
    quickSort(extendedBarArr, p + 1, right, setidxI, setidxJ, allowedVolume);
  }
};

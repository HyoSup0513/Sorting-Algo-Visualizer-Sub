import {
  Tsetidx,
  delaySet,
  swap,
  IExtendedBar,
  getX,
} from "../Views/sortingBoard";
import Beep from "browser-beep";

export const selectionSort = async (
  extendedBarArr: IExtendedBar[],
  setidxI: Tsetidx,
  setidxJ: Tsetidx,
  allowedVolume: boolean
) => {
  const beepA = Beep({ frequency: 70 });
  const beepB = Beep({ frequency: 250 });

  let i, j, min_idx;
  let n = 70;
  // One by one move boundary of unsorted subarray
  for (i = 0; i < n - 1; i++) {
    if (allowedVolume) {
      beepA(1);
    }
    // Find the minimum element in unsorted array
    min_idx = i;
    for (j = i + 1; j < n; j++) {
      if (allowedVolume) {
        beepB(1);
      }
      if (extendedBarArr[j].value < extendedBarArr[min_idx].value) {
        min_idx = j;
        await delaySet(j, min_idx, setidxJ);
      }
      await delaySet(j, j + 1, setidxJ);
    }

    // Swap the found minimum element with the first element
    await Promise.all([
      delaySet(getX(min_idx), getX(i), extendedBarArr[min_idx].refsetX.current),
      delaySet(getX(i), getX(min_idx), extendedBarArr[i].refsetX.current),
    ]);
    swap(extendedBarArr, min_idx, i);
    await delaySet(i, i + 1, setidxI);
  }
};

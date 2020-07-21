import {
  Tsetidx,
  delaySet,
  swap,
  IExtendedBar,
  getX,
} from "../Views/sortingBoard";
// Beep Sound
import Beep from "browser-beep";

export const insertionSort = async (
  extendedBarArr: IExtendedBar[],
  setidxI: Tsetidx,
  setidxJ: Tsetidx
) => {
  const beepA = Beep({ frequency: 750 });
  const beepB = Beep({ frequency: 280 });

  let i = 1;
  let j = 1;
  while (i < extendedBarArr.length) {
    await delaySet(j, i, setidxJ);
    j = i;
    while (j > 0 && extendedBarArr[j - 1].value > extendedBarArr[j].value) {
      //beepA(1);
      await Promise.all([
        delaySet(getX(j), getX(j - 1), extendedBarArr[j].refsetX.current),
        delaySet(getX(j - 1), getX(j), extendedBarArr[j - 1].refsetX.current),
      ]);
      swap(extendedBarArr, j, j - 1);

      await delaySet(j, j - 1, setidxJ);
      j = j - 1;
    }
    //beepB(1);
    await delaySet(i, i + 1, setidxI);
    i = i + 1;
  }
};

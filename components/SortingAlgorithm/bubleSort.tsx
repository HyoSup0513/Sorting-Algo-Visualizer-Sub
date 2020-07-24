import {
  Tsetidx,
  delaySet,
  swap,
  IExtendedBar,
  getX,
} from "../Views/sortingBoard";
// Beep Sound
import Beep from "browser-beep";

export const bubleSort = async (
  extendedBarArr: IExtendedBar[],
  setidxI: Tsetidx,
  setidxJ: Tsetidx,
  allowedVolume: boolean
) => {
  const beepA = Beep({ frequency: 600 });
  const beepB = Beep({ frequency: 250 });

  let len = extendedBarArr.length - 1;

  for (let i = 0; i < len; i++) {
    if (allowedVolume) {
      beepA(1);
    }

    for (let j = 0; j < len; j++) {
      if (extendedBarArr[j].value > extendedBarArr[j + 1].value) {
        if (allowedVolume) {
          beepB(1);
        }
        await Promise.all([
          delaySet(getX(j), getX(j + 1), extendedBarArr[j].refsetX.current),
          delaySet(getX(j + 1), getX(j), extendedBarArr[j + 1].refsetX.current),
        ]);
        swap(extendedBarArr, j, j + 1);

        await delaySet(j, j + 1, setidxJ);
      }
    }
    await delaySet(i, i + 1, setidxI);
  }
};

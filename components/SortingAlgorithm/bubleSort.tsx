import {
  Tsetidx,
  delaySet,
  swap,
  IExtendedBar,
  getX,
} from "../Views/sortingBoard";

export const bubleSort = async (
  extendedBarArr: IExtendedBar[],
  setidxI: Tsetidx,
  setidxJ: Tsetidx
) => {
  let len = extendedBarArr.length - 1;

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (extendedBarArr[j].value > extendedBarArr[j + 1].value) {
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

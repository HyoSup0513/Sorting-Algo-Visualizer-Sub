import { Tsetidx, delaySet, delay } from "../Views/sortingBoard";
import Beep from "browser-beep";

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
  setarr,
  allowedVolume: boolean
) => {
  const beepA = Beep({ frequency: 750 });
  const beepB = Beep({ frequency: 280 });
  const beepC = Beep({ frequency: 580 });

  let gaps = await createGaps(a);
  let temp;

  for (let i = 0, j = gaps.length, gap; i < j; i += 1) {
    await delaySet(i, i + 1, setidxJ);
    if (allowedVolume) {
      beepA(1);
    }
    gap = gaps[i];

    for (let x = gap, y = a.length; x < y; x += 1) {
      if (allowedVolume) {
        beepB(1);
      }
      await delaySet(x, x + 1, setidxI);
      temp = a[x];

      // this performs insertion sort on subarrays
      let z;
      for (z = x; z >= gap && a[z - gap] > temp; z -= gap) {
        if (allowedVolume) {
          beepC(1);
        }
        await delay(a, setarr);
        await delaySet(z, z - gap, setidxJ);
        a[z] = a[z - gap];
      }
      await delay(a, setarr);
      // await delaySet(x, x + 1, setidxI);
      a[z] = temp;
    }
  }
};

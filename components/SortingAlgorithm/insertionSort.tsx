import React from "react";
import { range, shuffle, uniqueId } from "lodash";
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
// For smoother visual
import { tween } from "tweening-js";
// Beep Sound
import Beep from "browser-beep";
// UI
import Button from "@material-ui/core/Button";
import {
  createStyles,
  makeStyles,
  Theme,
  jssPreset,
} from "@material-ui/core/styles";
import IconShuffle from "@material-ui/icons/Shuffle";
import IconSort from "@material-ui/icons/Sort";
import getColorMap from "colormap";
import { Slider } from "@material-ui/core";

const colorMapNameArr = [
  "jet",
  "hsv",
  "hot",
  "cool",
  "spring",
  "summer",
  "autumn",
  "winter",
  "bone",
  "copper",
  "greys",
  "yignbu",
  "greens",
  "yiorrd",
  "bluered",
  "rdbu",
  "picnic",
  "rainbow",
  "portland",
  "blackbody",
  "earth",
  "electric",
  "alpha",
  "viridis",
  "inferno",
  "magma",
  "plasma",
  "warm",
  "cool",
  "rainbow-soft",
  "bathymetry",
  "cdom",
  "chlorophyll",
  "density",
  "freesurface-blue",
  "freesurface-red",
  "oxygen",
  "par",
  "phase",
  "salinity",
  "temperature",
  "turbidity",
  "velocity-blue",
  "velocity-green",
  "cubehelix",
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    buttonSort: {
      color: "black",
      backgroundColor: "#90caf9",
      "&:hover": {
        backgroundColor: "rgb(100, 141, 174)",
      },
    },
  })
);

const SIZE = 40;
const DURATION = 100;
const BAR_WIDTH = 20;
const BAR_MARGIN = 2;
type Tsetidx = Dispatch<SetStateAction<number>>;
type Tsetany = Dispatch<SetStateAction<any>>;
type TsetX = Dispatch<SetStateAction<number>>;

const getArr = () => shuffle(range(1, SIZE + 1));
const getX = (idx: number) => idx * (BAR_MARGIN + BAR_WIDTH);
const initArr = range(1, SIZE + 1).map(() => 1);

interface IExtendedBar {
  value: number;
  refsetX: MutableRefObject<TsetX>;
}

const swap = (arr: IExtendedBar[], a: number, b: number) => {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
};

interface IPropsBar {
  value: number;
  idx: number;
  refsetX: MutableRefObject<TsetX>;
  colorArr: string[];
}

// Functional Component
const Bar: FC<IPropsBar> = (props) => {
  const { value, idx, refsetX, colorArr } = props;
  const [x, setX] = useState(getX(idx));
  const barstyle = {
    height: value * 10,
    transform: `translateX(${x}px)`,
    backgroundColor: colorArr[value - 1],
  };
  refsetX.current = setX;

  return (
    <>
      <div style={barstyle} className="bar" />
      <style jsx>
        {`
          .bar {
            position: absolute;
            width: 20px;
            background-color: black;
          }
        `}
      </style>
    </>
  );
};

const delaySet = (initValue: number, value: number, set: Tsetany) => {
  return tween(initValue, value, set, DURATION).promise();
};

const InsertionSort = async (
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

const partition = async (
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

const quickSort = async (
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

const delay = (
  arr: number[],
  setarr: (value: SetStateAction<number[]>) => void
) => {
  return new Promise((resolve) => {
    setarr([...arr]);
    setTimeout(resolve, 100);
  });
};

// Merge Sort
const mergeSort = async (
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

// Heap Sort
const heapSort = async (
  extendedBarArr: IExtendedBar[],
  n: number,
  setidxI: Tsetidx,
  setidxJ: Tsetidx
) => {
  // Build heap (rearrange array)
  for (let i = n / 2 - 1; i >= 0; i--) {
    await heapify(extendedBarArr, n, i, setidxI, setidxJ);

    await delaySet(i, i - 1, setidxJ);
  }

  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    await Promise.all([
      delaySet(getX(0), getX(i), extendedBarArr[0].refsetX.current),
      delaySet(getX(i), getX(0), extendedBarArr[i].refsetX.current),
    ]);
    swap(extendedBarArr, 0, i);

    await delaySet(0, i, setidxJ);

    // call max heapify on the reduced heap
    await heapify(extendedBarArr, i, 0, setidxI, setidxJ);
  }
};

const heapify = async (
  extendedBarArr: IExtendedBar[],
  n: number,
  i: number,
  setidxI: Tsetidx,
  setidxJ: Tsetidx
) => {
  let largest = i; // Initialize largest as root
  let l = 2 * i + 1; // left = 2*i + 1
  let r = 2 * i + 2; // right = 2*i + 2

  // If left child is larger than root
  if (l < n && extendedBarArr[l].value > extendedBarArr[largest].value) {
    largest = l;
  }

  // If right child is larger than largest so far
  if (r < n && extendedBarArr[r].value > extendedBarArr[largest].value) {
    largest = r;
  }

  // If largest is not root
  if (largest != i) {
    await Promise.all([
      delaySet(getX(i), getX(largest), extendedBarArr[i].refsetX.current),
      delaySet(getX(largest), getX(i), extendedBarArr[largest].refsetX.current),
    ]);
    swap(extendedBarArr, i, largest);

    await delaySet(i, largest, setidxI);

    // Recursively heapify the affected sub-tree
    await heapify(extendedBarArr, n, largest, setidxI, setidxJ);
  }
};

interface IpropsBoard {
  arr: number[];
  refExtendedBarArr: MutableRefObject<IExtendedBar[]>;
}

const isArrEqual = (oldProps: IpropsBoard, props: IpropsBoard) => {
  return oldProps.arr === props.arr;
};

let count = 0;
const Board: FC<IpropsBoard> = (props) => {
  const { arr, refExtendedBarArr } = props;
  const extendedBarArr = arr.map((value) => ({
    value,
    refsetX: useRef<TsetX>(null),
  }));

  useEffect(() => {
    refExtendedBarArr.current = extendedBarArr;
  }, [arr]);

  let colorMapIdx = 15;
  if (count === 0) {
    colorMapIdx = Math.floor(Math.random() * colorMapNameArr.length);
    count = 1;
  }
  const colormap = colorMapNameArr[colorMapIdx];

  const colorArr = getColorMap({
    colormap,
    nshades: arr.length,
    format: "hex",
    alpha: 1,
  });

  return (
    <div className="board">
      {extendedBarArr.map((item, i) => {
        return (
          <Bar
            key={`${uniqueId("set")}:${i}`}
            value={item.value}
            idx={i}
            refsetX={item.refsetX}
            colorArr={colorArr}
          />
        );
      })}

      <style jsx>
        {`
          .board {
            width: 100%;
            height: 600px;
            background-color: #333;
            color: white;
            transform: rotateX(180deg);
            padding: 0px 10px 0px 10px;
            box-sizing: border-box;
          }
        `}
      </style>
    </div>
  );
};

// Only render if isArrEqual returns false
const MemorizedBoard = memo(Board, isArrEqual);

export default () => {
  const [arr, setarr] = useState(getArr());
  const [idxI, setidxI] = useState(1);
  const [idxJ, setidxJ] = useState(1);
  const [isRunning, setisRunning] = useState(false);
  const [isRunningShu, setisRunningShu] = useState(false);
  const refExtendedBarArr = useRef<IExtendedBar[]>([]);
  // useEffect(() => setarr(getArr()), []);

  const handleShuffle = () => {
    setarr(shuffle(getArr()));
    setidxI(1);
    setidxJ(1);
    setisRunning(false);
    setisRunningShu(false);
  };

  const handleSortTypeA = async () => {
    setisRunning(true);
    setisRunningShu(true);
    await InsertionSort(refExtendedBarArr.current, setidxI, setidxJ);
    setisRunningShu(false);
  };

  const handleSortTypeB = async () => {
    setisRunning(true);
    setisRunningShu(true);
    await quickSort(refExtendedBarArr.current, 0, 39, setidxI, setidxJ);
    setisRunningShu(false);
  };

  const handleSortTypeC = async () => {
    setisRunning(true);
    setisRunningShu(true);
    const defaultArr = [...arr];
    setarr(await mergeSort(defaultArr, setarr, setidxI, setidxJ));
    setisRunningShu(false);

    // await mergeSort(refExtendedBarArr.current, setidxI, setidxJ);
  };

  const handleSortTypeD = async () => {
    setisRunning(true);
    setisRunningShu(true);

    await heapSort(refExtendedBarArr.current, SIZE, setidxI, setidxJ);
    setisRunningShu(false);
  };

  const classes = useStyles({});

  return (
    <div className="container">
      <Button
        variant="contained"
        color="default"
        disabled={isRunning}
        className={classes.buttonSort}
        onClick={handleSortTypeA}
        startIcon={<IconSort />}
      >
        Insertion Sort
      </Button>

      <Button
        variant="contained"
        color="default"
        disabled={isRunning}
        className={classes.buttonSort}
        onClick={handleSortTypeB}
        startIcon={<IconSort />}
      >
        Quick Sort
      </Button>

      <Button
        variant="contained"
        color="default"
        disabled={isRunning}
        className={classes.buttonSort}
        onClick={handleSortTypeC}
        startIcon={<IconSort />}
      >
        Merge Sort
      </Button>

      <Button
        variant="contained"
        color="default"
        disabled={isRunning}
        className={classes.buttonSort}
        onClick={handleSortTypeD}
        startIcon={<IconSort />}
      >
        Heap Sort
      </Button>

      <MemorizedBoard arr={arr} refExtendedBarArr={refExtendedBarArr} />

      <div className="indexBox">
        <div
          className="index i"
          style={{ transform: `translateX(${getX(idxI)}px)` }}
        >
          &nbsp; i
        </div>
        <div
          className="index j"
          style={{ transform: `translateX(${getX(idxJ)}px)` }}
        >
          &nbsp; j
        </div>
      </div>

      <div className="buttonBox">
        {
          <Button
            variant="contained"
            color="secondary"
            disabled={isRunningShu}
            className={classes.buttonSort}
            startIcon={<IconShuffle />}
            onClick={handleShuffle}
          >
            Suffle
          </Button>
        }
      </div>

      <style jsx>
        {`
          .container {
            padding: 32px;
          }
          .buttonBox {
            width: 100%;
            height: 60px;
            background-color: pink;
            text-align: right;
          }
          .button {
            font-size: 40px;
          }
          .h3 {
            font-size: 24px;
            font-family: "Roboto", "Helvetica", "Arial", sans-serif;
            margin: 0px;
            color: white;
            margin: 10px 0px;
          }
          .indexBox {
            color: white;
            padding: 0px 10px 0px 10px;
            box-sizing: border-box;
          }
          .index {
            position: absolute;
            width: 20px;
            background-color: yellow;
            color: white;
            opacity: 0.8;
          }
          .index.i {
            background-color: red;
          }
          .index.j {
            background-color: blue;
          }
          .running {
            font-size: 40px;
          }
        `}
      </style>
    </div>
  );
};

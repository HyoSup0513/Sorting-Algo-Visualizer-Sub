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
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import IconShuffle from "@material-ui/icons/Shuffle";
import IconSort from "@material-ui/icons/Sort";
import getColorMap from "colormap";
import { DURATION } from "./speedSwitch";
import SpeedSwitch from "./speedSwitch";
import { quickSort } from "../SortingAlgorithm/quickSort";
import { heapSort } from "../SortingAlgorithm/heapSort";
import { mergeSort } from "../SortingAlgorithm/mergeSort";
import { insertionSort } from "../SortingAlgorithm/insertionSort";
import { colorMapNameArr } from "./colorMapArr";
import { shellSort } from "../SortingAlgorithm/shellSort";
import { bubleSort } from "../SortingAlgorithm/bubleSort";
import { selectionSort } from "../SortingAlgorithm/selectionSort";
import VolSwitch from "./volumeSwitch";
import { allowedVolume } from "./volumeSwitch";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";

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

let volume;
export let SIZE = 70;
const BAR_WIDTH = 20;
const BAR_MARGIN = 2;
export type Tsetidx = Dispatch<SetStateAction<number>>;
export type Tsetany = Dispatch<SetStateAction<any>>;
export type TsetX = Dispatch<SetStateAction<number>>;

export const getArr = () => shuffle(range(1, SIZE + 1));
export const getX = (idx: number) => idx * (BAR_MARGIN + BAR_WIDTH);
// const initArr = range(1, SIZE + 1).map(() => 1);

export interface IExtendedBar {
  value: number;
  refsetX: MutableRefObject<TsetX>;
}

export const swap = (arr: IExtendedBar[], a: number, b: number) => {
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

// Functional Bar Component
const Bar: FC<IPropsBar> = (props) => {
  const { value, idx, refsetX, colorArr } = props;
  const [x, setX] = useState(getX(idx));
  const barstyle = {
    height: value * 8,
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

// Function for delay
export const delaySet = (initValue: number, value: number, set: Tsetany) => {
  return tween(initValue, value, set, DURATION).promise();
};

export const delay = (
  arr: number[],
  setarr: (value: SetStateAction<number[]>) => void
) => {
  return new Promise((resolve) => {
    setarr([...arr]);
    setTimeout(resolve, DURATION);
  });
};

export interface IpropsBoard {
  arr: number[];
  refExtendedBarArr: MutableRefObject<IExtendedBar[]>;
}

const isArrEqual = (oldProps: IpropsBoard, props: IpropsBoard) => {
  return oldProps.arr === props.arr;
};

// Functional Board Component
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

  // Handle Shuffle Button
  const handleShuffle = () => {
    setarr(shuffle(getArr()));
    setidxI(1);
    setidxJ(1);
    setisRunning(false);
    setisRunningShu(false);
  };

  // Handle insertionSort Button
  const handleSortTypeA = async () => {
    setisRunning(true);
    setisRunningShu(true);
    volume = allowedVolume;
    await insertionSort(refExtendedBarArr.current, setidxI, setidxJ, volume);
    setisRunningShu(false);
  };

  // Handle quickSort Button
  const handleSortTypeB = async () => {
    setisRunning(true);
    setisRunningShu(true);
    volume = allowedVolume;
    await quickSort(
      refExtendedBarArr.current,
      0,
      SIZE - 1,
      setidxI,
      setidxJ,
      volume
    );
    setisRunningShu(false);
  };

  // Handle mergeSort Button
  const handleSortTypeC = async () => {
    setisRunning(true);
    setisRunningShu(true);
    volume = allowedVolume;
    const defaultArr = [...arr];
    setarr(await mergeSort(defaultArr, setarr, setidxI, setidxJ, volume));
    setisRunningShu(false);
  };

  // Handle heapSort Button
  const handleSortTypeD = async () => {
    setisRunning(true);
    setisRunningShu(true);
    volume = allowedVolume;
    await heapSort(refExtendedBarArr.current, SIZE, setidxI, setidxJ, volume);
    setisRunningShu(false);
  };

  // Handle shellSort Button
  const handleSortTypeE = async () => {
    setisRunning(true);
    setisRunningShu(true);
    volume = allowedVolume;
    const defaultArr = [...arr];
    await shellSort(defaultArr, setidxI, setidxJ, setarr, volume);
    setarr(defaultArr);

    setisRunningShu(false);
  };

  // Handle bubleSort Button
  const handleSortTypeF = async () => {
    setisRunning(true);
    setisRunningShu(true);
    volume = allowedVolume;
    await bubleSort(refExtendedBarArr.current, setidxI, setidxJ, volume);
    setisRunningShu(false);
  };

  // Handle selectionSort Button
  const handleSortTypeG = async () => {
    setisRunning(true);
    setisRunningShu(true);
    volume = allowedVolume;
    await selectionSort(refExtendedBarArr.current, setidxI, setidxJ, volume);
    setisRunningShu(false);
  };

  const classes = useStyles({});

  return (
    <div className="container">
      <SpeedSwitch />

      <VolSwitch />
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
      <Button
        variant="contained"
        color="default"
        disabled={isRunning}
        className={classes.buttonSort}
        onClick={handleSortTypeE}
        startIcon={<IconSort />}
      >
        Shell Sort
      </Button>

      <Button
        variant="contained"
        color="default"
        disabled={isRunning}
        className={classes.buttonSort}
        onClick={handleSortTypeF}
        startIcon={<IconSort />}
      >
        Bubble Sort
      </Button>

      <Button
        variant="contained"
        color="default"
        disabled={isRunning}
        className={classes.buttonSort}
        onClick={handleSortTypeG}
        startIcon={<IconSort />}
      >
        Selection Sort
      </Button>

      {<MemorizedBoard arr={arr} refExtendedBarArr={refExtendedBarArr} />}

      <div className="indexBox">
        <div
          className="index i"
          style={{ transform: `translateX(${getX(idxI)}px)` }}
        >
          <AudiotrackIcon />
          {/* &nbsp; i */}
        </div>
        <div
          className="index j"
          style={{ transform: `translateX(${getX(idxJ)}px)` }}
        >
          <AudiotrackIcon />
        </div>
      </div>
      <div className="buttonBox">
        {
          <Button
            variant="contained"
            color="inherit"
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
            background-color: rgba(255, 0, 0, 0.6);
            border-radius: 25px;
          }
          .index.j {
            background-color: rgb(100, 149, 237);
            border-radius: 25px;
          }
          .running {
            font-size: 40px;
          }
        `}
      </style>
    </div>
  );
};

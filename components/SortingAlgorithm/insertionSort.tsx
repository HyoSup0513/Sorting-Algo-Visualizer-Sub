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
import Beep from "browser-beep";

const SIZE = 20;
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
}

// Functional Component
const Bar: FC<IPropsBar> = (props) => {
  const { value, idx, refsetX } = props;
  const [x, setX] = useState(getX(idx));
  const barstyle = {
    height: value * 15,
    transform: `translateX(${x}px)`,
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

const sort = async (
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
      beepA(1);
      await Promise.all([
        delaySet(getX(j), getX(j - 1), extendedBarArr[j].refsetX.current),
        delaySet(getX(j - 1), getX(j), extendedBarArr[j - 1].refsetX.current),
      ]);
      swap(extendedBarArr, j, j - 1);

      await delaySet(j, j - 1, setidxJ);
      j = j - 1;
    }
    beepB(1);
    await delaySet(i, i + 1, setidxI);
    i = i + 1;
  }
};

interface IpropsBoard {
  arr: number[];
  refExtendedBarArr: MutableRefObject<IExtendedBar[]>;
}

const isArrEqual = (oldProps: IpropsBoard, props: IpropsBoard) => {
  return oldProps.arr === props.arr;
};

const Board: FC<IpropsBoard> = (props) => {
  const { arr, refExtendedBarArr } = props;
  const extendedBarArr = arr.map((value) => ({
    value,
    refsetX: useRef<TsetX>(null),
  }));

  useEffect(() => {
    refExtendedBarArr.current = extendedBarArr;
  }, [arr]);

  return (
    <div className="board">
      {extendedBarArr.map((item, i) => {
        return (
          <Bar
            key={`${uniqueId("set")}:${i}`}
            value={item.value}
            idx={i}
            refsetX={item.refsetX}
          />
        );
      })}

      <style jsx>
        {`
          .board {
            width: 100%;
            height: 200px;
            background-color: gray;
            color: pink;
            transform: rotateX(180deg);
          }
        `}
      </style>
    </div>
  );
};

// Only render if isArrEqual returns false
const MemorizedBoard = memo(Board, isArrEqual);

export default () => {
  const [arr, setarr] = useState(initArr);
  const [idxI, setidxI] = useState(1);
  const [idxJ, setidxJ] = useState(1);
  const [isRunning, setisRunning] = useState(false);
  const refExtendedBarArr = useRef<IExtendedBar[]>([]);
  useEffect(() => setarr(getArr()), []);

  const handleShuffle = () => {
    setarr(shuffle(getArr()));
    setidxI(1);
    setidxJ(1);
  };

  const handleSort = async () => {
    setisRunning(true);
    await sort(refExtendedBarArr.current, setidxI, setidxJ);
    setisRunning(false);
  };

  return (
    <div>
      <MemorizedBoard arr={arr} refExtendedBarArr={refExtendedBarArr} />

      <div
        className="index i"
        style={{ transform: `translateX(${getX(idxI)}px)` }}
      >
        i
      </div>
      <div
        className="index j"
        style={{ transform: `translateX(${getX(idxJ)}px)` }}
      >
        j
      </div>

      <div className="buttonBox">
        {!isRunning && <button onClick={handleShuffle}>Suffle</button>}
        {!isRunning && <button onClick={handleSort}>Sort</button>}
        {isRunning && <div className="running">Running...</div>}
      </div>

      <style jsx>
        {`
          .buttonBox {
            width: 100%;
            height: 60px;
            background-color: pink;
            text-align: right;
          }
          .button {
            font-size: 40px;
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

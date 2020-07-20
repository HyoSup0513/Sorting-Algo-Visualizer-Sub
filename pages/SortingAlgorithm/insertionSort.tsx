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
import Title from "../../components/Head/Title";
import NavBar from "../../components/NavBar/NavBar";

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

  const colorMapIdx = Math.floor(Math.random() * colorMapNameArr.length);
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

  const classes = useStyles({});

  return (
    <div>
      <div className="container">
        {!isRunning && <Button onClick={handleSort}>Insertion Sort</Button>}
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
          {!isRunning && (
            <Button
              variant="contained"
              color="primary"
              disabled={isRunning}
              className={classes.buttonSort}
              startIcon={<IconShuffle />}
              onClick={handleShuffle}
            >
              Suffle
            </Button>
          )}
          <Button>adsfs</Button>
          {!isRunning && (
            <Button
              variant="contained"
              color="primary"
              disabled={isRunning}
              className={classes.buttonSort}
              startIcon={<IconSort />}
              onClick={handleSort}
            >
              Sort
            </Button>
          )}
          {isRunning && <div className="running"></div>}
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
    </div>
  );
};

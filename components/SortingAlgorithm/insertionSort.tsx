import { range, shuffle } from "lodash";
import { useState } from "react";

const SIZE = 20;
const getArr = () => range(1, SIZE + 1);

const swap = (arr, a, b) => {
  const tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
};

const sort = (arr: number[]) => {
  let i = 1;
  while (i < arr.length) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      swap(arr, j, j - 1);
      j = j - 1;
    }
    i = i + 1;
  }
};

export default () => {
  const [arr, setarr] = useState(getArr());

  const handleShuffle = () => {
    setarr(shuffle(getArr()));
  };

  const handleSort = () => {
    const sortedArr = [...arr];
    sort(sortedArr);

    setarr(sortedArr);
  };

  return (
    <div>
      <div className="board">
        {arr.map((value, i) => {
          const barstyle = {
            height: value * 15,
            transform: `translateX( ${i * 21}px)`,
          };
          return <div style={barstyle} className="bar" />;
        })}
      </div>
      <div className="buttonBox">
        <button onClick={handleShuffle}>Suffle</button>
        <button onClick={handleSort}>Sort</button>
      </div>

      <style jsx>
        {`
          .board {
            width: 100%;
            height: 200px;
            background-color: gray;
            color: pink;
            font-size: 40px;
            transform: rotateX(180deg);
          }
          .bar {
            position: absolute;
            width: 20px;
            background-color: black;
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
        `}
      </style>
    </div>
  );
};

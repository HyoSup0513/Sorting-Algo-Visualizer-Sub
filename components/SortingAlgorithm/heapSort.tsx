import {
  Tsetidx,
  delaySet,
  swap,
  IExtendedBar,
  getX,
} from "../Views/sortingBoard";

// Heap Sort
export const heapSort = async (
  extendedBarArr: IExtendedBar[],
  n: number,
  setidxI: Tsetidx,
  setidxJ: Tsetidx
) => {
  // Build heap (rearrange array)
  for (let i = n / 2 - 1; i >= 0; i--) {
    await delaySet(i, i - 1, setidxI);
    await heapify(extendedBarArr, n, i, setidxI, setidxI);
  }

  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    await delaySet(i, i - 1, setidxI);
    // Move current root to end
    await Promise.all([
      delaySet(getX(0), getX(i), extendedBarArr[0].refsetX.current),
      delaySet(getX(i), getX(0), extendedBarArr[i].refsetX.current),
    ]);
    swap(extendedBarArr, 0, i);

    // call max heapify on the reduced heap
    await heapify(extendedBarArr, i, 0, setidxI, setidxJ);
  }
};

export const heapify = async (
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
    delaySet(i, largest, setidxJ);
  }
  // If right child is larger than largest so far
  if (r < n && extendedBarArr[r].value > extendedBarArr[largest].value) {
    largest = r;
    delaySet(i, largest, setidxJ);
  }

  // If largest is not root
  if (largest != i) {
    await Promise.all([
      delaySet(getX(i), getX(largest), extendedBarArr[i].refsetX.current),
      delaySet(getX(largest), getX(i), extendedBarArr[largest].refsetX.current),
    ]);
    swap(extendedBarArr, i, largest);

    // Recursively heapify the affected sub-tree
    await heapify(extendedBarArr, n, largest, setidxI, setidxJ);
  }
};

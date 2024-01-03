import {
  solveReal1,
  solveReal2,
  solveTest1,
  solveTest2,
} from "../read_write/read";

export const solve1 = (input: string) => {
  const lines = getLines(input);

  return lines.reduce((extrapolatedValsSum, valueEvolution) => {
    let values = [...valueEvolution];
    let lastElems: number[] = [values.at(-1)!];
    while (!values.every((el) => el === 0)) {
      values = values
        .map((el, idx) =>
          idx === values.length - 1 ? el : values[idx + 1] - el
        )
        .slice(0, -1);
      lastElems = [values.at(-1)!, ...lastElems];
    }

    return extrapolatedValsSum + lastElems.reduce((sum, el) => sum + el, 0);
  }, 0);
};

export const solve2 = (input: string) => {
  const lines = getLines(input);

  return lines.reduce((extrapolatedValsSum, valueEvolution) => {
    let values = [...valueEvolution];
    let firstElems: number[] = [values.at(0)!];
    while (!values.every((el) => el === 0)) {
      values = values
        .map((el, idx) =>
          idx === values.length - 1 ? el : values[idx + 1] - el
        )
        .slice(0, -1);
      firstElems = [values.at(0)!, ...firstElems];
    }
    let lastVal = 0;
    const extrpVals = firstElems
      .map((_, idx) => {
        const newVal = firstElems.at(idx + 1)! - lastVal;
        lastVal = newVal;
        return newVal;
      })
      .slice(0, -1);
    return extrapolatedValsSum + extrpVals.at(-1)!;
  }, 0);
};

function getLines(input: string): number[][] {
  return input
    .split("\r\n")
    .map((list) => list.split(" ").map((num) => parseInt(num)));
}

export const expectedResultPart1 = 1993300041;
export const expectedResultPart2 = 1038;

// Part one - Test input 114
// Part one - Real input 1993300041
// Part two - Test input 2
// Part two - Real input 1038
solveTest1(__dirname, solve1);
solveReal1(__dirname, solve1);
solveTest2(__dirname, solve2);
solveReal2(__dirname, solve2);

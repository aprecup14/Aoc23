import {
  solveReal1,
  solveReal2,
  solveTest1,
  solveTest2,
} from "../read_write/read";

export const solve1 = (input: string) => {
  const patterns = input
    .split("\r\n")
    .reduce<string[][]>(
      (p, row) =>
        row === "" ? [...p, []] : [...p.slice(0, -1), [...p.at(-1)!, row]],
      [[]]
    );

  return patterns.reduce((sumReflections, pattern) => {
    const horizontalReflection = findHorizontalReflection(pattern);
    const verticalReflection = findHorizontalReflection(transpose(pattern));
    return (
      sumReflections +
      toHorizontalVal(horizontalReflection) +
      toVerticalVal(verticalReflection)
    );
  }, 0);
};

export const solve2 = (input: string) => {
  const patterns = input
    .split("\r\n")
    .reduce<string[][]>(
      (p, row) =>
        row === "" ? [...p, []] : [...p.slice(0, -1), [...p.at(-1)!, row]],
      [[]]
    );

  return patterns.reduce((sumReflections, pattern) => {
    const verticalMirrorIdx = findHorizontalReflectionWithOneSmudgeIdx(
      transpose(pattern)
    );
    if (verticalMirrorIdx !== -1) {
      return sumReflections + toVerticalVal(verticalMirrorIdx);
    }
    const horizontalMirrorIdx =
      findHorizontalReflectionWithOneSmudgeIdx(pattern);

    return sumReflections + toHorizontalVal(horizontalMirrorIdx);
  }, 0);
};

function toHorizontalVal(val: number) {
  return val === -1 ? 0 : (val + 1) * 100;
}

function toVerticalVal(val: number) {
  return val === -1 ? 0 : val + 1;
}

function findHorizontalReflection(pattern: string[]) {
  for (let i = 0; i < pattern.length - 1; i++) {
    if (pattern[i] === pattern[i + 1] && isReflection(i, i + 1, pattern)) {
      return i;
    }
  }
  return -1;
}

function findHorizontalReflectionWithOneSmudgeIdx(pattern: string[]): number {
  for (let i = 0; i < pattern.length - 1; i++) {
    if (isReflectionWithOneOffError(i, i + 1, pattern, false)) {
      return i;
    }
  }
  return -1;
}

function isReflection(l: number, r: number, pattern: string[]) {
  if (l < 0 || r >= pattern.length) {
    return true;
  }
  if (pattern[l] !== pattern[r]) {
    return false;
  }
  return isReflection(l - 1, r + 1, pattern);
}

function isReflectionWithOneOffError(
  l: number,
  r: number,
  pattern: string[],
  hasOneDiffChar: boolean
) {
  if (l < 0 || r >= pattern.length) {
    return hasOneDiffChar;
  }
  if (pattern[l] === pattern[r]) {
    return isReflectionWithOneOffError(l - 1, r + 1, pattern, hasOneDiffChar);
  }
  if (hasOneDiffChar) {
    return false;
  }
  const charsOffBy = numCharsOffBy(pattern[l], pattern[r]);
  if (charsOffBy.length > 1) {
    return false;
  }
  return isReflectionWithOneOffError(l - 1, r + 1, pattern, true);
}

function numCharsOffBy(s1: string, s2: string) {
  return [...s1].reduce<number[]>(
    (diffIdxs, ch, idx) => (ch !== s2[idx] ? [...diffIdxs, idx] : diffIdxs),
    []
  );
}

function transpose(grid: string[]) {
  let transposedGrid: string[] = [];
  for (let i = 0; i < grid[0].length; i++) {
    let transposed = "";
    for (let j = 0; j < grid.length; j++) {
      transposed += grid[j][i];
    }
    transposedGrid.push(transposed);
  }
  return transposedGrid;
}

export const expectedResultPart1 = 27202;
export const expectedResultPart2 = 41566;

solveTest1(__dirname, solve1);
solveReal1(__dirname, solve1);
solveTest2(__dirname, solve2);
solveReal2(__dirname, solve2);

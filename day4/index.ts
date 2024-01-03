import {
  solveReal1,
  solveReal2,
  solveTest1,
  solveTest2,
} from "../read_write/read";

export const solve1 = (input: string) => {
  const lines = input.split("\n");
  return lines.reduce((sum, line) => {
    const [winningNums, ownedNums] = getNums(line);
    const occurences = getWinningNumsCount(winningNums, ownedNums);
    if (occurences === 0) {
      return sum;
    }

    return sum + 2 ** (occurences - 1);
  }, 0);
};

export const solve2 = (input: string) => {
  const lines = input.split("\n");
  const scratchcardsOwned = Array.from({ length: lines.length }, () => 1);
  const cardsProducedByCard = lines.map((l) => {
    const [winningNums, ownedNums] = getNums(l);
    return getWinningNumsCount(winningNums, ownedNums);
  });

  cardsProducedByCard.forEach((val, idx) => {
    for (
      let i = idx + 1;
      i < idx + 1 + val && i < scratchcardsOwned.length;
      i++
    ) {
      scratchcardsOwned[i] = scratchcardsOwned[i] + scratchcardsOwned[idx];
    }
  });

  return scratchcardsOwned.reduce((sum, curr) => sum + curr, 0);
};

export const expectedResultPart1 = 18653;
export const expectedResultPart2 = 5921508;

solveTest1(__dirname, solve1); // Part one - Test input 13
solveReal1(__dirname, solve1); // Part one - Real input 18653
solveTest2(__dirname, solve2); // Part two - Test input 30
solveReal2(__dirname, solve2); // Part two - Real input 5921508

function getNums(line: string) {
  const [_, nums] = line.split(":");
  const [winningString, ownedString] = nums.trim().split("|");
  return [
    winningString
      .trim()
      .split(" ")
      .filter((v) => v.trim().length > 0)
      .map((v) => parseInt(v)),
    ownedString
      .trim()
      .split(" ")
      .filter((v) => v.trim().length > 0)
      .map((v) => parseInt(v)),
  ];
}

function getWinningNumsCount(winningNums: number[], ownedNums: number[]) {
  const winningNumsSet = new Set(winningNums);
  return ownedNums.reduce(
    (occ, num) => (winningNumsSet.has(num) ? 1 + occ : occ),
    0
  );
}

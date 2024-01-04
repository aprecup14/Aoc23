import {
  solveReal1,
  solveReal2,
  solveTest1,
  solveTest2,
} from "../read_write/read";

export const solve1 = (input: string) => {
  const grid = input.split("\r\n").map((line) => [...line]);
  const emptyRowsIdx = getEmptyRows(grid);
  const emptyColsIdx = getEmptyCols(grid);
  const galaxiesPositions = getGalaxies(grid);

  return galaxiesPositions.reduce<number>((sum, currPos, idx) => {
    return (
      sum +
      galaxiesPositions.slice(idx + 1).reduce<number>((s, point, gidx) => {
        const d =
          Math.abs(
            withExpandedInConsideration(point.x, emptyRowsIdx) -
              withExpandedInConsideration(currPos.x, emptyRowsIdx)
          ) +
          Math.abs(
            withExpandedInConsideration(point.y, emptyColsIdx) -
              withExpandedInConsideration(currPos.y, emptyColsIdx)
          );
        return s + d;
      }, 0)
    );
  }, 0);
};

export const solve2 = (input: string) => {
  const grid = input.split("\r\n").map((line) => [...line]);
  const emptyRowsIdx = getEmptyRows(grid);
  const emptyColsIdx = getEmptyCols(grid);
  const galaxiesPositions = getGalaxies(grid);
  const expansionTimes = 1_000_000 - 1;
  return galaxiesPositions.reduce<number>((sum, currPos, idx) => {
    return (
      sum +
      galaxiesPositions.slice(idx + 1).reduce<number>((s, point, gidx) => {
        const d =
          Math.abs(
            withExpandedInConsideration(point.x, emptyRowsIdx, expansionTimes) -
              withExpandedInConsideration(
                currPos.x,
                emptyRowsIdx,
                expansionTimes
              )
          ) +
          Math.abs(
            withExpandedInConsideration(point.y, emptyColsIdx, expansionTimes) -
              withExpandedInConsideration(
                currPos.y,
                emptyColsIdx,
                expansionTimes
              )
          );

        return s + d;
      }, 0)
    );
  }, 0);
};

function withExpandedInConsideration(
  val: number,
  expansionIdx: number[],
  replaceWith: number = 1
) {
  return val + expansionIdx.filter((v) => v < val).length * replaceWith;
}

export const expectedResultPart1 = 9177603;
export const expectedResultPart2 = 632003913611;

solveTest1(__dirname, solve1);
solveReal1(__dirname, solve1);
solveTest2(__dirname, solve2);
solveReal2(__dirname, solve2);

function getEmptyRows(grid: string[][]) {
  return grid
    .map((line, idx) => (line.every((cell) => cell === ".") ? idx : -1))
    .filter((idx) => idx !== -1);
}

function getEmptyCols(grid: string[][]) {
  let emptyColsIdx: number[] = [];
  for (let i = 0; i < grid[0].length; i++) {
    let isEmptyCol = true;
    for (let j = 0; j < grid.length; j++) {
      if (grid[j][i] === "#") {
        isEmptyCol = false;
      }
    }
    if (isEmptyCol) {
      emptyColsIdx.push(i);
    }
  }
  return emptyColsIdx;
}

function getGalaxies(grid: string[][]): { x: number; y: number }[] {
  return grid.reduce<{ x: number; y: number }[]>((galaxies, row, rIdx) => {
    return [
      ...galaxies,
      ...row.reduce<{ x: number; y: number }[]>((rowGalaxies, cell, cIdx) => {
        if (cell !== "#") {
          return rowGalaxies;
        }
        return [...rowGalaxies, { x: rIdx, y: cIdx }];
      }, []),
    ];
  }, []);
}

// function expandGrid(grid: string[][]){
//   const emptyRowsIdx = getEmptyRows(grid);
//   const emptyColsIdx = getEmptyCols(grid);

//   const withExpandedRows = grid.flatMap((row, rIdx) =>
//     emptyRowsIdx.some((i) => i === rIdx) ? [row, row] : [row]
//   );
//   const withExpandedCols = withExpandedRows.map((row) =>
//     row.flatMap((cell, cIdx) =>
//       emptyColsIdx.some((i) => i === cIdx) ? [".", "."] : [cell]
//     )
//   );

//   return withExpandedCols;
// }

// function bfs2d(grid: string[][], startPosition: { x: number; y: number }) {
//   let distancesGrid: number[][] = grid.map((row, rIdx) =>
//     row.map((_, tIdx) =>
//       rIdx === startPosition.x && tIdx === startPosition.y ? 0 : -1
//     )
//   );
//   let toVisitQueue = [startPosition];
//   while (toVisitQueue.length > 0) {
//     const currentPosition = toVisitQueue.shift();
//     if (!currentPosition) {
//       throw "Queue should not be empty.";
//     }

//     const neighbours = getNeighbours(
//       currentPosition.x,
//       currentPosition.y,
//       grid.length,
//       grid[currentPosition.x].length
//     ).filter(([x, y]) => isUnvisited({ x, y }, distancesGrid));

//     const currentDistance = distancesGrid[currentPosition.x][currentPosition.y];
//     neighbours.forEach(([x, y]) => (distancesGrid[x][y] = currentDistance + 1));

//     toVisitQueue = [...toVisitQueue, ...neighbours.map(([x, y]) => ({ x, y }))];
//   }
//   return distancesGrid;
// }

// // For a position in the grid, get the neighbour tiles that are inside the grid and suitable for connection (eg. a "F" should only look for "S" and "E" neighbours).
// function getNeighbours(i: number, j: number, maxI: number, maxJ: number) {
//   const moves = [
//     [i - 1, j, "N"],
//     [i, j + 1, "E"],
//     [i + 1, j, "S"],
//     [i, j - 1, "W"],
//   ] as const;
//   return moves.filter(
//     ([ii, jj, _]) => ii >= 0 && ii < maxI && jj >= 0 && jj < maxJ
//   );
// }

// function isUnvisited(position: { x: number; y: number }, grid: number[][]) {
//   return grid[position.x][position.y] === -1;
// }

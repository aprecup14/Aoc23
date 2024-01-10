import { solveReal1, solveReal2, solveTest1, solveTest2 } from "../read_write/read";

const roundedRock = "O";
const cubeRock = "#";
const emptySpace = ".";

interface Position {
  x: number;
  y: number;
}

export const expectedResultPart1 = 103333;
export const expectedResultPart2 = 97241;

export const solve1 = (input: string) => {
  const grid = input.split("\r\n").map((line) => [...line]);

  const roundedRockPositions = grid.reduce<Position[]>((positions, line, x) => {
    return [
      ...positions,
      ...line.reduce<Position[]>(
        (pos, el, y) => (el === roundedRock ? [...pos, { x, y }] : pos),
        []
      ),
    ];
  }, []);

  const tiltedNorthGrid = roundedRockPositions.reduce<string[][]>(
    (toNorthGrid, position) => {
      const newPosition = slideNorth(position, toNorthGrid);
      return move(position, newPosition, grid);
    },
    grid
  );

  return tiltedNorthGrid.reduce((sum, row, rIdx) => {
    return (
      sum +
      row.reduce((s, el) => {
        return s + (el !== roundedRock ? 0 : tiltedNorthGrid.length - rIdx);
      }, 0)
    );
  }, 0);
};

export const solve2 = (input: string) => {
  const grid = input.split("\r\n").map((line) => [...line]);
  let i = 0;
  let gridd: string[][] = grid.map((row) => row.map((el) => el));
  let cache: string[][][] = [];

  const count = 1_000_000_000;
  let hasFoundRepetitionAt = -1;
  while (i < count && hasFoundRepetitionAt === -1) {
    gridd = moveEast(moveSouth(moveWest(moveNorth(gridd))));
    const sameIdx = isAlreadyInCache(cache, gridd);
    if (sameIdx !== -1) {
      hasFoundRepetitionAt = sameIdx;
    } else {
      cache.push(gridd.map((r) => r.map((el) => el)));
      i += 1;
    }
  }

  const relativePosition = (count - hasFoundRepetitionAt) % (i - hasFoundRepetitionAt)
  
  return cache
    .at(relativePosition + hasFoundRepetitionAt - 1)!
    .reduce((sum, row, rIdx) => {
      return (
        sum +
        row.reduce((s, el) => {
          return s + (el !== roundedRock ? 0 : gridd.length - rIdx);
        }, 0)
      );
    }, 0);
};

function isAlreadyInCache(cache: string[][][], grid: string[][]) {
  return cache.findIndex((gridd) =>
    gridd.every((row, rIdx) => row.every((el, cIdx) => el === grid[rIdx][cIdx]))
  );
}

function trace<T>(apa: T) {
  console.log(apa);
  return apa;
}

function moveNorth(grid: string[][]): string[][] {
  const roundedRockPositions = grid.reduce<Position[]>((positions, line, x) => {
    return [
      ...positions,
      ...line.reduce<Position[]>(
        (pos, el, y) => (el === roundedRock ? [...pos, { x, y }] : pos),
        []
      ),
    ];
  }, []);

  return roundedRockPositions.reduce<string[][]>((toNorthGrid, position) => {
    const newPosition = slideNorth(position, toNorthGrid);
    return move(position, newPosition, grid);
  }, grid);
}

function moveWest(grid: string[][]): string[][] {
  const roundedRockPositions = grid.reduce<Position[]>((positions, line, x) => {
    return [
      ...positions,
      ...line.reduce<Position[]>(
        (pos, el, y) => (el === roundedRock ? [...pos, { x, y }] : pos),
        []
      ),
    ];
  }, []);

  return roundedRockPositions.reduce<string[][]>((toWestGrid, position) => {
    const newPosition = slideWest(position, toWestGrid);
    return move(position, newPosition, grid);
  }, grid);
}

function moveSouth(grid: string[][]): string[][] {
  const roundedRockPositions = grid
    .reduce<Position[]>((positions, line, x) => {
      return [
        ...positions,
        ...line.reduce<Position[]>(
          (pos, el, y) => (el === roundedRock ? [...pos, { x, y }] : pos),
          []
        ),
      ];
    }, [])
    .sort((a, b) => b.x - a.x);

  return roundedRockPositions.reduce<string[][]>((toSouthGrid, position) => {
    const newPosition = slideSouth(position, toSouthGrid);
    return move(position, newPosition, grid);
  }, grid);
}

function moveEast(grid: string[][]): string[][] {
  const roundedRockPositions = grid
    .reduce<Position[]>((positions, line, x) => {
      return [
        ...positions,
        ...line.reduce<Position[]>(
          (pos, el, y) => (el === roundedRock ? [...pos, { x, y }] : pos),
          []
        ),
      ];
    }, [])
    .sort((a, b) => b.y - a.y);

  return roundedRockPositions.reduce<string[][]>((toEastGrid, position) => {
    const newPosition = slideEast(position, toEastGrid);
    return move(position, newPosition, grid);
  }, grid);
}

function slideNorth({ x, y }: Position, grid: string[][]): Position {
  if (x === 0) {
    return { x, y };
  }
  let northPos = x - 1;
  while (
    northPos >= 0 &&
    grid[northPos][y] !== roundedRock &&
    grid[northPos][y] !== cubeRock
  ) {
    northPos -= 1;
  }
  return { x: northPos + 1, y };
}

function slideSouth({ x, y }: Position, grid: string[][]): Position {
  if (x === grid.length - 1) {
    return { x, y };
  }
  let southPos = x + 1;
  while (
    southPos < grid.length &&
    grid[southPos][y] !== roundedRock &&
    grid[southPos][y] !== cubeRock
  ) {
    southPos += 1;
  }
  return { x: southPos - 1, y };
}

function slideWest({ x, y }: Position, grid: string[][]): Position {
  if (y === 0) {
    return { x, y };
  }
  let westPos = y - 1;
  while (
    westPos >= 0 &&
    grid[x][westPos] !== roundedRock &&
    grid[x][westPos] !== cubeRock
  ) {
    westPos -= 1;
  }
  return { x, y: westPos + 1 };
}

function slideEast({ x, y }: Position, grid: string[][]): Position {
  if (y === grid[x].length - 1) {
    return { x, y };
  }
  let eastPos = y + 1;
  while (
    eastPos < grid[x].length &&
    grid[x][eastPos] !== roundedRock &&
    grid[x][eastPos] !== cubeRock
  ) {
    eastPos += 1;
  }
  return { x, y: eastPos - 1 };
}

function move(from: Position, to: Position, grid: string[][]) {
  const el = grid[from.x][from.y];
  grid[from.x][from.y] = ".";
  grid[to.x][to.y] = el;
  return grid;
}

solveTest1(__dirname, solve1);
solveReal1(__dirname, solve1);
solveTest2(__dirname, solve2);
solveReal2(__dirname, solve2);


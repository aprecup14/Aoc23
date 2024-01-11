import {
  solveReal1,
  solveReal2,
  solveTest1,
  solveTest2,
} from "../read_write/read";

const emptySpace = ".";
const mirrorSlash = "/";
const mirrorBackslash = "\\";
const verticalSplitter = "|";
const horizontalSplitter = "-";

type Tile =
  | typeof emptySpace
  | typeof mirrorSlash
  | typeof mirrorBackslash
  | typeof verticalSplitter
  | typeof horizontalSplitter;
type Direction = "up" | "down" | "left" | "right";
interface Beam {
  x: number;
  y: number;
  direction: Direction;
}

function getNextPosition({ x, y, direction }: Beam) {
  switch (direction) {
    case "down":
      return { x: x + 1, y: y };
    case "up":
      return { x: x - 1, y: y };
    case "left":
      return { x, y: y - 1 };
    case "right":
      return { x, y: y + 1 };
  }
}

function isValidPosition(numRowsGrid: number, numColsGrid: number) {
  return function (x: number, y: number) {
    return x < numRowsGrid && x >= 0 && y < numColsGrid && y >= 0;
  };
}

export const solve1 = (input: string) => {
  const grid = input.split("\r\n").map((s) => [...s]) as Tile[][];
  return letThereBeLightFrom(grid, { x: 0, y: 0, direction: "right" });
};

export const solve2 = (input: string) => {
  const grid = input.split("\r\n").map((s) => [...s]) as Tile[][];
  const topTiles: Beam[] = grid[0].map((tile, tIdx) => ({
    x: 0,
    y: tIdx,
    direction: "down",
  }));
  const bottomTiles: Beam[] = grid[grid.length - 1].map((t, tIdx) => ({
    x: grid.length - 1,
    y: tIdx,
    direction: "up",
  }));
  const leftTiles: Beam[] = grid
    .flatMap((row, rIdx) =>
      row.map((tile, tIdx) =>
        tIdx === 0 ? { x: rIdx, y: 0, direction: "right" } : undefined
      )
    )
    .filter((el) => el !== undefined) as Beam[];
  const rightTiles: Beam[] = grid
    .flatMap((row, rIdx) =>
      row.map((tile, tIdx) =>
        tIdx === row.length - 1
          ? { x: rIdx, y: row.length - 1, direction: "left" }
          : undefined
      )
    )
    .filter((el) => el !== undefined) as Beam[];

  return Math.max(
    ...[...topTiles, ...bottomTiles, ...leftTiles, ...rightTiles].map((beam) =>
      letThereBeLightFrom(grid, beam)
    )
  );
};

function letThereBeLightFrom(grid: Tile[][], startBeam: Beam) {
  let beams: Beam[] = [
    { ...adjustStartPosition(startBeam), direction: startBeam.direction },
  ];
  let energizedGrid = grid.map((row) => row.map((_) => "."));
  let visitedWithDirections: Direction[][][] = grid.map((row) =>
    row.map((_) => [])
  );
  const isInGrid = isValidPosition(grid.length, grid[0].length);

  //   let it = 0;
  while (beams.length > 0) {
    // it += 1;
    beams = beams
      .flatMap((beam) => {
        if (isInGrid(beam.x, beam.y)) {
          visitedWithDirections[beam.x][beam.y].push(beam.direction);
          energizedGrid[beam.x][beam.y] = "#";
        }
        const nextPosition = getNextPosition(beam);
        if (!isInGrid(nextPosition.x, nextPosition.y)) {
          return undefined;
        }
        const nextTile = grid[nextPosition.x][nextPosition.y];
        if (nextTile === emptySpace) {
          if (
            visitedWithDirections[nextPosition.x][nextPosition.y].some(
              (d) => d === beam.direction
            )
          ) {
            return undefined;
          }

          return { ...nextPosition, direction: beam.direction };
        }
        if (nextTile === "/") {
          let nextDirection: Direction = "up";
          switch (beam.direction) {
            case "right":
              nextDirection = "up";
              break;
            case "left":
              nextDirection = "down";
              break;
            case "up":
              nextDirection = "right";
              break;
            case "down":
              nextDirection = "left";
              break;
          }
          if (
            visitedWithDirections[nextPosition.x][nextPosition.y].some(
              (d) => d === nextDirection
            )
          ) {
            return undefined;
          }
          return { ...nextPosition, direction: nextDirection };
        }
        if (nextTile === "\\") {
          let nextDirection: Direction = "down";
          switch (beam.direction) {
            case "right":
              nextDirection = "down";
              break;
            case "left":
              nextDirection = "up";
              break;
            case "up":
              nextDirection = "left";
              break;
            case "down":
              nextDirection = "right";
              break;
          }

          if (
            visitedWithDirections[nextPosition.x][nextPosition.y].some(
              (d) => d === nextDirection
            )
          ) {
            return undefined;
          }
          return { ...nextPosition, direction: nextDirection };
        }
        if (nextTile === "-") {
          if (energizedGrid[nextPosition.x][nextPosition.y] === "#") {
            return undefined;
          }
          if (beam.direction === "left" || beam.direction === "right") {
            return { ...nextPosition, direction: beam.direction };
          }
          return [
            { ...nextPosition, direction: "left" },
            { ...nextPosition, direction: "right" },
          ];
        }
        if (nextTile === "|") {
          if (energizedGrid[nextPosition.x][nextPosition.y] === "#") {
            return undefined;
          }
          if (beam.direction === "up" || beam.direction === "down") {
            return { ...nextPosition, direction: beam.direction };
          }
          return [
            { ...nextPosition, direction: "up" },
            { ...nextPosition, direction: "down" },
          ];
        }
      })
      .filter((beam) => beam !== undefined) as Beam[];
  }

  //   console.log(it);
  return energizedGrid.reduce((sum, row) => {
    return sum + row.reduce((s, el) => s + (el === "#" ? 1 : 0), 0);
  }, 0);
}

function adjustStartPosition({ x, y, direction }: Beam) {
  switch (direction) {
    case "right":
      return { x, y: y - 1 };
    case "left":
      return { x, y: y + 1 };
    case "up":
      return { x: x + 1, y };
    case "down":
      return { x: x - 1, y };
  }
}

export const expectedResultPart1 = 7939;
export const expectedResultPart2 = 8318;

solveTest1(__dirname, solve1);
solveReal1(__dirname, solve1);
solveTest2(__dirname, solve2);
solveReal2(__dirname, solve2);

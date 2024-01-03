import {
  solveReal1,
  solveReal2,
  solveTest1,
  solveTest2,
} from "../read_write/read";

type PipeTypes = "|" | "-" | "L" | "J" | "7" | "F";
const startingPosition = "S" as const;
type TileContent = PipeTypes | typeof startingPosition | ".";
type Direction = "N" | "E" | "S" | "W";

interface Pipe {
  symbol: PipeTypes;
  connects: [Direction, Direction];
}

// For a position in the grid, get the neighbour tiles that are inside the grid and suitable for connection (eg. a "F" should only look for "S" and "E" neighbours).
function getNeighbours(
  pipeOrStart: Exclude<TileContent, ".">,
  i: number,
  j: number,
  maxI: number,
  maxJ: number
) {
  const moves = [
    [i - 1, j, "N"],
    [i, j + 1, "E"],
    [i + 1, j, "S"],
    [i, j - 1, "W"],
  ] as const;
  return moves
    .filter(([, , position]) => isValidPosition(position, pipeOrStart))
    .filter(([ii, jj, _]) => ii >= 0 && ii < maxI && jj >= 0 && jj < maxJ);

  function isValidPosition(
    position: Direction,
    tileSymbol: Exclude<TileContent, ".">
  ) {
    if (tileSymbol === "S") {
      return true;
    }

    return PipeSymbolToPipeMap.get(tileSymbol)?.connects.some(
      (pos) => pos === position
    );
  }
}

function getOpposite(position: Direction): Direction {
  switch (position) {
    case "S":
      return "N";
    case "N":
      return "S";
    case "E":
      return "W";
    case "W":
      return "E";
  }
}

const NSPipe: Pipe = {
  symbol: "|",
  connects: ["N", "S"],
};

const WEPipe: Pipe = {
  symbol: "-",
  connects: ["W", "E"],
};
const NEPipe: Pipe = {
  symbol: "L",
  connects: ["N", "E"],
};

const NWPipe: Pipe = {
  symbol: "J",
  connects: ["N", "W"],
};

const SWPipe: Pipe = {
  symbol: "7",
  connects: ["S", "W"],
};

const SEPipe: Pipe = {
  symbol: "F",
  connects: ["S", "E"],
};

const PipeSymbolToPipeMap: Map<PipeTypes, Pipe> = new Map([
  ["|", NSPipe],
  ["-", WEPipe],
  ["L", NEPipe],
  ["J", NWPipe],
  ["7", SWPipe],
  ["F", SEPipe],
]);

export function solve1(input: string) {
  const [grid, startPosition] = parseInput(input);
  let distancesGrid: number[][] = grid.map((row, rIdx) =>
    row.map((_, tIdx) =>
      rIdx === startPosition.x && tIdx === startPosition.y ? 0 : -1
    )
  );
  let toVisitQueue = [startPosition];
  let maxDistance = -1;
  while (toVisitQueue.length > 0) {
    const currentPosition = toVisitQueue.shift();
    if (!currentPosition) {
      throw "Queue should not be empty.";
    }

    const currentSymbol = grid[currentPosition.x][currentPosition.y];
    if (currentSymbol === ".") {
      throw "Should not visit dots.";
    }

    const connectedPipes = getConnectedPipes(
      grid,
      getNeighbours(
        currentSymbol,
        currentPosition.x,
        currentPosition.y,
        grid.length,
        grid[currentPosition.x].length
      ),
      distancesGrid
    );

    const currentDistance = distancesGrid[currentPosition.x][currentPosition.y];
    connectedPipes.forEach(
      ({ x, y }) => (distancesGrid[x][y] = currentDistance + 1)
    );
    if (currentDistance > maxDistance) {
      maxDistance = currentDistance;
    }

    toVisitQueue = [...toVisitQueue, ...connectedPipes];
  }

  return maxDistance;
}

// Other solution idea: https://www.reddit.com/r/adventofcode/comments/18evyu9/comment/kcqmhwk/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
// If we consider the closed loop as an integral polygon then Pick's theorem relates the area of the closed loop (which can be calculated using the shoelace formula), the number of integer points on the boundary of the closed loop (which is just the length of the close loop), and the number of integer points in the interior of the loop (which is the answer).
// Implemented: Count the number of vertical pipes for each line to decide whether the tile is inside or outside of the loop.
export function solve2(input: string) {
  const [grid, startPosition] = parseInput(input);
  let distancesGrid: number[][] = grid.map((row, rIdx) =>
    row.map((_, tIdx) =>
      rIdx === startPosition.x && tIdx === startPosition.y ? 0 : -1
    )
  );
  let toVisitQueue = [startPosition];

  while (toVisitQueue.length > 0) {
    const currentPosition = toVisitQueue.shift();
    if (!currentPosition) {
      throw "Queue should not be empty.";
    }

    const currentSymbol = grid[currentPosition.x][currentPosition.y];
    if (currentSymbol === ".") {
      throw "Should not visit dots.";
    }

    const connectedPipes = getConnectedPipes(
      grid,
      getNeighbours(
        currentSymbol,
        currentPosition.x,
        currentPosition.y,
        grid.length,
        grid[currentPosition.x].length
      ),
      distancesGrid
    );

    const currentDistance = distancesGrid[currentPosition.x][currentPosition.y];
    connectedPipes.forEach(
      ({ x, y }) => (distancesGrid[x][y] = currentDistance + 1)
    );

    toVisitQueue = [...toVisitQueue, ...connectedPipes];
  }

  const gridWithPipe: TileContent[][] = distancesGrid.map(
    (row, rIdx) => row.map((tile, tIdx) => (tile >= 0 ? grid[rIdx][tIdx] : "."))
  );

  const gridWithInsideMarked = gridWithPipe.map((row, rIdx) => {
    const verticalPipes = getVerticalPipesInLine(row);
    return row.map((tile, tIdx) => {
      if (tile !== ".") {
        return tile;
      } else {
        const numVerticalPipes = verticalPipes.filter(
          ([symbol, start, stop]) => start <= tIdx
        ).length;
        return numVerticalPipes % 2 === 1 ? "I" : "O";
      }
    });
  });

  return gridWithInsideMarked.reduce((sum, row) => {
    return sum + row.reduce((s, tile) => (tile === "I" ? s + 1 : s), 0);
  }, 0);
}

// Vertical pipes are: "|", "F--...-J", "L--...-7".
function getVerticalPipesInLine(
  line: TileContent[]
): [string, number, number][] {
  let verticalPipesInLine: [string, number, number][] = [];
  let i = 0;
  while (i < line.length) {
    const tile = line[i];
    if (tile === "|") {
      verticalPipesInLine.push(["|", i, i]);
      i += 1;
      continue;
    } else if (tile === "F") {
      const start = i;
      i += 1;
      while (line[i] === "-" && i < line.length) {
        i += 1;
      }
      if (i < line.length && line[i] === "J") {
        verticalPipesInLine.push(["FJ", start, i]);
      }
    } else if (tile === "L") {
      const start = i;
      i += 1;
      while (line[i] === "-" && i < line.length) {
        i += 1;
      }
      if (i < line.length && line[i] === "7") {
        verticalPipesInLine.push(["L7", start, i]);
      }
    }
    i += 1;
  }
  return verticalPipesInLine;
}

function isPipe(a: TileContent): a is PipeTypes {
  return (
    a === "-" || a === "7" || a === "F" || a === "J" || a === "L" || a === "|"
  );
}

function getConnectedPipes(
  grid: TileContent[][],
  neighbours: ReturnType<typeof getNeighbours>,
  distanceGrid?: number[][]
) {
  return neighbours
    .map(([x, y, position]) => {
      const neighbourTile = grid[x][y];
      if (!isPipe(neighbourTile)) {
        return undefined;
      }

      const alreadyVisited =
        distanceGrid === undefined ? false : distanceGrid[x][y] !== -1;
      if (alreadyVisited) {
        return undefined;
      }

      if (!isCompatible(neighbourTile, getOpposite(position))) {
        return undefined;
      }

      return { x, y, position };
    })
    .filter((el) => el !== undefined) as {
    x: number;
    y: number;
    position: Direction;
  }[];

  function isCompatible(pipeSymbol: PipeTypes, connectTo: Direction) {
    const pipe = PipeSymbolToPipeMap.get(pipeSymbol);
    if (!pipe) {
      throw "Trying to acces a pipe symbol not in the map. Should not happen.";
    }
    return pipe.connects[0] === connectTo || pipe.connects[1] === connectTo;
  }
}

function parseInput(
  input: string
): [TileContent[][], { x: number; y: number }] {
  let grid = input.split("\r\n").map((line) => [...line]) as TileContent[][];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "S") {
        grid[i][j] = getPipeTypeForS(i, j);
        return [grid, { x: i, y: j }];
      }
    }
  }
  return [[[]], { x: -1, y: -1 }];

  function getPipeTypeForS(x: number, y: number): PipeTypes {
    const connectedPipes = getConnectedPipes(
      grid,
      getNeighbours("S", x, y, grid.length, grid[x].length)
    );

    const pipeType = [...PipeSymbolToPipeMap].find(([pipeType, pipe]) =>
      pipe.connects.every((pos) =>
        connectedPipes.find((cp) => cp.position === pos)
      )
    )?.[0];
    if (!pipeType) {
      throw "S should be a pipe";
    }
    return pipeType;
  }
}

export const expectedResultPart1 = 6927;
export const expectedResultPart2 = 467;

// Part one - Real input 6927
// Part two - Real input 467
// Part one - Test input 8
// Part two - Test input 10
solveTest1(__dirname, solve1);
solveReal1(__dirname, solve1);
solveTest2(__dirname, solve2);
solveReal2(__dirname, solve2);

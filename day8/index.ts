import {
  solveReal1,
  solveReal2,
  solveTest1,
  solveTest2,
} from "../read_write/read";

const solve1 = (input: string) => {
  const startNode = "AAA";
  const stopNode = "ZZZ";

  const instructions = input.split("\r\n")[0];

  const adjacentMapList = input
    .split("\r\n")
    .slice(2)
    .reduce((adjMap, nodeInfo) => {
      const [node, adjacentNodes] = nodeInfo.split("=").map((i) => i.trim());
      const adjacentNodesList = adjacentNodes
        .split(",")
        .map((n) => n.replace("(", "").replace(")", "").trim());
      adjMap.set(node, adjacentNodesList);
      return adjMap;
    }, new Map<string, string[]>());

  let currentNode = startNode;
  let step = 0;
  while (currentNode !== stopNode) {
    const currentInstructionIdx = step % instructions.length;
    const instruction = instructions[currentInstructionIdx];
    currentNode = adjacentMapList
      .get(currentNode)!
      .at(instruction === "L" ? 0 : 1)!;
    step += 1;
  }

  return step;
};

const solve2 = (input: string) => {
  const instructions = input.split("\r\n")[0];

  const { adjacentMapList, startNodes } = input
    .split("\r\n")
    .slice(2)
    .reduce<{ adjacentMapList: Map<string, string[]>; startNodes: string[] }>(
      ({ adjacentMapList, startNodes }, nodeInfo) => {
        const [node, adjacentNodes] = nodeInfo.split("=").map((i) => i.trim());
        const adjacentNodesList = adjacentNodes
          .split(",")
          .map((n) => n.replace("(", "").replace(")", "").trim());
        adjacentMapList.set(node, adjacentNodesList);

        if (node.endsWith("A")) {
          startNodes.push(node);
        }

        return { adjacentMapList, startNodes };
      },
      { adjacentMapList: new Map<string, string[]>(), startNodes: [] }
    );

  let currentNodes = [...startNodes];
  let startNodesAndStepWhenAtZ: [string, number[]][] = startNodes.map((node) => [node, []]);
  let step = 0;
  while (
    !currentNodes.every((node) => node.endsWith("Z")) &&
    startNodesAndStepWhenAtZ.some(([_, firstZ]) => firstZ.length === 0)
  ) {
    const nodesThatEndWithZ = currentNodes.map((node) => node.endsWith("Z"));
    if (nodesThatEndWithZ.some((el) => el)) {
      nodesThatEndWithZ.forEach((isEnd, idx) => {
        if (isEnd) {
          startNodesAndStepWhenAtZ[idx][1] = [...startNodesAndStepWhenAtZ[idx][1], step];
        }
      });
    }

    const currentInstructionIdx = step % instructions.length;
    const instruction = instructions[currentInstructionIdx];
    currentNodes = currentNodes.map(
      (node) => adjacentMapList.get(node)!.at(instruction === "L" ? 0 : 1)!
    );
    step += 1;
  }

  // Utilities taken from https://stackoverflow.com/a/61352020/12062998
  const gcd: (a: number, b: number) => number = (a, b) =>
    b == 0 ? a : gcd(b, a % b);
  const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
  const lcmAll = (ns: number[]) => ns.reduce(lcm, 1);

  const zAt = startNodesAndStepWhenAtZ.map(([_, firstZ]) => firstZ[0]);

  return lcmAll(zAt);
};

// Part one - Test input 2
// Part one - Real input 21797
// Part two - Test input 6
// Part two - Real input 23977527174353
solveTest1(__dirname, solve1);
solveReal1(__dirname, solve1);
solveTest2(__dirname, solve2);
solveReal2(__dirname, solve2);

import {
  solveReal1,
  solveReal2,
  solveTest1,
  solveTest2,
} from "../read_write/read";

export const solve1 = (input: string) => {
  const steps = input.split(",");
  return steps.reduce((sum, step) => {
    return sum + hash(step);
  }, 0);
};

interface Lens {
  label: string;
  focalLength: number;
}

const eq = "=";
const dash = "-";
const operations = [eq, dash] as const;

export const solve2 = (input: string) => {
  const steps = input.split(",");
  const lenses = steps.reduce<Lens[][]>(
    (boxes, step) => {
      const optionIdx = [...step].findIndex((ch) =>
        operations.some((o) => o === ch)
      );
      const label = step.substring(0, optionIdx);
      const operation = step[optionIdx];
      const assignedBoxIdx = hash(label);
      const box = boxes.at(assignedBoxIdx);
      if (!box) {
        // Impossible;
        throw `Box does not exist at index ${assignedBoxIdx}`;
      }
      if (operation === dash) {
        const lensIdx = box.findIndex((item) => label === item.label);
        if (lensIdx === -1) {
          return boxes;
        }
        const boxCopy = [...box];
        boxCopy.splice(lensIdx, 1);
        return boxes.map((b, idx) => (idx === assignedBoxIdx ? boxCopy : b));
      }
      const focalLength = parseInt(step.at(-1)!);
      const lensIdx = box.findIndex((item) => item.label === label);
      if (lensIdx === -1) {
        return boxes.map((b, i) =>
          i === assignedBoxIdx ? [...b, { label, focalLength }] : b
        );
      }
      return boxes.map((b, i) =>
        i === assignedBoxIdx
          ? b.map((lens, idx) =>
              idx === lensIdx ? { label: lens.label, focalLength } : lens
            )
          : b
      );
    },
    Array.from({ length: 256 }, () => [])
  );

  const focsPower = lenses.map((box, idx) =>
    box.map((lens, iLens) => (1 + idx) * (iLens + 1) * lens.focalLength)
  );
  return focsPower.reduce((s, box) => {
    return s + box.reduce((ss, l) => ss + l, 0);
  }, 0);
};

function hash(s: string) {
  return [...s].reduce((stepSum, ch) => {
    return ((ch.charCodeAt(0) + stepSum) * 17) % 256;
  }, 0);
}

export const expectedResultPart1 = 504036;
export const expectedResultPart2 = 295719;

solveTest1(__dirname, solve1);
solveReal1(__dirname, solve1);
solveTest2(__dirname, solve2);
solveReal2(__dirname, solve2);

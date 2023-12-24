import { solveReal2, solveTest2 } from "../read_write/read";

const solve2 = (input: string) => {
  const lines = input.split("\n");

  return lines.reduce((sum, line, idx) => {
    const gears = getGearsInLine(line)
      .map((gear) =>
        isAdjacentTo({
          value: gear,
          line,
          prevLine: idx - 1 >= 0 ? lines[idx - 1] : undefined,
          nextLine: idx + 1 < lines.length ? lines[idx + 1] : undefined,
          to: (ch) => !isNaN(parseInt(ch)),
        })
      )
      .filter((adjs) => adjs.length === 2);
    const a = gears.reduce((acc, curr) => {
      return acc + curr.reduce((a, c) => a * c, 1);
    }, 0);
    return sum + a;
  }, 0);
};

solveTest2(__dirname, solve2);
solveReal2(__dirname, solve2);

function getGearsInLine(line: string) {
  let lineChars = [...line];
  const gears: [string, number, number][] = [];
  let startIdx = 0;
  while (startIdx < lineChars.length) {
    const idx = lineChars.findIndex((ch) => ch === "*");
    if (idx === -1) {
      return gears;
    }
    gears.push(["*", idx, idx]);
    lineChars[idx] = ".";
    startIdx = idx;
  }
  return gears;
}
function getValuesInLine(line: string): [number, number, number][] {
  let lineChars = [...line];
  let values: [number, number, number][] = [];
  let startIdx = 0;
  while (startIdx < lineChars.length) {
    const firstDigitIdx = lineChars.findIndex((ch) => !isNaN(parseInt(ch)));
    if (firstDigitIdx === -1) {
      return values;
    }
    let stopIdx = firstDigitIdx;
    while (stopIdx < lineChars.length && !isNaN(parseInt(lineChars[stopIdx]))) {
      stopIdx += 1;
    }
    values.push([
      parseInt(
        lineChars.reduce(
          (val, ch, idx) =>
            idx >= firstDigitIdx && idx < stopIdx ? val + ch : val,
          ""
        )
      ),
      firstDigitIdx,
      stopIdx - 1,
    ]);
    lineChars = lineChars.map((ch, idx) =>
      idx >= firstDigitIdx && idx < stopIdx ? "." : ch
    );
    startIdx = stopIdx;
  }
  return values;
}

function isAdjacentToSymbol({
  value: [val, startIdx, stopIdx],
  line,
  nextLine,
  prevLine,
}: {
  value: [string, number, number];
  line: string;
  prevLine?: string;
  nextLine?: string;
}) {
  if (startIdx > 0 && line[startIdx - 1] !== ".") {
    return true;
  }
  if (stopIdx < line.length - 1 && line[stopIdx + 1] !== ".") {
    return true;
  }
  if (prevLine) {
    const substr = prevLine.substring(
      startIdx > 0 ? startIdx - 1 : startIdx,
      stopIdx < line.length ? stopIdx + 2 : stopIdx
    );
    if ([...substr].some((ch) => ch !== ".")) {
      return true;
    }
  }
  if (nextLine) {
    const substr = nextLine.substring(
      startIdx > 0 ? startIdx - 1 : startIdx,
      stopIdx < line.length - 1 ? stopIdx + 2 : line.length
    );

    if ([...substr].some((ch) => ch !== ".")) {
      return true;
    }
  }
  return false;
}

function isAdjacentTo({
  value: [val, startIdx, stopIdx],
  line,
  nextLine,
  prevLine,
  to,
}: {
  value: [string, number, number];
  line: string;
  prevLine?: string;
  nextLine?: string;
  to: (ch: string) => boolean;
}) {
  let numbersAdjacent = 0;
  let valuesAdjacent: number[] = [];
  if (startIdx > 0 && to(line[startIdx - 1])) {
    numbersAdjacent++;
    //   valuesAdjacent.push(line[startIdx - 1]);
    valuesAdjacent.push(
      ...getValuesInLine(line)
        .filter(([_, start, stop]) => start < startIdx && stop === startIdx - 1)
        .map((v) => v[0])
    );
  }
  if (stopIdx < line.length - 1 && to(line[stopIdx + 1])) {
    numbersAdjacent++;
    //   valuesAdjacent.push(line[stopIdx + 1]);
    valuesAdjacent.push(
      ...getValuesInLine(line)
        .filter(
          ([_, start, stop]) => start === startIdx + 1 && stop > startIdx + 1
        )
        .map((v) => v[0])
    );
  }
  if (prevLine) {
    const substr = prevLine.substring(
      startIdx > 0 ? startIdx - 1 : startIdx,
      stopIdx < line.length ? stopIdx + 2 : stopIdx
    );
    if ([...substr].some(to)) {
      const firstSymbolIdx = [...substr].findIndex((ch) => isNaN(parseInt(ch)));
      const hasAnyNumberPrevious = [
        ...substr.substring(0, firstSymbolIdx),
      ].some((ch) => !isNaN(parseInt(ch)));
      const hasAnyNumberAfter = [
        ...substr.substring(firstSymbolIdx + 1, substr.length),
      ].some((ch) => !isNaN(parseInt(ch)));
      if (firstSymbolIdx !== -1 && hasAnyNumberAfter && hasAnyNumberPrevious) {
        numbersAdjacent += 2;
        valuesAdjacent.push();
      } else {
        numbersAdjacent++;
      }
      valuesAdjacent.push(
        ...getValuesInLine(prevLine)
          .filter(
            ([_, start, stop]) => start <= startIdx + 1 && stop >= startIdx - 1
          )
          .map((v) => v[0])
      );
    }
  }
  if (nextLine) {
    const substr = nextLine.substring(
      startIdx > 0 ? startIdx - 1 : startIdx,
      stopIdx < line.length - 1 ? stopIdx + 2 : line.length
    );

    if ([...substr].some(to)) {
      const firstSymbolIdx = [...substr].findIndex((ch) => isNaN(parseInt(ch)));
      const hasAnyNumberPrevious = [
        ...substr.substring(0, firstSymbolIdx),
      ].some((ch) => !isNaN(parseInt(ch)));
      const hasAnyNumberAfter = [
        ...substr.substring(firstSymbolIdx + 1, substr.length),
      ].some((ch) => !isNaN(parseInt(ch)));
      if (firstSymbolIdx !== -1 && hasAnyNumberAfter && hasAnyNumberPrevious) {
        numbersAdjacent += 2;
      } else {
        numbersAdjacent++;
      }
      valuesAdjacent.push(
        ...getValuesInLine(nextLine)
          .filter(
            ([_, start, stop]) => start <= startIdx + 1 && stop >= startIdx - 1
          )
          .map((v) => v[0])
      );
    }
  }
  return valuesAdjacent;
}

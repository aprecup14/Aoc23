import {
  solveReal1,
  solveReal2,
  solveTest1,
  solveTest2,
} from "../read_write/read";

const solve1 = (input: string) => {
  const lines = input.split("\n");

  const seedsText = lines[0].split(":")[1].trim();
  const seeds = seedsText.split(" ").map((s) => parseInt(s.trim()));

  const [_, ...maps] = input.split("map:");
  const mapsFunctions = maps
    .map((m) =>
      m
        .split("\r\n")
        .filter((chars) => chars.trim() !== "" && !isNaN(parseInt(chars[0])))
        .map(toFunc)
    )
    .map(addIdentityFunc);

  const locations = seeds.map((seed) => {
    return mapsFunctions.reduce((val, funcs) => {
      const associatedFunc = funcs.find((f) => f.domain.isIncluded(val));
      if (!associatedFunc) {
        throw "Impossible";
      }
      return associatedFunc.map(val);
    }, seed);
  });
  return Math.min(...locations);
};

const solve2 = (input: string) => {
  const lines = input.split("\n");

  const seedsText = lines[0].split(":")[1].trim();
  const seedsRanges = seedsText
    .split(" ")
    .map((s) => parseInt(s.trim()))
    .reduce<number[][]>(
      (pairs, val, idx) =>
        idx % 2 === 0
          ? [...pairs, [val]]
          : [...pairs.slice(0, -1), [...pairs.at(-1)!, val]],
      []
    );

  const mapsFunctions = parseMaps(input);

  // return seedsRanges.reduce((min, [start, range]) => {
  //   let rangeMin = Number.POSITIVE_INFINITY;
  //   const interval = Interval(start, start + range - 1);
  //   console.log(start);
  //   for (const value of interval.generateValues()) {
  //     const location = mapsFunctions.reduce((val, funcs) => {
  //       const associatedFunc = funcs.find((f) => f.domain.isIncluded(val));
  //       if (!associatedFunc) {
  //         throw "Impossible";
  //       }
  //       return associatedFunc.map(val);
  //     }, value);
  //     if (location < rangeMin) {
  //       rangeMin = location;
  //     }
  //   }

  //   return rangeMin < min ? rangeMin : min;
  // }, Number.POSITIVE_INFINITY);

  let intervals = seedsRanges.map(([start, range]) => Interval(start, start + range - 1));
  console.log(intervals)

  console.log(mapsFunctions[0]);

  intervals = intervals.flatMap(i => mapsFunctions[0].flatMap(f => i.getCommons(f.domain)))

  return 1;
};

solveTest1(__dirname, solve1); // Part one - Test input 35
solveTest2(__dirname, solve2); // Part two - Test input 46
solveReal1(__dirname, solve1); // Part one - Real input 836040384
// solveReal2(__dirname, solve2);

function parseMaps(input: string) {
  const [_, ...maps] = input.split("map:");
  return maps
    .map((m) =>
      m
        .split("\r\n")
        .filter((chars) => chars.trim() !== "" && !isNaN(parseInt(chars[0])))
        .map(toFunc)
    )
    .map(addIdentityFunc);
}

function toFunc(s: string) {
  const [drs, srs, r] = s.split(" ").map((v) => parseInt(v.trim()));
  return Func(drs, srs, r);
}

interface IInterval {
  start: number;
  stop: number;
  isIncluded(val: number): boolean;
  generateValues(): Iterable<number>;
  getCommons(otherInterval: IInterval): IInterval[]
  isIntervalIncluded(interval: IInterval): boolean;
  hasOverlap(interval: IInterval): boolean;
}

interface IFunc {
  domain: IInterval;
  codomain: IInterval;
  map(val: number): number;
}

function Interval(start: number, stop: number): IInterval {
  if (start > stop) {
    throw "Interval start must be smaller than stop";
  }
  return {
    start,
    stop,
    isIncluded(val) {
      return val >= start && val <= stop;
    },
    isIntervalIncluded(interval) {
      return interval.start >= this.start && interval.stop <= this.stop
    },
    hasOverlap(interval){
      return this.stop >= interval.start
    },
    *generateValues() {
      for (let i = start; i <= stop; i++) yield i;
    },
    getCommons(otherInterval) {
      if (!this.hasOverlap(otherInterval)){
        return [];
      }
      if (otherInterval.isIntervalIncluded(this)){
        return [this];
      }
       
        const common = Interval(this.start > otherInterval.start ? this.start : otherInterval.start, this.stop < otherInterval.stop ? this.stop: otherInterval.stop);

        return [];
    },
  };
}

function Func(drs: number, srs: number, r: number): IFunc {
  return {
    domain: Interval(srs, srs + r - 1),
    codomain: Interval(drs, drs + r - 1),
    map(val) {
      return val - srs + drs;
    },
  };
}

function IdentityFunc(): IFunc {
  return {
    domain: Interval(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY),
    codomain: Interval(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY),
    map(val) {
      return val;
    },
  };
}

function addIdentityFunc(funcs: IFunc[]): IFunc[] {
  return [...funcs, IdentityFunc()];
}

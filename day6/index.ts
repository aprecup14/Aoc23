import {
  solveReal1,
  solveReal2,
  solveTest1,
  solveTest2,
} from "../read_write/read";

const solve1 = (input: string) => {
  const [timeLine, distanceLine] = input.split("\n");
  const times = timeLine
    .split(":")[1]
    .trim()
    .split(" ")
    .map((el) => el.trim())
    .filter((el) => el !== "")
    .map((el) => parseInt(el));
  const distances = distanceLine
    .split(":")[1]
    .trim()
    .split(" ")
    .map((el) => el.trim())
    .filter((el) => el !== "")
    .map((el) => parseInt(el));
  const races = times.map((t, idx) => Race(t, distances[idx]));

  return races.reduce((waysToBeatRecordMultiplied, race) => {
    if (waysToBeatRecordMultiplied === 0) {
      return race.getNumWaysToBeatRecord();
    }
    return race.getNumWaysToBeatRecord() * waysToBeatRecordMultiplied;
  }, 0);
};

const solve2 = (input: string) => {
  const [timeLine, distanceLine] = input.split("\n");
  const times = timeLine
    .split(":")[1]
    .trim()
    .split(" ")
    .map((el) => el.trim())
    .filter((el) => el !== "")
    .reduce((s, chars) => [s[0] + chars], [""])
    .map((el) => parseInt(el));
  const distances = distanceLine
    .split(":")[1]
    .trim()
    .split(" ")
    .map((el) => el.trim())
    .filter((el) => el !== "")
    .reduce((s, chars) => [s[0] + chars], [""])
    .map((el) => parseInt(el));

  const races = times.map((t, idx) => Race(t, distances[idx]));

  return races.reduce((waysToBeatRecordMultiplied, race) => {
    if (waysToBeatRecordMultiplied === 0) {
      return race.getNumWaysToBeatRecord();
    }
    return race.getNumWaysToBeatRecord() * waysToBeatRecordMultiplied;
  }, 0);
};

interface Race {
  time: number;
  record: number;
  getNumWaysToBeatRecord(): number;
}

function Race(time: number, record: number): Race {
  return {
    time,
    record,
    getNumWaysToBeatRecord() {
      /* Let pt be the press time.
        The time the boat moves is t - pt, where t is constant (race time).
        the speed is pt mm/ms.
        So, in order to beat the record:
        (t - pt) * pt > d (where d = record distance)

        So, pt^2 - t * pt + d < 0, where t and d are known.
        */
      const delta = time ** 2 - 4 * record;
      const [x1, x2] = [
        (time + Math.sqrt(delta)) / 2,
        (time - Math.sqrt(delta)) / 2,
      ];
      const x1Integer = x1 === Math.floor(x1);
      const x2Integer = x2 === Math.ceil(x2);

      return (
        Math.floor(x1) -
        Math.ceil(x2) +
        1 -
        (x1Integer ? 1 : 0) -
        (x2Integer ? 1 : 0)
      );
    },
  };
}

solveTest1(__dirname, solve1); // Part one - Test input 288
solveReal1(__dirname, solve1); // Part one - Real input 4568778
solveTest2(__dirname, solve2); // Part two - Test input 71503
solveReal2(__dirname, solve2); // Part two - Real input 28973936

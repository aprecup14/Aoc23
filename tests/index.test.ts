import path from "path";
import { readFile } from "fs/promises";

function toRelativePath(name: `day${number}`) {
  return path.join(__dirname, "..", name, "index.ts");
}

const pathToIndexFiles = Array.from(
  { length: 9 },
  (_, idx) => `day${idx + 3}` as const
)
  .map(toRelativePath)
  .concat(
    toRelativePath("day13"),
    toRelativePath("day14"),
    toRelativePath("day15"),
    toRelativePath("day16")
  );

describe.each(pathToIndexFiles)("Tests for %s", (filePath) => {
  let module: any = undefined;

  beforeAll(async () => {
    module = await import(filePath);
  });

  afterAll(() => {
    module = undefined;
  });

  it("Exports solve1 and solve2", () => {
    const { solve1, solve2 } = module;
    expect(solve1).not.toBeUndefined();
    expect(solve2).not.toBeUndefined();
  });

  it("Expected result is returned when calling solve methods", (done) => {
    const { solve1, solve2, expectedResultPart1, expectedResultPart2 } = module;
    readFile(path.join(filePath, "..", "input.txt"), {
      encoding: "utf-8",
    })
      .then((inputFile) => {
        try {
          if (expectedResultPart1 !== undefined) {
            expect(solve1(inputFile)).toBe(expectedResultPart1);
          }
          if (expectedResultPart2 !== undefined) {
            expect(solve2(inputFile)).toBe(expectedResultPart2);
          }
          done();
        } catch (err) {
          done(err);
        }
      })
      .catch((e) => {
        done(e);
      });
  });
});

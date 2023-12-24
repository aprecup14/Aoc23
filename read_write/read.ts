import * as fs from "fs";
import path from "path";

type InputFileName = "test_input1.txt" | "input.txt" | "test_input2.txt";

const solve =
  (part: "one" | "two") =>
  (partType: "Test" | "Real") =>
  (dirname: string, cb: (input: string) => number) => {
    const logText = `Part ${part} - ${partType} input`;
    let fileName: InputFileName = "input.txt";
    if (partType !== "Real") {
      fileName = part === "one" ? "test_input1.txt" : "test_input2.txt";
    }

    fs.readFile(path.join(dirname, fileName), { encoding: "utf-8" }, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(logText, cb(data));
    });
  };

export const solveTest1 = solve("one")("Test");
export const solveTest2 = solve("two")("Test");
export const solveReal1 = solve("one")("Real");
export const solveReal2 = solve("two")("Real");

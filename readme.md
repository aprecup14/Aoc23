# Advent of code 2023

## __How to develop:__
1) Create a directory for the day you are working on named day{DAY_NUMBER}.
<span id="folder-structure"></span>
Inside of the new directory, create the following files:
- `index.ts` code. 
- `input.txt` the input.
- `test_input1.txt` test input for the first part of the challenge.
- `test_input2.txt` test input for the second part of the challenge.
2) Use the helper functions from `read_write/read.ts`: `solveTest1`, `solveTest2`,`solveReal1`, `solveReal2`.

## __How to test:__

The code can be tested. In order for the tests to work for a `day{DAY_NUMBER}` directory make sure that:
- It has the structure suggested at [How to develop - 1](#folder-structure)
- The `index.ts` file exports the solutions for each part of the challenge (naming them `solve1` and `solve2`).
- Export two variables, `expectedResultPart1` and `expectedResultPart2` which represent the expected results of the challenge. Can be undefined at the start of the challenge.
- There is a list of directories in `tests/index.test.ts`. Tests will be created for each directory. Make sure that the newly created directory is part of that list.

## __How to run:__
1) Run `npm install`
1) Navigate to the directory of your choice.
2) Run `npx nodemon index.ts`

## __How to run tests:__
1) Run `npm test`.

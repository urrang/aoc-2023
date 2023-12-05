import { readFile } from './utils';

const content = readFile('src/day1/input.txt');

function part1() {
    let sum = 0;

    for (let line of content.split('\n')) {
        const digits = [...line.match(/\d/g)];
        sum += Number(digits.at(0) + '' + digits.at(-1));
    }

    console.log(sum);
}

function part2() {
    let sum = 0;
    const wordToDigit = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9 };

    for (let line of content.split('\n')) {
        const digits = [];

        while (line.length) {
            if (Number(line[0])) {
                digits.push(Number(line[0]));
            } else {
                for (const word in wordToDigit) {
                    if (line.startsWith(word)) {
                        digits.push(wordToDigit[word]);
                    }
                }
            }

            line = line.slice(1);
        };

        sum += Number(digits.at(0) + '' + digits.at(-1));
    }

    console.log(sum);
}

export default function day1() {
    part1();
    part2();
}
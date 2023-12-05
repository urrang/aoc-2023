import { readFile } from '../utils';

const input = readFile('src/inputs/day5.txt');
const lines = input.replace(/Card\s*\d+: /g, '').split('\n');

function part1() {
    console.log(input);
}

function part2() {}

export default function day4() {
    part1();
    part2();
}

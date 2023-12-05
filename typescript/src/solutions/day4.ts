import { readFile } from '../utils';

const input = readFile('src/day4/input.txt');
const lines = input.replace(/Card\s*\d+: /g, '').split('\n');

const winCount = [];

function part1() {
    let sum = 0;

    for (let i = 0; i < lines.length; i++) {
        const count = getWinningNumbersCount(lines[i]);
        winCount[i] = count;
        sum += count > 0 ? Math.pow(2, count - 1) : 0;
    }

    console.log(sum);
}

function part2() {
    console.time('part2');
    let cardCount = 0;

    function processCard(index: number) {
        cardCount++;
        const count = winCount[index];
        if (count > 0) {
            for (let i = index + 1; i <= index + count; i++) {
                processCard(i);
            }
        }
    }

    for (let i = 0; i < lines.length; i++) {
        processCard(i);
    }

    console.timeEnd('part2');
    console.log(cardCount);
}

function getWinningNumbersCount(card: string): number {
    let count = 0;

    const found = {}
    for (const num of card.match(/\d+/g)) {
        if (found[num]) count++;
        found[num] = true;
    }

    return count;
}

export default function day4() {
    part1();
    part2();
}
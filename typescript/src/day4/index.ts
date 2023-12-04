import { readFile } from '../utils';

const example = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

const input = readFile('src/day4/input.txt');
const lines = input.split('\n');

function part1() {
    let sum = 0;

    for (const line of lines) {
        const count = getWinningNumbersCount(line);
        sum += count > 0 ? Math.pow(2, count - 1) : 0;
    }

    console.log(sum);
}

function part2() {
    let cardCount = 0;

    function processCards(cards: string[]) {
        cardCount += cards.length;

        const wonCopies = [];

        for (const card of cards) {
            let count = getWinningNumbersCount(card);

            if (count > 0) {
                const index = lines.indexOf(card);
                wonCopies.push(...lines.slice(index + 1, index + count + 1));
            }

        }

        if (wonCopies.length) {
            processCards(wonCopies);
        }
    }

    processCards(lines);

    console.log(cardCount);
}

function getWinningNumbersCount(card: string): number {
    const [_, numbers] = card.split(':');

    const nums = numbers.match(/\d+/g);

    let count = 0;

    const found: any = {}

    for (const num of nums) {
        if (found[num]) count++;
        found[num] = true;
    }

    return count;
}

export default function day4() {
    part1();
    part2();
}
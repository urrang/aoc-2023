import { input } from 'src/input';

const winCount = [];

export function part1() {
    const lines = input.replace(/Card\s*\d+: /g, '').split('\n');
    let sum = 0;

    for (let i = 0; i < lines.length; i++) {
        const count = getWinningNumbersCount(lines[i]);
        winCount[i] = count;
        sum += count > 0 ? Math.pow(2, count - 1) : 0;
    }

    return sum;
}

export function part2() {
    const lines = input.replace(/Card\s*\d+: /g, '').split('\n');

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

    return cardCount;
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
import { input } from 'src/input';

const data = input.split('\n').map(line => line.match(/\d+/g));

export function part1() {
    const games = data[0].map((time, i) => ({ time: parseInt(time), distance: parseInt(data[1][i]) }));

    let winCounts = [];
    for (const game of games) {
        let count = 0;
        for (let i = 1; i < game.time; i++) {
            const distance = (game.time - i) * i;
            if (distance > game.distance) {
                count++;
            }
        }

        winCounts.push(count);
    }

    return winCounts.reduce((a, b) => a * b);
}

export function part2() {
    let time = parseInt(data[0].join(''));
    let distance = parseInt(data[1].join(''));

    let count = 0;

    for (let i = 1; i < time; i++) {
        const d = (time - i) * i;
        if (d > distance) {
            count++;
        }
    }

    return count;
}
import { readFile } from '../utils';

const data = readFile('src/inputs/day6.txt').split('\n').map(line => line.match(/\d+/g));

function part1() {
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

    console.log(winCounts.reduce((a, b) => a * b));
}

function part2() {
    let time = parseInt(data[0].join(''));
    let distance = parseInt(data[1].join(''));

    let count = 0;

    for (let i = 1; i < time; i++) {
        const d = (time - i) * i;
        if (d > distance) {
            count++;
        }
    }

    console.log(count);
}

export default function day6() {
    part1();
    part2();
}




import {input} from 'src/input';

const exampleInput = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

const report = input.split('\n').map(line => line.match(/\-?\d+/g).map(Number));

function solve(line: number[], isPart2: boolean) {
    const sequences = [line];

    while (true) {
        const lastSequence = sequences.at(-1);
        const newSequence = [];
        for (let i = 0; i < lastSequence.length - 1; i++) {
            newSequence.push(lastSequence[i + 1] - lastSequence[i]);
        }

        sequences.push(newSequence);
        if (!newSequence.length || newSequence.every(num => num === 0)) break;
    }

    sequences.reverse();

    let num = 0;
    for (const line of sequences) {
        if (isPart2) {
            num = line.at(0) - num;
        } else {
            num += line.at(-1) || 0;
        }
    }

    return num;
}

// 1974232246
export function part1() {
    return report.reduce((sum, line) => sum += solve(line, false), 0);
}

// 928
export function part2() {
    return report.reduce((sum, line) => sum += solve(line, true), 0);
}
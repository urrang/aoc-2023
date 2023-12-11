import { input } from 'src/input';

export function part1() {
    let sum = 0;

    const lines = input.split('\n');
    lines.forEach((line, index) => {
        const numbers = Array.from(line.matchAll(/\d+/g));

        numbers.forEach((number) => {
            const before = Math.max(0, number.index - 1);
            const after = Math.min(line.length - 1, number.index + number[0].length);

            const chars = line[before] + line[after]
                + (lines[index - 1] || '').slice(before, after + 1)
                + (lines[index + 1] || '').slice(before, after + 1);

            if (/[^a-zA-Z0-9.]/.test(chars)) {
                sum += Number(number[0]);
            }
        });
    });

    return sum;
}

export function part2() {
    let sum = 0;

    const lines = input.split('\n');

    lines.forEach((line, index) => {
        for (const asterisk of line.matchAll(/\*/g)) {
            const candidateNumbers = [
                ...Array.from(line.matchAll(/\d+/g)),
                ...Array.from((lines[index - 1] || '').matchAll(/\d+/g)),
                ...Array.from((lines[index + 1] || '').matchAll(/\d+/g)),
            ];

            const numbers = candidateNumbers.filter(number => {
                const numberEnd = number.index + number[0].length - 1;

                return Math.abs(asterisk.index - number.index) <= 1
                    || Math.abs(asterisk.index - numberEnd) <= 1;
            });

            if (numbers.length === 2) {
                sum += Number(numbers[0]) * Number(numbers[1]);
            }
        }
    });

    return sum;
}
import { input } from 'src/input';

export function part1() {
    const bagCounts = { red: 12, green: 13, blue: 14 };
    let idSum = 0;

    for (const line of input.split('\n')) {
        let [id, cubeCounts] = line.split(': ');

        const valid = cubeCounts.split(/; |, /g).every(cubeCount => {
            const [count, color] = cubeCount.split(' ');
            return bagCounts[color] >= parseInt(count);
        });

        if (valid) {
            idSum += Number(id.match(/\d+/)[0]);
        }
    }

    return idSum;
}

export function part2() {
    const sum = input.split('\n').reduce((sum, line) => {
        const cubeCounts = line.trim().split(': ')[1];

        const minCounts = { red: 0, green: 0, blue: 0 };

        for (const cubeCount of cubeCounts.split(/; |, /g)) {
            const [count, color] = cubeCount.split(' ');
            minCounts[color] = Math.max(minCounts[color], parseInt(count));
        }

        return sum + (minCounts.red * minCounts.green * minCounts.blue);
    }, 0);

    return sum;
}
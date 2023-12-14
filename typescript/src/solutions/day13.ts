import {input} from 'src/input';

const exampleInput = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

const patterns = input.split('\n\n').map(group => {
    const rows = group.split('\n');
    return rows;
    // return rows.map(row => row.split(''));
});

function findIndex(pattern: string[]) {
    return pattern.findIndex((row, index) => {
        if (row !== pattern[index + 1]) return false;

        for (let i = 0; i + index + 1 < pattern.length; i++) {
            if (pattern[index - i] && pattern[index - i] !== pattern[index + i + 1]) {
                return false;
            }
        }

        return true;
    });
}

function getReflection(pattern: string[]) {
    // Find horizontal reflection
    let index = findIndex(pattern);

    if (index >= 0) {
        return 100 * (index + 1);
    }

    // Find vertical reflection
    const transformed = [];
    for (let i = 0; i < pattern[0].length; i++) {
        transformed.push(pattern.map(row => row[i]).join(''));
    }

    index = findIndex(transformed);

    if (index >= 0) {
        return index + 1;
    }

    // This should never happen
    console.log('nope');
    return 0;
}


// 31956
export function part1() {
    return patterns.map(getReflection).reduce((sum, value) => sum + value, 0);
}

export function part2() {

}
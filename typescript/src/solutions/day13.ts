import {input} from 'src/input';

const patterns = input.split('\n\n').map(group => group.split('\n'));

function findIndex(pattern: string[], horizontal?: boolean, ignore?: number) {
    return pattern.findIndex((row, index) => {
        if (row !== pattern[index + 1]) return false;

        for (let i = 0; i + index + 1 < pattern.length; i++) {
            if (pattern[index - i] && pattern[index - i] !== pattern[index + i + 1]) {
                return false;
            }
        }

        if (ignore) {
            const reflection = horizontal ? 100 * (index + 1) : index + 1;
            if (reflection === ignore) return false;
        }

        return true;
    });
}

function getReflection(pattern: string[], ignoreReflection?: number) {
    // Find horizontal reflection
    let index = findIndex(pattern, true, ignoreReflection);

    if (index >= 0) {
        return 100 * (index + 1);
    }

    // Find vertical reflection
    const transformed = [];
    for (let i = 0; i < pattern[0].length; i++) {
        transformed.push(pattern.map(row => row[i]).join(''));
    }

    index = findIndex(transformed, false, ignoreReflection);

    if (index >= 0) {
        return index + 1;
    }

    return 0;
}

function toggleChar(row: string, index: number) {
    if (index >= row.length) return row;
    return row.substring(0, index) + (row[index] === '#' ? '.' : '#') + row.substring(index + 1);
}

const part1Reflections: number[] = [];

export function part1() {
    let sum = 0;
    for (const pattern of patterns) {
        const reflection = getReflection(pattern);
        part1Reflections.push(reflection);
        sum += reflection;
    }

    return sum;
}

export function part2() {
    return patterns.reduce((sum, pattern, index) => {
        for (let i = 0; i < pattern.length; i++) {
            for (let j = 0; j < pattern[i].length; j++) {
                pattern[i] = toggleChar(pattern[i], j);

                const reflection = getReflection(pattern, part1Reflections[index]);
                if (reflection) {
                    return sum + reflection;
                } else {
                    pattern[i] = toggleChar(pattern[i], j);
                }
            }
        }
    }, 0);
}
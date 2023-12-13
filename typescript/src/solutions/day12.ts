import {input} from 'src/input';

const rows = input.split('\n').map(line => {
    let [springs, groupSizes] = line.split(' ');

    return {
        springs: springs,
        groupSizes: groupSizes.split(',').map(Number)
    }
});

const cache = new Map<string, number>();

function countOptions(springs: string, groupSizes: number[]) {
    if (!groupSizes.length) {
        return !springs.includes('#') ? 1 : 0;
    }

    const key = `${springs}-${groupSizes}`;

    if (cache.has(key)) {
        return cache.get(key)!;
    }

    let count = 0;

    const [size, ...rest] = groupSizes;

    const validIndexes = getValidIndexes(springs, size);

    for (const index of validIndexes) {
        count += countOptions(springs.slice(index + size + 1), rest);
    }

    cache.set(key, count);
    return count;
}

const regex = /^[#?]+$/;

function getValidIndexes(text: string, count) {
    const hashIndex = text.indexOf('#');
    const indexes = [];

    for (let i = 0; i <= text.length - count; i++) {
        // No start indexes after a # are valid
        if (hashIndex >= 0 && i > hashIndex) break;

        // If the spring following this group is broken it's not valid
        if (text.charAt(i + count) === '#') continue;

        if (regex.test(text.slice(i, i + count))) {
            indexes.push(i);
        }
    }

    return indexes;
}

export function part1() {
    return rows.reduce((sum, row) => sum + countOptions(row.springs, row.groupSizes), 0);
}

export function part2() {
    const unfolded = rows.map(({springs, groupSizes}) => {
        return {
            springs: `${springs}?${springs}?${springs}?${springs}?${springs}`,
            groupSizes: [...groupSizes, ...groupSizes, ...groupSizes, ...groupSizes, ...groupSizes]
        }
    });

    return unfolded.reduce((sum, row) => sum + countOptions(row.springs, row.groupSizes), 0);
}

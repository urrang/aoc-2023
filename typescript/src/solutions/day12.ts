import {input} from 'src/input';

interface Row {
    springs: string;
    damagedGroupSizes: number[];
}

const exampleInput = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;


const rows: Row[] = input.split('\n').map(line => {
    let [springs, damagedGroupSizes] = line.split(' ');

    return {
        springs: springs,
        damagedGroupSizes: damagedGroupSizes.split(',').map(Number)
    }
});

const cache = new Map<string, number>();

function countOptions(springs: string, damagedGroupSizes: number[]) {
    if (!damagedGroupSizes.length) {
        return !springs.includes('#') ? 1 : 0;
    }

    const key = `${springs}-${damagedGroupSizes}`;

    if (cache.has(key)) {
        return cache.get(key)!;
    }

    let count = 0;

    const [size, ...rest] = damagedGroupSizes;

    const possibleIndexes = getPossibleIndexes(springs, size);

    for (const index of possibleIndexes) {
        count += countOptions(springs.slice(index + size + 1), rest);
    }

    cache.set(key, count);
    return count;
}

const regex = /^[#?]+$/;

function getPossibleIndexes(text: string, count) {
    // If we step over a # we have to use it
    const hashIndex = text.indexOf('#');
    let maxEndIndex = hashIndex === -1 ? text.length - 1 : hashIndex + count - 1;

    let indexes = [];
    for (let i = 0; i <= text.length - count; i++) {
        if (regex.test(text.slice(i, i + count))) {
            if (i + count > maxEndIndex + 1) continue;

            // If the next character is a # we can't use this index
            if (text.charAt(i + count) === '#') continue;

            indexes.push(i);
        }
    }

    return indexes;
}

export function part1() {
    return rows.reduce((sum, row) => sum + countOptions(row.springs, row.damagedGroupSizes), 0);
}

export function part2() {
    const unfolded: Row[] = rows.map(({springs, damagedGroupSizes}) => {
        return {
            springs: `${springs}?${springs}?${springs}?${springs}?${springs}`,
            damagedGroupSizes: [...damagedGroupSizes, ...damagedGroupSizes, ...damagedGroupSizes, ...damagedGroupSizes, ...damagedGroupSizes]
        }
    });

    return unfolded.reduce((sum, row) => sum + countOptions(row.springs, row.damagedGroupSizes), 0);
}

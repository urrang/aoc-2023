import { input } from 'src/input';

const groups = input.split('\n\n');

const seeds = groups
    .shift()
    .replace('seeds: ', '')
    .split(' ')
    .map(x => parseInt(x));

const maps = groups.map((group) => {
    const lines = group.split('\n').slice(1);
    return lines.map(line => {
        const values = line.split(' ');
        return {
            destStart: parseInt(values[0]),
            destEnd: parseInt(values[0]) + parseInt(values[2]),
            sourceStart: parseInt(values[1]),
            sourceEnd: parseInt(values[1]) + parseInt(values[2]),
        }
    });
})

function getDestination(source: number, map: any[]) {
    for (const item of map) {
        if (source >= item.sourceStart && source < item.sourceEnd) {
            return item.destStart + (source - item.sourceStart);
        }
    }

    return source;
}

export function part1() {
    let minLocation = Infinity;

    for (const seed of seeds) {
        let value = seed;
        for (const map of maps) {
            value = getDestination(value, map);
        }

        if (value < minLocation) {
            minLocation = value;
        }
    }

    return minLocation;
}

function isSeed(value: number) {
    for (let i = 0; i < seeds.length; i += 2) {
        if (value >= seeds[i] && value < seeds[i] + seeds[i + 1]) {
            return true;
        }
    }

    return false;
}

function getSource(dest: number, map: any[]) {
    for (const item of map) {
        if (dest >= item.destStart && dest < item.destEnd) {
            return item.sourceStart + (dest - item.destStart);
        }
    }

    return dest;
}

export function part2() {
    const mapsReversed = maps.toReversed();

    let location = 0;
    while ('yolo') {
        let value = location;
        for (const map of mapsReversed) {
            value = getSource(value, map);
        }

        if (isSeed(value)) {
            return location;
        }

        location++;
    }
}

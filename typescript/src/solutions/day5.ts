import { get } from 'http';
import { readFile } from '../utils';

const example = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`;

const input = readFile('src/inputs/day5.txt');

const groups = input.split('\n\n');
const seeds = groups
    .shift()
    .replace('seeds: ', '')
    .split(' ')
    .map(x => parseInt(x));

// const [soilMap, fertilizerMap, waterMap, lightMap, tempMap, humidityMap, locationMap] = groups.map(x => parseMap(x))
const maps = groups.map(x => parseMap(x))

function parseMap(group: string) {
    const lines = group.split('\n');
    lines.shift();
    return lines.map(line => {
        const values = line.split(' ');
        return {
            destStart: parseInt(values[0]),
            sourceStart: parseInt(values[1]),
            length: parseInt(values[2])
        };
    });
}

function getDest(source: number, map: any[]) {
    let dest = -1;

    for (const item of map) {
        if (source >= item.sourceStart && source < item.sourceStart + item.length) {
            dest = item.destStart + (source - item.sourceStart);
            break;
        }
    }

    return dest >= 0 ? dest : source;
}

function part1() {
    // console.log('seeds', seeds);
    // console.log('soil', soil);
    // console.log('fertilizer', fertilizer);
    // console.log('water', water);
    // console.log('light', light);
    // console.log('temp', temp);
    // console.log('humidity', humidity);
    // console.log('location', location);

    let minLocation = Infinity;

    for (const seed of seeds) {
        let value = seed;
        for (const map of maps) {
            value = getDest(value, map);
        }

        if (value < minLocation) {
            minLocation = value;
        }
    }

    console.log(minLocation);
}

function part2() {}

export default function day4() {
    part1();
    part2();
}

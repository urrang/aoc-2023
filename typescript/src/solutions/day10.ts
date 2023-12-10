import { input } from 'src/input';

type Position = [number, number];

type Tile = {
    char: string;
    visited: boolean;
    isStartTile?: boolean;
};

let startPos: Position;
let startTile: Tile;

const grid: Tile[][] = input.split('\n').map((line, y) => {
    return line.split('').map((char, x) => {
        let tile: Tile = { char, visited: false };
        if (char === 'S') {
            startPos = [x, y];
            tile.isStartTile = true;
            startTile = tile;
        }

        return tile;
    })
});

const connectionMap = {
    '|': [
        { direction: 'UP', connectsTo: '|F7' },
        { direction: 'DOWN', connectsTo: '|LJ' }
    ],
    '-': [
        { direction: 'LEFT', connectsTo: 'LF-' },
        { direction: 'RIGHT', connectsTo: 'J7-' }
    ],
    'L': [
        { direction: 'UP', connectsTo: '|F7' },
        { direction: 'RIGHT', connectsTo: 'J7-' }
    ],
    'J': [
        { direction: 'UP', connectsTo: '|F7' },
        { direction: 'LEFT', connectsTo: 'LF-' }
    ],
    '7': [
        { direction: 'DOWN', connectsTo: '|LJ' },
        { direction: 'LEFT', connectsTo: 'LF-' }
    ],
    'F': [
        { direction: 'DOWN', connectsTo: '|LJ' },
        { direction: 'RIGHT', connectsTo: 'J7-' }
    ],
} as const;

function move([x, y], direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'): Position {
    if (direction === 'UP') return [x, y - 1];
    if (direction === 'DOWN') return [x, y + 1];
    if (direction === 'LEFT') return [x - 1, y];
    if (direction === 'RIGHT') return [x + 1, y];
}

function getChar(position: Position) {
    return Object.keys(connectionMap).find(char => {
        const connections = connectionMap[char];
        return connections.every(connection => {
            const [x, y] = move(position, connection.direction);
            const tile = grid[y][x];

            return connection.connectsTo.includes(tile.char);
        });
    });
}

startTile.char = getChar(startPos);

// State vars
let position = startPos;
let tile = startTile;
let steps = 0;
let polygon = [startPos];

// Walk path
do {
    for (const connection of connectionMap[tile.char]) {
        const [x, y] = move(position, connection.direction);
        const nextTile = grid[y][x];

        if (!nextTile.visited && connection.connectsTo.includes(nextTile.char)) {
            nextTile.visited = true;
            position = [x, y];
            tile = nextTile;
            steps++;
            polygon.push(position);
            break;
        }
    }
} while (!tile.isStartTile);


export function part1() {
    return steps / 2;
}

export function part2() {
    let count = 0;

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
            const tile = grid[y][x];
            if (!tile.visited && isInsidePolygon([x, y], polygon)) {
                count++;
            }
        }
    }

    return count;
}

// ray-casting algorithm based on
// https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
// https://www.npmjs.com/package/point-in-polygon
function isInsidePolygon(point, polygon) {
    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i][0], yi = polygon[i][1];
        var xj = polygon[j][0], yj = polygon[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}
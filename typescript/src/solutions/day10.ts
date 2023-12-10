import {input} from 'src/input';

const direction: { [name: string]: [number, number] } = {
    UP: [0, -1],
    DOWN: [0, 1],
    LEFT: [-1, 0],
    RIGHT: [1, 0],
}

const dirConnections = {
    UP: '|F7',
    DOWN: '|LJ',
    LEFT: '-LF',
    RIGHT: '-J7'
}

const dirMap = {
    '|': [
        { dir: direction.UP, con: dirConnections.UP },
        { dir: direction.DOWN, con: dirConnections.DOWN }
    ],
    '-': [
        { dir: direction.LEFT, con: dirConnections.LEFT },
        { dir: direction.RIGHT, con: dirConnections.RIGHT }
    ],
    'L': [
        { dir: direction.UP, con: dirConnections.UP },
        { dir: direction.RIGHT, con: dirConnections.RIGHT }
    ],
    'J': [
        { dir: direction.UP, con: dirConnections.UP },
        { dir: direction.LEFT, con: dirConnections.LEFT }
    ],
    '7': [
        { dir: direction.DOWN, con: dirConnections.DOWN },
        { dir: direction.LEFT, con: dirConnections.LEFT }
    ],
    'F': [
        { dir: direction.DOWN, con: dirConnections.DOWN },
        { dir: direction.RIGHT, con: dirConnections.RIGHT }
    ],
}

let grid: { char: string, visited: boolean }[][] = [];
let startPos = [];

for (const line of input.split('\n')) {
    grid.push(line.split('').map(char => ({ char, visited: false })));
}

grid.forEach((row, y) => {
    row.forEach((cell, x) => {
        if (cell.char === 'S') {
            startPos = [x, y];
        }
    });
})

function getNextConnection(char: string, pos: [number, number]) {
    const dirs = dirMap[char];

    const validConnections = dirs.filter(dir => {
        const x = pos[0] + dir.dir[0];
        const y = pos[1] + dir.dir[1];
        const next = grid[y][x];

        return next && !next.visited && dir.con.includes(next.char);
    });

    return validConnections[0];
}

let steps = 0;
let polygon = [startPos];


// TODO: get startchar programatically
const startChar = '-';

let position = [...startPos] as [number, number];
let char = startChar;

while(true) {
    const next = getNextConnection(char, position);
    steps++;

    if (!next) {
        // means we reached start again
        polygon.push(startPos);
        break;
    }

    position = [
        position[0] + next.dir[0],
        position[1] + next.dir[1]
    ];

    char = grid[position[1]][position[0]].char;
    grid[position[1]][position[0]].visited = true;
    polygon.push(position);
}

// 6860
export function part1() {
    return steps / 2;
}

// 343
export function part2() {
    let count = 0;

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
            const isEdge = polygon.some(p => p[0] === x && p[1] === y);

            if (!isEdge && isInsidePolygon([x, y], polygon)) {
                count++;
            }
        }
    }

    return count;
}


// credit: https://www.npmjs.com/package/point-in-polygon
function isInsidePolygon(point, polygon) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

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
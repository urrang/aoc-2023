import {input} from 'src/input';

type Point = [number, number];

const lines = input.split('\n');

function solve(expansion: number) {
    let grid: {
        index: number;
        cells: { char: string, index: number }[];
    }[] = [];

    let galaxyPositions: Point[] = [];

    let addY = 0;
    for (let y = 0; y < lines.length; y++) {
        const cells = lines[y].split('').map((char, x) => ({ char, index: x }));
        grid.push({ index: y + addY, cells });

        // Expand rows
        if (cells.every(c => c.char === '.')) {
            addY += expansion;
        }
    }

    // Expand columns
    let addX = 0;
    for (let x = 0; x < grid[0].cells.length; x++) {
        for (const row of grid) {
            row.cells[x].index = x + addX;
        }

        if (grid.every(row => row.cells[x].char === '.')) {
            addX += expansion;
        }
    }

    // Get galaxy positions
    for (const row of grid) {
        for (const cell of row.cells) {
            if (cell.char === '#') {
                galaxyPositions.push([cell.index, row.index]);
            }
        }
    }

    // Get sum of distances
    let sum = 0;

    for (let i = 0; i < galaxyPositions.length; i++) {
        for (let j = i + 1; j < galaxyPositions.length; j++) {
            sum += manhattanDistance(galaxyPositions[i], galaxyPositions[j]);
        }
    }

    return sum
}

function manhattanDistance(p1: Point, p2: Point): number {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

export function part1() {
    return solve(1);
}

export function part2() {
    return solve(999999);
}
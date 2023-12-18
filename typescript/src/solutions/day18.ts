import {input} from 'src/input';

type Direction = 'U' | 'D' | 'L' | 'R';
type LogItem = { direction: Direction, distance: number };

function solve(log: LogItem[]) {
	const position = { x: 0, y: 0 };
	const vertices: [number, number][] = [[0, 0]];
	let edgeCount = 0;

	for (const item of log) {
		edgeCount += item.distance;

		if (item.direction === 'L') {
			position.x -= item.distance;
		} else if (item.direction === 'R') {
			position.x += item.distance;
		} else if (item.direction === 'U') {
			position.y -= item.distance;
		} else if (item.direction === 'D') {
			position.y += item.distance;
		}

		vertices.push([position.x, position.y]);
	}

	return shoelace(vertices) + (edgeCount / 2) + 1;
} 

function shoelace(vertices: [number, number][]) {
	let sum = 0

	for (let i = 0; i < vertices.length - 1; i++) {
		sum += vertices[i][0] * vertices[i + 1][1]
		sum -= vertices[i][1] * vertices[i + 1][0]
	}

	return Math.abs(sum) / 2
}

export function part1() {
	const log: LogItem[] = input.split('\n').map(line => {
		let [direction, distance] = line.split(' ');
		return { direction: direction as Direction, distance: Number(distance) };
	});

	return solve(log);
}

export function part2() {
	const log: LogItem[] = input.split('\n').map(line => {
		const hex = line.match(/([0-9A-Fa-f]{6})/)[0];

		return {
			direction: ['R', 'D', 'L', 'U'][hex.at(-1)],
			distance: parseInt(hex.substring(0, 5), 16) 
		}
	});

	return solve(log);
}


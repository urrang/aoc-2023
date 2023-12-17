import {input} from 'src/input';
import PriorityQueue from 'ts-priority-queue';

const exampleInput = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

const exampleInput2 = `111111111111
999999999991
999999999991
999999999991
999999999991`

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Node = { x: number, y: number, heat: number, direction?: Direction, dirCount?: number };

const grid = input.split('\n').map((row) => {
	return row.split('').map((cell) => Number(cell))
});

const yMax = grid.length - 1;
const xMax = grid[0].length - 1;

const directions = [
	{ x: -1, y: 0, dir: 'LEFT' },
	{ x: 1, y: 0, dir: 'RIGHT' },
	{ x: 0, y: -1, dir: 'UP' },
	{ x: 0, y: 1, dir: 'DOWN' }
] as const;

function isReverse(prev: Direction, current: Direction) {
	if (prev === 'UP' && current === 'DOWN') return true;
	if (prev === 'DOWN' && current === 'UP') return true;
	if (prev === 'LEFT' && current === 'RIGHT') return true;
	if (prev === 'RIGHT' && current === 'LEFT') return true;
	return false;
}

function solve(dirMin: number, dirMax: number) {
	const queue = new PriorityQueue({ comparator: (a: Node, b: Node) => a.heat - b.heat });

	const visited = new Set<string>();

	queue.queue({ x: 0, y: 0, heat: 0, direction: undefined, dirCount: 0  })

	while (queue.length) {
		const node = queue.dequeue();

		if (node.x === xMax && node.y === yMax && node.dirCount >= dirMin) {
			return node.heat
		}

		const key = `${node.x},${node.y},${node.direction},${node.dirCount}`;

		if (visited.has(key.toString())) continue;

		visited.add(key.toString());

		for (const direction of directions) {
			if (isReverse(node.direction, direction.dir)) continue;

			const isSameDirection = direction.dir === node.direction;

			if (node.direction) {
				if (node.dirCount < dirMin && !isSameDirection) continue;
				if (node.dirCount + 1 > dirMax && isSameDirection) continue;
			}
			
			const y = node.y + direction.y;
			const x = node.x + direction.x;

			if (x >= 0 && x <= xMax && y >= 0 && y <= yMax) {
				const dirCount = isSameDirection ? node.dirCount + 1 : 1;
				queue.queue({ x, y, heat: node.heat + grid[y][x], direction: direction.dir, dirCount: dirCount });
			}
		}
	}
}

export function part1() {
	return solve(1, 3);
}

export function part2() {
	return solve(4, 10);
}

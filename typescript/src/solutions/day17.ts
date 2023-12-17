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

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Node = { x: number, y: number, cost: number, dir?: Direction, dirCount?: number };

const grid = exampleInput.split('\n').map((row) => {
	return row.split('').map((cell) => ({ weight: Number(cell), visited: false }))
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
	const queue = new PriorityQueue({ comparator: (a: Node, b: Node) => a.cost - b.cost });

	const visited = new Set<string>();

	let currentNode: Node = { x: 0, y: 0, cost: 0 };
	
	while (currentNode) {
		if (currentNode.x === xMax && currentNode.y === yMax && currentNode.dirCount >= dirMin) break;	

		const key = `${currentNode.x},${currentNode.y},${currentNode.dir},${currentNode.dirCount}`;
		if (visited.has(key)) {
			currentNode = queue.dequeue();
			continue;
		}

		visited.add(key);

		for (const direction of directions) {
			if (isReverse(currentNode.dir, direction.dir)) continue;

			const isSameDirection = direction.dir === currentNode.dir;
			const dirCount = isSameDirection ? currentNode.dirCount + 1 : 1;
			
			if (currentNode.dir) {
				if (dirCount < dirMin && !isSameDirection && !currentNode.dir) continue;
				if (dirCount > dirMax && isSameDirection) continue;
			}
			
			const y = currentNode.y + direction.y;
			const x = currentNode.x + direction.x;

			if (x >= 0 && x <= xMax && y >= 0 && y <= yMax) {
				queue.queue({ x, y, cost: currentNode.cost + grid[y][x].weight, dirCount, dir: direction.dir });
			}
		}

		currentNode = queue.dequeue();
	}

	return currentNode.cost;

}

export function part1() {
	return solve(1, 3);
}

export function part2() {
	return solve(4, 10);
}

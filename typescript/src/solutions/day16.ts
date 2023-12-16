import {input} from 'src/input';

const exampleInput = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

type Direction = 'UP' | 'DOWN' | 'RIGHT' | 'LEFT';
type Beam = { x: number, y: number, dir: Direction };

const grid: string[][] = input.split('\n').map(row => row.split(''));

const xMax = grid[0].length - 1;
const yMax = grid.length - 1;

function moveBeam(beamQueue: Beam[], beam: Beam) {
	if (beam.dir === 'UP') beam.y--;
	if (beam.dir === 'DOWN') beam.y++;
	if (beam.dir === 'LEFT') beam.x--;
	if (beam.dir === 'RIGHT') beam.x++;


	if (beam.x < 0 || beam.x > xMax) return;
	if (beam.y < 0 || beam.y > yMax) return;

	beamQueue.push(beam);
}

function solve(startBeam: Beam) {
	const energized = new Set<string>();
	const knownPath = new Set<string>();

	const beamQueue: Beam[] = [startBeam];

	while (beamQueue.length) {
		const beam = beamQueue.shift();
		const char = grid[beam.y][beam.x];

		energized.add(beam.y + ',' + beam.x);

		const pathKey = `${beam.x},${beam.y},${beam.dir}`;

		if (knownPath.has(pathKey)) {
			continue;
		} else {
			knownPath.add(pathKey);
		}

		if (char === '.') {
			moveBeam(beamQueue, beam);
		} else if (char === '/') {
			if (beam.dir === 'UP' || beam.dir === 'DOWN') {
				beam.dir = beam.dir === 'UP' ? 'RIGHT' : 'LEFT';
				moveBeam(beamQueue, beam);
			} else {
				beam.dir = beam.dir === 'LEFT' ? 'DOWN' : 'UP';
				moveBeam(beamQueue, beam);
			}
		} else if (char === '\\') {
			if (beam.dir === 'UP' || beam.dir === 'DOWN') {
				beam.dir = beam.dir === 'UP' ? 'LEFT' : 'RIGHT';
				moveBeam(beamQueue, beam);
			} else {
				beam.dir = beam.dir === 'LEFT' ? 'UP' : 'DOWN';
				moveBeam(beamQueue, beam);
			}
		} else if (char === '-') {
			if (beam.dir === 'LEFT' || beam.dir === 'RIGHT') {
				moveBeam(beamQueue, beam);
			} else {
				beam.dir = 'LEFT';
				const beamSplit = { x: beam.x, y: beam.y, dir: 'RIGHT' } as Beam;
				moveBeam(beamQueue, beam);
				moveBeam(beamQueue, beamSplit);
			}
		} else if (char === '|') {
			if (beam.dir === 'UP' || beam.dir === 'DOWN') {
				moveBeam(beamQueue, beam);
			} else {
				beam.dir = 'UP';
				const beamSplit = { x: beam.x, y: beam.y, dir: 'DOWN' } as Beam;

				moveBeam(beamQueue, beam);
				moveBeam(beamQueue, beamSplit);
			}
		}
	}

	return energized.size
}

export function part1() {
	return solve({ x: 0, y: 0, dir: 'RIGHT' });
}

export function part2() {
	let max = 0;

	for (let y = 0; y <= yMax; y++) {
		max = Math.max(max, solve({ x: 0, y, dir: 'RIGHT' }));
		max = Math.max(max, solve({ x: xMax, y, dir: 'LEFT' }));
	}

	for (let x = 0; x <= xMax; x++) {
		max = Math.max(max, solve({ x, y: 0, dir: 'DOWN' }));
		max = Math.max(max, solve({ x, y: yMax, dir: 'UP' }));
	}

	return max;
}

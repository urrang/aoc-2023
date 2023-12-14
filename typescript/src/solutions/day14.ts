import {input} from 'src/input';

let rows: string[][];

function parseRows() {
	rows = input.split('\n').map(row => row.split(''));
}

function getLoad() {
	let load = 0;

	for (let i = 0; i < rows.length; i++) {
		for (let j = 0; j < rows[i].length; j++) {
			if (rows[i][j] === 'O') {
				load += rows.length - i;
			}
		}
	}

	return load;
}

export function part1() {
	parseRows();
	tiltNorth();
	return getLoad();
}

export function part2() {
	parseRows();

	const cache = new Map<string, number>();

	let cycleLength = 0;
	let cycleCount = 0;

	for (let i = 0; i < 1000000000; i++) {
		tiltNorth();
		tiltWest();
		tiltSouth();
		tiltEast();

		cycleCount++;

		const key = rows.toString();
		if (cache.has(key)) {
			cycleLength = cycleCount - cache.get(key);

			const rest = (1000000000 - cycleCount) % cycleLength;
			i = 1000000000 - rest - 1;
		}

		cache.set(key, cycleCount);
	}

	return getLoad();
}

function tiltNorth() {
	for (let i = 1; i < rows.length; i++) {
		for (let j = 0; j < rows[i].length; j++) {
			if (rows[i][j] === 'O') {
				for (let k = i; k > 0; k--) {
					if (rows[k - 1][j] === '.') {
						rows[k - 1][j] = 'O';
						rows[k][j] = '.';
					} else {
						break;
					}
				}
			}
		}
	}
}

function tiltSouth() {
	for (let i = rows.length - 2; i >= 0; i--) {
		for (let j = 0; j < rows[i].length; j++) {
			if (rows[i][j] === 'O') {
				for (let k = i; k < rows.length - 1; k++) {
					if (rows[k + 1][j] === '.') {
						rows[k + 1][j] = 'O';
						rows[k][j] = '.';
					} else {
						break;
					}
				}
			}
		}
	}
}

function tiltWest() {
	for (let i = 0; i < rows.length; i++) {
		for (let j = 1; j < rows[i].length; j++) {
			if (rows[i][j] === 'O') {
				for (let k = j; k > 0; k--) {
					if (rows[i][k - 1] === '.') {
						rows[i][k - 1] = 'O';
						rows[i][k] = '.';
					} else {
						break;
					}
				}
			}
		}
	}
}

function tiltEast() {
	for (let i = 0; i < rows.length; i++) {
		for (let j = rows[i].length - 2; j >= 0; j--) {
			if (rows[i][j] === 'O') {
				for (let k = j; k < rows[i].length - 1; k++) {
					if (rows[i][k + 1] === '.') {
						rows[i][k + 1] = 'O';
						rows[i][k] = '.';
					} else {
						break;
					}
				}
			}
		}
	}
}
import {input} from 'src/input';

type Box = { label: string; focalLength: string }[];

const steps = input.split(',');

function hash(string: string) {
	let value = 0;
	
	for (let i = 0; i < string.length; i++) {
		value = (value + string.charCodeAt(i)) * 17 % 256;
	}

	return value;
}

export function part1() {
	return steps.reduce((sum, step) => sum + hash(step), 0);
}

export function part2() {
	const boxes: Box[] = [];

	for (let i = 0; i < 256; i++) {
		boxes.push([]);
	}

	for (const step of steps) {
		const [label, focalLength] = step.split(/=|-/);
		
		const boxIndex = hash(label);
		const box = boxes[boxIndex];

		const lensIndex = box.findIndex(lens => lens.label === label);
		
		if (step.includes('=')) {
			if (lensIndex >= 0) {
				box[lensIndex].focalLength = focalLength;
			} else {
				box.push({ label, focalLength });
			}
		} else if (lensIndex >= 0) {
			box[lensIndex] = undefined;
			boxes[boxIndex] = box.filter(x => !!x);
		}
	}

	let focusingPower = 0;

	for (let i = 0; i < boxes.length; i++) {
		for (let j = 0; j < boxes[i].length; j++) {
			if (boxes[i][j]) {
				focusingPower += (i + 1) * (j + 1) * Number(boxes[i][j].focalLength);
			}
		}
	}

	return focusingPower;
}

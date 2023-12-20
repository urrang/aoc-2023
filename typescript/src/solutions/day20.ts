import {input} from 'src/input';

const exampleInput = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

const exampleInput2 = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

type ConjunctionState = { [inputModule: string]: 'low' | 'high' };

type Module = { name: string, type: '%' , state?: boolean, outputs: string[] } 
	| { name: string, type: '&', state?: ConjunctionState, outputs: string[] }; 

type Pulse = { type: 'low' | 'high', from: string, to: string };

let broadCastOutputs: string[];
let moduleMap: { [name: string]: Module } = {};

function parseData(input: string) {
	const modules: Module[] = [];
	moduleMap = {};

	for (const line of input.split('\n')) {
		const [moduleStr, outputStr] = line.split(' -> ');

		const outputs = outputStr.split(', ');

		if (moduleStr.startsWith('broadcaster')) {
			broadCastOutputs = outputs;
			continue;
		}

		const type = moduleStr.startsWith('%') ? '%' : '&';
		const name = moduleStr.replace(type, '');
		modules.push({ name, type, outputs });
	}

	modules.forEach(module => {
		if (module.type === '&') {
			module.state = {};
			const inputs = modules.filter(m => m.outputs.includes(module.name));
			inputs.forEach(input => module.state[input.name] = 'low');
		} else {
			module.state = false;
		}

		moduleMap[module.name] = module;
	});
}

function pushButton(queue: Pulse[]) {
	broadCastOutputs.forEach(output => {
		queue.push({ type: 'low', from: 'broadcaster', to: output });
	});
}

export function part1() {
	parseData(input);
	const queue: Pulse[] = [];
	
	let lowPulseCount = 0;
	let highPulseCount = 0;

	for (let i = 0; i < 1000; i++) {
		pushButton(queue);
		lowPulseCount++;

		while (queue.length) {
			const pulse = queue.shift();
			const currentModule = moduleMap[pulse.to] as Module;

			if (pulse.type === 'low') lowPulseCount++;
			if (pulse.type === 'high') highPulseCount++;

			if (!currentModule) continue;

			let outputPulse: 'low' | 'high';
			
			if (currentModule.type === '%' && pulse.type === 'low') {
				currentModule.state = !currentModule.state;
				outputPulse = currentModule.state ? 'high' : 'low';
			} else if (currentModule.type === '&') {
				currentModule.state[pulse.from] = pulse.type;
				const allHigh = Object.values(currentModule.state).every(p => p === 'high');
				outputPulse = allHigh ? 'low' : 'high';
			}
			
			if (outputPulse) {
				for (const output of currentModule.outputs) {
				queue.push({
						type: outputPulse,
						from: currentModule.name,
						to: output
					});
				}
			}
		}
	}

	return lowPulseCount * highPulseCount;
}

export function part2() {
	parseData(input);
	
	const rxInput = moduleMap.vr;
	const relevantModules = Object.keys(rxInput.state);

	const counts = [];

	for (const moduleName of relevantModules) {
		counts.push(countButtonPresses(moduleName));

		// Reset the data for between each test
		parseData(input);
	}

	return counts.reduce((acc, count) => lcm(acc, count), 1);
}

function lcm(a: number, b: number) {
    const gcd = (a: number, b: number) => b === 0 ? a : gcd(b, a % b);
    return (a * b) / gcd(a, b);
}

function countButtonPresses(watchModule: string) {
	const queue: Pulse[] = [];
	let buttonPresses = 0;
	let foundCount = false;

	while (!foundCount) {
		pushButton(queue);
		buttonPresses++;

		while (queue.length) {
			const pulse = queue.shift();
			const currentModule = moduleMap[pulse.to] as Module;

			if (!currentModule) continue;

			let outputPulse: 'high' | 'low';
			
			if (currentModule.type === '%' && pulse.type === 'low') {
				currentModule.state = !currentModule.state;
				outputPulse = currentModule.state ? 'high' : 'low';
			} else if (currentModule.type === '&') {
				currentModule.state[pulse.from] = pulse.type;
				const allHigh = Object.values(currentModule.state).every(p => p === 'high');
				outputPulse = allHigh ? 'low' : 'high';
			}

			if (outputPulse) {
				for (const output of currentModule.outputs) {
					queue.push({
						type: outputPulse,
						from: currentModule.name,
						to: output
					});
				}
			}

			if (currentModule.name === watchModule && outputPulse === 'high') {
				foundCount = true;
			}
		}
	}

	return buttonPresses;
}

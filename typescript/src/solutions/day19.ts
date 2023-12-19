import {input} from 'src/input';

type Rule = { 
	condition?: { field: string, operator: '>' | '<', value: number },
	result: string | 'A' | 'R';
};

type Workflows = { [name: string]: Rule[] };
type Part = { x: number, m: number, a: number, s: number };

const exampleInput = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;

const [wfStr, partsStr] = input.split('\n\n');

const workflows: Workflows = wfStr.split('\n').reduce((wf, line) => {
	let [name, rest] = line.split('{');

	const rules: Rule[] = rest.replace('}', '').split(',').map(rule => {
		if (rule.includes(':')) {
			const operator = rule.includes('>') ? '>' : '<';
			const [condition, result] = rule.split(':');
			const [field, value] = condition.split(operator);

			return {
				result,
				condition: {
					field,
					operator,
					value: Number(value)
				}
			}
		} else {
			return { result: rule };
		}
	});

	wf[name] = rules;
	return wf;
	// return { name, rules };	
}, {} as Workflows);

const parts = partsStr.split('\n').map(line => {
	const ratings = line.replace(/{|}/g, '').split(',');
	return ratings.reduce((part, rating) => {
		const [name, value] = rating.split('=');
		part[name] = Number(value);
		return part;
	}, {} as Part);
});

export function part1() {
	const accepted: Part[] = [];

	for (const part of parts) {
		let workflow = workflows.in;
		
		while (workflow) {
			let result: string;
			for (const rule of workflow) {

				if (rule.condition) {
					const partValue = part[rule.condition.field];
					// just use eval?
					const conditionMet = rule.condition.operator === '>'
						? partValue > rule.condition.value
						: partValue < rule.condition.value;

					if (conditionMet) {
						result = rule.result;
						break;
					}
				} else {
					result = rule.result;
					break;
				}
			}

			if (result === 'R') {
				workflow = undefined;
			} else if (result === 'A') {
				workflow = undefined;
				accepted.push(part);
			} else {
				workflow = workflows[result];
			}
		}
	}

	return accepted.reduce((sum, part) => {
		return sum + part.x + part.m + part.a + part.s;
	}, 0)
}

export function part2() {

}

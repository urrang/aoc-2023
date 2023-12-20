import {input} from 'src/input';

type RuleCondition = { field: string, operator: '>' | '<', value: number };
type Rule = { 
	condition?: RuleCondition;
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

type ConditionSet = { conditions: RuleCondition[], valid: boolean };

const conditionSets: ConditionSet[] = [];

function checkToEnd(conditionSet: ConditionSet, workflow: Rule[]) {
	workflow.forEach((rule, index) => {
		const conditions = [...conditionSet.conditions];

		// Add the reverse of any conditions prior, since they didn't match
		for (let i = 0; i < index; i++) {
			if (workflow[i].condition) {
				const reversed = { ...workflow[i].condition };
				if (reversed.operator == '>') {
					reversed.operator = '<';
					reversed.value = reversed.value + 1;
				} else {
					reversed.operator = '>';
					reversed.value = reversed.value - 1;
				}

				conditions.push(reversed);
			}
		}

		if (rule.condition) {
			conditions.push(rule.condition);
		}

		if (rule.result === 'A' || rule.result === 'R') {
			conditionSets.push({ conditions, valid: rule.result === 'A' });
		} else {
			checkToEnd({ conditions, valid: true }, workflows[rule.result]);
		}
	});
}

export function part2() {
	checkToEnd({ conditions: [], valid: true }, workflows.in);
	
	let sum = 0;

	for (const conditionSet of conditionSets.filter(c => c.valid)) {
		const minMax = {
			x: { min: 1, max: 4000 },
			m: { min: 1, max: 4000 },
			a: { min: 1, max: 4000 },
			s: { min: 1, max: 4000 },
		};

		for (const condition of conditionSet.conditions) {
			const range = minMax[condition.field];
			if (condition.operator === '>') {
				range.min = Math.max(range.min, condition.value + 1);
			} else {
				range.max = Math.min(range.max, condition.value - 1);
			}
		}

		sum += Object.values(minMax).reduce((count, range) => {
			return count * (range.max - range.min + 1);
		}, 1)
	}

	return sum;
}

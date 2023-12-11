import {input} from 'src/input';

type Node = { node: string, left: string, right: string };

let [sequence, lines] = input.split('\n\n');

const nodes: Node[] = lines.split('\n').map(line => {
    const [node, left, right] = line.match(/[0-9A-Z]+/g);
    return { node, left, right };
});

function getStepsInPath(node: Node, sequence: string, isPart2 = false) {
    let steps = 0;

    while (true) {
        for (let direction of sequence) {
            const next = direction === 'L' ? node.left : node.right;
            node = nodes.find(node => node.node === next);
            steps++;

            const done = isPart2 ? node.node.endsWith('Z') : node.node === 'ZZZ';
            if (done) return steps;
        }
    }
}

export function part1() {
    let currentNode = nodes.find(node => node.node === 'AAA');
    return getStepsInPath(currentNode, sequence);
}

export function part2() {
    const startingNodes = nodes.filter(node => node.node.endsWith('A'));
    const stepCounts = startingNodes.map(node => getStepsInPath(node, sequence, true));
    return stepCounts.reduce((acc, steps) => lcm(acc, steps), stepCounts.shift());
}

function lcm(a: number, b: number) {
    const gcd = (a: number, b: number) => b === 0 ? a : gcd(b, a % b);
    return (a * b) / gcd(a, b);
}
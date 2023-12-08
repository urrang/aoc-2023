import {input} from 'src/input';

let [sequence, lines] = input.split('\n\n');

type Node = { node: string, left: string, right: string };

const nodes: Node[] = lines.split('\n').map(line => {
    const [node, left, right] = line.match(/[0-9A-Z]+/g);
    return { node, left, right };
});

function getStepsInPath(node: Node, sequence: string, isPart2 = false) {
    let steps = 0;
    const isDone = (node: Node) => isPart2 ? node.node.endsWith('Z') : node.node === 'ZZZ';

    while (true) {
        for (let direction of sequence) {
            const next = direction === 'L' ? node.left : node.right;
            node = nodes.find(node => node.node === next);
            steps++;

            if (isDone(node)) {
                return steps;
            }
        }
    }
}

export function part1() {
    let currentNode = nodes.find(node => node.node === 'AAA');
    return getStepsInPath(currentNode, sequence);
}

export function part2() {
    const startingNodes = nodes.filter(node => node.node.endsWith('A'));
    const stepsPerPath = startingNodes.map(node => getStepsInPath(node, sequence, true));
    return lcmInArray(stepsPerPath);
}

function lcmInArray(arr: number[]) {
    function lcm(a: number, b: number) {
        const gcd = (a: number, b: number) => b === 0 ? a : gcd(b, a % b);
        return (a * b) / gcd(a, b);
    }

    const first = arr.shift();
    return arr.reduce((acc, steps) => lcm(acc, steps), first);
}

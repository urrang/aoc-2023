import { setInput } from './input';

let day = process.argv[2];

if (day) {
    if (day.length === 1) day = '0' + day;
    startDay();
} else {
    console.log('Please specify a day to run.');
    process.exit(0);
}

async function startDay() {
    await checkCodeFile();

    const input = await getInput();
    setInput(input);

    import('./solutions/day' + day + '.ts').then(module => {
        run(module.part1, 'Part 1');
        console.log();
        run(module.part2, 'Part 2');
    });
}

function run(fn, label) {
    console.time(label);
    const res = fn && fn();
    console.timeEnd(label);
    console.log(res);
}

async function checkCodeFile() {
    const codePath = './src/solutions/day' + day + '.ts';
    const exists = await Bun.file(codePath).exists();
    if (!exists) {
        const template = Bun.file('./src/template.ts');
        await Bun.write(codePath, template);
    }
}

async function getInput() {
    const inputPath = './src/inputs/day' + day + '.txt';
    let file = Bun.file(inputPath);

    const exists = await file.exists();

    if (exists) {
        return file.text();
    }

    const res = await fetch('https://adventofcode.com/2023/day/' + day + '/input', {
        headers: {
            cookie: `session=${Bun.env.AOC_SESSION_KEY}`,
        }
    });

    if (res.ok) {
        const text = await res.text();
        await Bun.write(inputPath, text.replace(/\n$/, ''));
        return text;
    } else {
        console.log('Failed to fetch input', await res.text());
        process.exit(0);
    }
}

import { readFile } from '../utils';

enum HandScore {
    Nothing = 0,
    Pair = 1,
    TwoPairs = 2,
    ThreeOfAKind = 3,
    FullHouse = 4,
    FourOfAKind = 5,
    FiveOfAKind = 6
}

const lines = readFile('src/inputs/day7.txt').split('\n');
const charToValue = { 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

function parseData(includeJokers = false) {
    return lines.map(line => {
        const [hand, bid] = line.split(' ');
        return {
            bid: parseInt(bid),
            cards: hand
                .split('')
                .map(char => charToValue[char] || parseInt(char))
                .map(x => includeJokers && x === 11 ? 1 : x)
        };
    });
}

function score(cards: number[], ignoreJoker = false) {
    const groupedCards = new Map<number, number>();

    for (const card of cards) {
        if (!ignoreJoker || card !== 1) {
            groupedCards.set(card, (groupedCards.get(card) || 0) + 1);
        }
    }

    const counts = [...groupedCards.values()];

    if (counts.includes(5)) return HandScore.FiveOfAKind;
    if (counts.includes(4)) return HandScore.FourOfAKind;

    if (counts.includes(3) && counts.includes(2)) return HandScore.FullHouse;
    if (counts.includes(3)) return HandScore.ThreeOfAKind;

    const pairs = counts.filter(x => x === 2);
    if (pairs.length === 2) return HandScore.TwoPairs;
    if (pairs.length === 1) return HandScore.Pair;

    return 0;
}

function checkJokers(cards: number[], score) {
    if (score === HandScore.FiveOfAKind) return score;

    const jokerCount = cards.filter(x => x === 1).length;

    if (jokerCount === 5) return HandScore.FiveOfAKind;
    if (jokerCount === 4) return HandScore.FiveOfAKind;
    if (jokerCount === 3) {
        return score === HandScore.Pair ? HandScore.FiveOfAKind : HandScore.FourOfAKind;
    }

    if (jokerCount === 2) {
        if (score == HandScore.ThreeOfAKind) return HandScore.FiveOfAKind;
        if (score == HandScore.Pair) return HandScore.FourOfAKind;
        return HandScore.ThreeOfAKind;
    }

    if (jokerCount === 1) {
        if (score === HandScore.FourOfAKind) return HandScore.FiveOfAKind; // +1
        if (score === HandScore.FullHouse) return HandScore.FourOfAKind; // +1
        if (score === HandScore.ThreeOfAKind) return HandScore.FourOfAKind; // +2
        if (score === HandScore.TwoPairs) return HandScore.FullHouse; // +2
        if (score === HandScore.Pair) return HandScore.ThreeOfAKind; // +2
        if (score === HandScore.Nothing) return HandScore.Pair; // +1
    }

    return score;
}

function compare(cardsA: number[], cardsB: number[], checkJoker = false) {
    let scoreA = score(cardsA, checkJoker);
    let scoreB = score(cardsB, checkJoker);

    if (checkJoker) {
        scoreA = checkJokers(cardsA, scoreA);
        scoreB = checkJokers(cardsB, scoreB);
    }

    if (scoreA !== scoreB) {
        return scoreA - scoreB;
    }

    for (let i = 0; i < cardsA.length; i++) {
        if (cardsA[i] !== cardsB[i]) {
            return cardsA[i] - cardsB[i];
        }
    }
}

function solve(useJokers = false) {
    const handsSorted = parseData(useJokers).sort((a, b) => compare(a.cards, b.cards, useJokers));
    return handsSorted.reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0);
}

export default function day7() {
    console.log(solve());
    console.log(solve(true));
}
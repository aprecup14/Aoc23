import { solveReal1, solveTest1 } from "../read_write/read";

type CardTypes =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

type HandTypes =
  | "FiveKind"
  | "FourKind"
  | "FullHouse"
  | "ThreeKind"
  | "TwoPair"
  | "OnePair"
  | "HighCard";

interface Hand {
  cards: string;
  bet: number;
}

const cardsPriority: Map<CardTypes, number> = new Map([
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["9", 9],
  ["T", 10],
  ["J", 11],
  ["Q", 12],
  ["K", 13],
  ["A", 14],
]);

function getEmptyHandsMap(): Map<HandTypes, Hand[]> {
  return new Map([
    ["FiveKind", []],
    ["FourKind", []],
    ["FullHouse", []],
    ["HighCard", []],
    ["OnePair", []],
    ["ThreeKind", []],
    ["TwoPair", []],
  ]);
}
const solve1 = (input: string) => {
  const lines = input
    .split("\r\n")
    .map((l) => l.split(" ").map((el) => el.trim()));

  const handsMap = lines.reduce((handsMap, [hand, bet]) => {
    const handType = getHandType(hand);
    handsMap.set(handType, [
      ...handsMap.get(handType)!,
      { cards: hand, bet: +bet },
    ]);
    return handsMap;
  }, getEmptyHandsMap());

  const orderedHandsMap = [...handsMap].reduce(
    (orderedMap, [handType, hands]) => {
      hands.sort(orderSameTypeHands);
      orderedMap.set(handType, hands);
      return orderedMap;
    },
    getEmptyHandsMap()
  );

  const orderedHands = handPriorityOrder.flatMap((handType) =>
    orderedHandsMap.get(handType)
  ) as Hand[];
  return orderedHands.reduce((res, { cards, bet }, idx) => {
    return res + bet * (orderedHands.length - idx);
  }, 0);
};

function orderSameTypeHands(hand1: Hand, hand2: Hand): number {
  const firstDifferentCardIndex = [...hand1.cards].findIndex(
    (card, idx) => card !== hand2.cards[idx]
  );
  if (firstDifferentCardIndex === -1) {
    return 0;
  }

  return (
    cardsPriority.get(hand2.cards[firstDifferentCardIndex] as CardTypes)! -
    cardsPriority.get(hand1.cards[firstDifferentCardIndex] as CardTypes)!
  );
}

const handPriorityOrder = [
  "FiveKind",
  "FourKind",
  "FullHouse",
  "ThreeKind",
  "TwoPair",
  "OnePair",
  "HighCard",
] as const;

const handTypeIdentifiers = [
  FiveOfAKindIdentifier(),
  FourOfAKindIdentifier(),
  FullHouseIdentifier(),
  ThreeOfAKindIdentifier(),
  TwoPairIdentifier(),
  OnePairIdentifier(),
] as const;

function getHandType(hand: string): HandTypes {
  const emptyCardsOccurencesMap: Map<CardTypes, number> = new Map([
    ["2", 0],
    ["3", 0],
    ["4", 0],
    ["5", 0],
    ["6", 0],
    ["7", 0],
    ["8", 0],
    ["9", 0],
    ["T", 0],
    ["J", 0],
    ["Q", 0],
    ["K", 0],
    ["A", 0],
  ]);
  const occ = [...hand].reduce((occurences, card) => {
    occurences.set(card as CardTypes, occurences.get(card as CardTypes)! + 1);
    return occurences;
  }, emptyCardsOccurencesMap);

  return (
    handTypeIdentifiers.find((h) => h.identify(occ))?.identifier ??
    HighCardIdentifier().identifier
  );
}

interface HandTypeIdentifier {
  identify(occurences: Map<CardTypes, number>): boolean;
  identifier: HandTypes;
}

function FiveOfAKindIdentifier(): HandTypeIdentifier {
  return {
    identify(occurences) {
      return [...occurences].some(([cardType, occ]) => occ === 5);
    },
    identifier: "FiveKind",
  };
}

function FourOfAKindIdentifier(): HandTypeIdentifier {
  return {
    identify(occurences) {
      return [...occurences].some(([cardType, occ]) => occ === 4);
    },
    identifier: "FourKind",
  };
}

function FullHouseIdentifier(): HandTypeIdentifier {
  return {
    identify(occurences) {
      return (
        [...occurences].some(([cardType, occ]) => occ === 3) &&
        [...occurences].some(([cardType, occ]) => occ === 2)
      );
    },
    identifier: "FullHouse",
  };
}

function ThreeOfAKindIdentifier(): HandTypeIdentifier {
  return {
    identify(occurences) {
      return [...occurences].some(([cardType, occ]) => occ === 3);
    },
    identifier: "ThreeKind",
  };
}

function TwoPairIdentifier(): HandTypeIdentifier {
  return {
    identify(occurences) {
      const firstPair = [...occurences].find(([cardType, occ]) => occ === 2);
      return (
        !!firstPair &&
        [...occurences].some(
          ([cardType, occ]) => occ === 2 && cardType !== firstPair[0]
        )
      );
    },
    identifier: "TwoPair",
  };
}

function OnePairIdentifier(): HandTypeIdentifier {
  return {
    identify(occurences) {
      return [...occurences].some(([cardType, occ]) => occ === 2);
    },
    identifier: "OnePair",
  };
}

function HighCardIdentifier(): HandTypeIdentifier {
  return {
    identify(occurences) {
      return true;
    },
    identifier: "HighCard",
  };
}

solveTest1(__dirname, solve1);
solveReal1(__dirname, solve1);

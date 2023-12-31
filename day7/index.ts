import {
  solveReal1,
  solveReal2,
  solveTest1,
  solveTest2,
} from "../read_write/read";

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

const handPriorityOrder = [
  "FiveKind",
  "FourKind",
  "FullHouse",
  "ThreeKind",
  "TwoPair",
  "OnePair",
  "HighCard",
] as const;

interface Hand {
  cards: string;
  bet: number;
}

const cardsPriorityPart1: Map<CardTypes, number> = new Map([
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

const cardsPriorityPart2: Map<CardTypes, number> = new Map([
  ["J", 1],
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["9", 9],
  ["T", 10],
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
    const handType = getHandType()(hand);
    handsMap.set(handType, [
      ...handsMap.get(handType)!,
      { cards: hand, bet: +bet },
    ]);
    return handsMap;
  }, getEmptyHandsMap());

  const orderedHandsMap = [...handsMap].reduce(
    (orderedMap, [handType, hands]) => {
      hands.sort(orderSameTypeHands(cardsPriorityPart1));
      orderedMap.set(handType, hands);
      return orderedMap;
    },
    getEmptyHandsMap()
  );

  const orderedHands = handPriorityOrder.flatMap((handType) =>
    orderedHandsMap.get(handType)
  ) as Hand[];

  return orderedHands.reduce((res, { bet }, idx) => {
    return res + bet * (orderedHands.length - idx);
  }, 0);
};

const solve2 = (input: string) => {
  const lines = input
    .split("\r\n")
    .map((l) => l.split(" ").map((el) => el.trim()));

  const handsMap = lines.reduce((handsMap, [hand, bet]) => {
    const handType = getHandType("J")(hand);
    handsMap.set(handType, [
      ...handsMap.get(handType)!,
      { cards: hand, bet: +bet },
    ]);
    return handsMap;
  }, getEmptyHandsMap());

  const orderedHandsMap = [...handsMap].reduce(
    (orderedMap, [handType, hands]) => {
      hands.sort(orderSameTypeHands(cardsPriorityPart2));
      orderedMap.set(handType, hands);
      return orderedMap;
    },
    getEmptyHandsMap()
  );

  const orderedHands = handPriorityOrder.flatMap((handType) =>
    orderedHandsMap.get(handType)
  ) as Hand[];

  return orderedHands.reduce((res, { bet }, idx) => {
    return res + bet * (orderedHands.length - idx);
  }, 0);
};

function orderSameTypeHands(cardsPriority: Map<CardTypes, number>) {
  return function (hand1: Hand, hand2: Hand): number {
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
  };
}

function getHandType(wildcard?: CardTypes) {
  const orderedHandTypeIdentifiers = [
    FiveOfAKindIdentifier(wildcard),
    FourOfAKindIdentifier(wildcard),
    FullHouseIdentifier(wildcard),
    ThreeOfAKindIdentifier(wildcard),
    TwoPairIdentifier(wildcard),
    OnePairIdentifier(wildcard),
  ] as const;
  return function (hand: string): HandTypes {
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
      orderedHandTypeIdentifiers.find((h) => h.isHandPartOfType(occ))
        ?.identifier ?? HighCardIdentifier().identifier
    );
  };
}
interface HandTypeIdentifier {
  isHandPartOfType(occurences: Map<CardTypes, number>): boolean;
  identifier: HandTypes;
}

function FiveOfAKindIdentifier(wildcard?: CardTypes): HandTypeIdentifier {
  return {
    isHandPartOfType(occurences) {
      if (!wildcard) {
        return [...occurences].some(([cardType, occ]) => occ === 5);
      }
      const wildcardOccurences = occurences.get(wildcard)!;
      return [...occurences].some(
        ([cardType, occ]) => occ === 5 - wildcardOccurences
      );
    },
    identifier: "FiveKind",
  };
}

function FourOfAKindIdentifier(wildcard?: CardTypes): HandTypeIdentifier {
  return {
    isHandPartOfType(occurences) {
      if (!wildcard) {
        return [...occurences].some(([cardType, occ]) => occ === 4);
      }
      const wildcardOccurences = occurences.get(wildcard)!;
      return [...occurences].some(
        ([cardType, occ]) =>
          occ === 4 - wildcardOccurences && cardType !== wildcard
      );
    },
    identifier: "FourKind",
  };
}

function FullHouseIdentifier(wildcard?: CardTypes): HandTypeIdentifier {
  return {
    isHandPartOfType(occurences) {
      const basicCheck =
        [...occurences].some(([cardType, occ]) => occ === 3) &&
        [...occurences].some(([cardType, occ]) => occ === 2);

      if (!wildcard) {
        return basicCheck;
      }
      const wildcardOccurences = occurences.get(wildcard)!;
      if (wildcardOccurences === 0) {
        return basicCheck;
      }
      if (wildcardOccurences === 1) {
        return TwoPairIdentifier().isHandPartOfType(occurences);
      }
      return false;
    },
    identifier: "FullHouse",
  };
}

function ThreeOfAKindIdentifier(wildcard?: CardTypes): HandTypeIdentifier {
  return {
    isHandPartOfType(occurences) {
      if (!wildcard) {
        return [...occurences].some(([cardType, occ]) => occ === 3);
      }
      const wildcardOccurences = occurences.get(wildcard)!;
      return [...occurences].some(
        ([cardType, occ]) => occ === 3 - wildcardOccurences
      );
    },
    identifier: "ThreeKind",
  };
}

function TwoPairIdentifier(wildcard?: CardTypes): HandTypeIdentifier {
  return {
    isHandPartOfType(occurences) {
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

function OnePairIdentifier(wildcard?: CardTypes): HandTypeIdentifier {
  return {
    isHandPartOfType(occurences) {
      if (!wildcard) {
        return [...occurences].some(([cardType, occ]) => occ === 2);
      }
      const wildcardOccurences = occurences.get(wildcard)!;
      return [...occurences].some(
        ([cardType, occ]) =>
          occ === 2 - wildcardOccurences && cardType !== wildcard
      );
    },
    identifier: "OnePair",
  };
}

function HighCardIdentifier(wildcard?: CardTypes): HandTypeIdentifier {
  return {
    isHandPartOfType(occurences) {
      return true;
    },
    identifier: "HighCard",
  };
}

solveTest1(__dirname, solve1);
solveReal1(__dirname, solve1);
solveTest2(__dirname, solve2); // 249748283
solveReal2(__dirname, solve2); // 248029057

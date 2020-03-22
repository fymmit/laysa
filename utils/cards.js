const Suit = {
    CLUBS: 1,
    DIAMONDS: 2,
    HEARTS: 3,
    SPADES: 4
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const fullDeckOfCards = () => {
    const cards = [];
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 13; j++) {
            cards.push({ suit: i, rank: j });
        }
    }
    shuffle(cards);
    return cards;
};

module.exports = {
    Suit,
    fullDeckOfCards,
};

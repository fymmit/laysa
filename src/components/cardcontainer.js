const { createElement: e } = React;
import Card from './card.js';

const CardContainer = ({ cards, playCard }) => {
    const sorted = [...cards].sort((a, b) => {
        if (a.suit > b.suit) return 1;
        if (a.suit < b.suit) return -1;
        if (a.suit === b.suit) {
            if (a.rank > b.rank) return 1;
            if (a.rank < b.rank) return -1;
        }
    })
    const cardElements = sorted.map(({ suit, rank }) => {
        return e(Card, { key: `${suit}-${rank}`, suit, rank, playCard });
    });

    return (
        e('div', { style: { marginBottom: '20px' }}, cardElements)
    );
};

export default CardContainer;

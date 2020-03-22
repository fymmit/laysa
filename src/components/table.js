const { createElement: e } = React;
import Card from './card.js';

const Table = ({ cards }) => {
    const cardElements = cards.map(({ suit, rank }) => {
        return e(Card, { suit, rank });
    });

    return (
        e('div', null, cardElements)
    );
};

export default Table;

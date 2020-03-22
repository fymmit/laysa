const { createElement: e } = React;
import Card from './card.js';

const CardContainer = ({ cards, playCard }) => {
    const cardElements = cards.map(({ suit, rank }) => {
        return e(Card, { suit, rank, playCard });
    });

    return (
        e('div', null, cardElements)
    );
};

export default CardContainer;

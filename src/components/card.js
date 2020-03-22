const { createElement: e } = React;

const htmlSymbolsOfSuits = {
    1: '&clubs;',
    2: '&diams;',
    3: '&hearts;',
    4: '&spades;'
}

const Card = ({ suit, rank, playCard }) => {
    return (
        e('span', {
            style: {
                margin: '5px',
                padding: '5px',
                background: suit === 2 || suit === 3 ? '#d33' : '#333',
                color: '#ddd'
            },
            dangerouslySetInnerHTML: {__html: `${htmlSymbolsOfSuits[suit]} ${rank}`},
            onClick: playCard !== undefined ? () => playCard({ suit, rank }) : () => null
        })
    );
};

export default Card;

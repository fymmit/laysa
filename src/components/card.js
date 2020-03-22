const { createElement: e } = React;

const Card = ({ suit, rank, playCard }) => {
    return (
        e('span', {
            style: {
                margin: '5px',
                padding: '5px',
                background: '#333',
                color: '#ddd'
            },
            onClick: playCard !== undefined ? () => playCard({ suit, rank }) : () => null
        }, `${suit} ${rank}`)
    );
};

export default Card;

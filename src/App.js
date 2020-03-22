const { useState, useEffect, createElement: e } = React;
import CardContainer from './components/cardcontainer.js';
import Table from './components/table.js';

const socket = io();

const App = () => {
    const [players, setPlayers] = useState([]);
    const [input, setInput] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [id, setId] = useState('');
    const [gameActive, setGameActive] = useState(false);
    const [cards, setCards] = useState([]);
    const [cardsOnTable, setCardsOnTable] = useState([]);

    useEffect(() => {
        if (socket.id !== undefined) {
            setId(socket.id);
        }
    }, []);

    socket.on('join game', (players) => {
        console.log('join game');
        setPlayers(players);
    });
    socket.on('start game', () => {
        setGameActive(true);
    });
    socket.on('deal cards', (cards) => {
        setCards(cards);
    });
    socket.on('play card', (cards) => {
        setCards(cards);
    });
    socket.on('cards on table', (cards) => {
        setCardsOnTable(cards);
    });

    const playCard = (card) => {
        socket.emit('play card', card);
    };

    const playerList = players.map((name) => {
        return (
            e('li', null, name)
        );
    });

    return (
        e('div', null, [
            playerName.length === 0 && ([
                e('input', {
                    type: 'text',
                    value: input,
                    onChange: ({ target }) => setInput(target.value) }),
                e('button', {
                    onClick: () => {
                        if (input.length > 0) {
                            socket.emit('join game', input);
                            setPlayerName(input);
                            setInput('');
                        }
                    }
                }, 'Send')
            ]),
            e('ul', null, playerList),
            e(Table, { cards: cardsOnTable }),
            cards.length > 0 && e(CardContainer, { cards, playCard })
        ])
    );
};

export default App;

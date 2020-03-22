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
    const [log, setLog] = useState([]);

    useEffect(() => {
        if (socket.id !== undefined) {
            setId(socket.id);
        }
    }, []);

    socket.on('join game', (players) => {
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
    socket.on('log', (line) => {
        const newLog = log.concat(line);
        setLog(newLog);
    });

    const playCard = (card) => {
        socket.emit('play card', card);
    };

    const playerList = players.map(({ name, id }) => {
        return (
            e('li', {
                key: id,
                onClick: () => socket.emit('share', id)
            }, name)
        );
    });

    return (
        e('div', null, [
            playerName.length === 0 && ([
                e('input', {
                    type: 'text',
                    value: input,
                    key: 'input',
                    onChange: ({ target }) => setInput(target.value) }),
                e('button', {
                    key: 'button',
                    onClick: () => {
                        if (input.length > 0) {
                            socket.emit('join game', input);
                            setPlayerName(input);
                            setInput('');
                        }
                    }
                }, 'Send')
            ]),
            e('ul', { key: 'playerlist' }, playerList),
            e('div', {
                key: 'table',
                style: { marginBottom: '20px' }
            }, e(Table, { cards: cardsOnTable })),
            e(CardContainer, { key: 'hand', cards, playCard }),
            log.map(entry => e('div', { key: entry }, entry)).reverse()
        ])
    );
};

export default App;

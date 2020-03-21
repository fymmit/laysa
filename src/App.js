const { useState, useEffect, createElement: e } = React;

const socket = io();

const App = () => {
    const [players, setPlayers] = useState([]);
    const [input, setInput] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [id, setId] = useState('');
    const [gameActive, setGameActive] = useState(false);

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
            e('ul', null, playerList)
        ])
    );
};

export default App;

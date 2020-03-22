const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { fullDeckOfCards, Suit } = require('./utils/cards');

app.use(express.static('src'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/src' });
});

const Status = {
    WAITING: 1,
    PLAYING: 2,
    SHARING: 3,
};

let cards = fullDeckOfCards();
const players = [];
let gameStatus = Status.WAITING;
let cardsOnTable = [];
let currentTurn = 0;
let prize = 0;

io.on('connection', (socket) => {
    socket.on('join game', (name) => {
        if (players.length < 4 && players.every(p => p.id !== socket.id)) {
            players.push({
                name,
                id: socket.id,
                cards: cards.slice(players.length * 13, (players.length + 1) * 13)
            });
            console.log(`Player joined the game: ${name} ${socket.id}`);
            io.emit('join game', players.map(({ name, id }) => ({ name, id })));
            if (players.length === 4) {
                console.log('Game starting.');
                players.forEach(({ id, cards }, i) => {
                    io.to(id).emit('deal cards', cards);
                });
                for (let i = 0; i < players.length; i++) {
                    const { cards } = players[i];
                    if (cards.find(card => card.suit === Suit.CLUBS && card.rank === 7)) {
                        currentTurn = i;
                        break;
                    }
                }
                io.emit('start game');
                gameStatus = Status.PLAYING;
                console.log(currentTurn);
            }
        }
    });
    socket.on('play card', (card) => {
        if (gameStatus === Status.PLAYING) {
            if (socket.id === players[currentTurn].id) {
                const first = cardsOnTable.length > 0 ? cardsOnTable[0] : null;
                const player = players.find(p => p.id === socket.id);
                const allowedCards = first !== null
                    ? player.cards.every(c => c.suit !== first.suit)
                        ? player.cards
                        : player.cards.filter(c => c.suit === first.suit)
                    : player.cards;
                if (allowedCards.find(a => a.suit === card.suit && a.rank === card.rank)) {
                    player.cards = player.cards.filter(c => !(c.suit === card.suit && c.rank === card.rank));
                    cardsOnTable.push({ ...card, player: player.id });
                    currentTurn = currentTurn < 3 ? currentTurn + 1 : 0;
                    socket.emit('play card', player.cards);
                    io.emit('cards on table', (cardsOnTable));
                    if (cardsOnTable.length === 4) {
                        const cardsInPlay = cardsOnTable.filter(t => t.suit === first.suit);
                        const winningCard = cardsInPlay.sort((a, b) => a.rank < b.rank ? 1 : -1)[0];
                        prize = winningCard.rank;
                        const winner = players.find(p => p.id === winningCard.player).name;
                        if (winningCard.rank % 2 === 0) {
                            gameStatus = Status.SHARING;
                            io.emit('log', `${winner} is sharing...`);
                        } else {
                            io.emit('log', `${winner} drinks ${prize}`);
                        }
                        for (let i = 0; i < players.length; i++) {
                            if (players[i].id === winningCard.player) {
                                currentTurn = i;
                                break;
                            }
                        }
                        cardsOnTable.length = 0;
                        console.log(winningCard);
                    }
                }
            }
        }
    });
    socket.on('share', (id) => {
        if (gameStatus === Status.SHARING && players[currentTurn].id === socket.id) {
            const drinker = players.find(p => p.id === id);
            console.log(drinker.name + ' drinks ' + prize);
            io.emit('log', `${drinker.name} drinks ${prize}`);
            gameStatus = Status.PLAYING;
        }
    });
    console.log('a user connected');
    socket.on('disconnect', () => {
        players.length = 0;
        cards = fullDeckOfCards();
        gameStatus = Status.WAITING;
        cardsOnTable.length = 0;
        console.log('user disconnected');
    });
});

const port = 3000;
http.listen(port, () => {
    console.log('listening on ' + port);
});

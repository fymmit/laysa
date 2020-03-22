const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { fullDeckOfCards, Suit } = require('./utils/cards');

app.use(express.static('src'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/src' });
});

const cards = fullDeckOfCards();
const players = [];
const playerCards = [];
let cardsOnTable = [];
let currentTurn;

io.on('connection', (socket) => {
    socket.on('join game', (name) => {
        if (players.length < 4 && players.every(p => p.id !== socket.id)) {
            players.push({
                name,
                id: socket.id,
                cards: cards.slice(players.length * 13, (players.length + 1) * 13)
            });
            console.log(`Player joined the game: ${name} ${socket.id}`);
            io.emit('join game', players.map(p => p.name));
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
                console.log(currentTurn);
            }
        }
    });
    socket.on('play card', (card) => {
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
                    for (let i = 0; i < players.length; i++) {
                        if (players[i].id === winningCard.player) {
                            currentTurn = i;
                            break;
                        }
                    }
                    // io.emit('resolve', winner);
                    cardsOnTable.length = 0;
                    console.log(winningCard);
                }
            }
        }
    });
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const port = 3000;
http.listen(port, () => {
    console.log('listening on ' + port);
});

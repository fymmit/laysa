const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { fullDeckOfCards } = require('./utils/cards');

app.use(express.static('src'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/src' });
});

const cards = fullDeckOfCards();
const players = [];

io.on('connection', (socket) => {
    socket.on('join game', (name) => {
        if (players.length < 4 && players.every(p => p.id !== socket.id)) {
            players.push({ name, id: socket.id });
            console.log(`Player joined the game: ${name} ${socket.id}`);
            io.emit('join game', players.map(p => p.name));
            if (players.length === 4) {
                console.log('Game starting.');
                io.emit('start game');
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

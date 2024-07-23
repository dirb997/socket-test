const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server} = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(join(__dirname, 'public/css')));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user has connected');
    socket.on('disconnect', () => {
        console.log('The user has disconnected');
    })
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    })
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    })
})

server.listen(3000, () => {
    console.log("Server is running at: http://localhost:3000");
});
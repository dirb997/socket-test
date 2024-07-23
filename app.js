const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server} = require('socket.io');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function main() {
    const db = await open ({
        filename: 'chat.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNQUE,
        content TEXT
        );
    `);

    const app = express();
    const server = createServer(app);
    const io = new Server(server, {
        connectionStateRecovery: {}
    });

    app.use(express.static(join(__dirname, 'public/css')));

    app.get('/', (req, res) => {
        res.sendFile(join(__dirname, 'index.html'));
    });
    
    io.on('connection', (socket) => {
        socket.on('chat nmessage', async(msg) => {
            let result;
            try {
                result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
            } catch (error) {
                return;
            }

            io.emit('chat message', msg, result.lastID);
        })
    })
    
    server.listen(3000, () => {
        console.log("Server is running at: http://localhost:3000");
    });
}

main();
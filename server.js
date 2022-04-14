const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const port = 3000 || process.env.PORT;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/./index.html'));
});

io.on('connection', (client) => {
    console.log(client.id + ' connected');

    client.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    client.on('disconnect', () => {
        console.log(client.id + ' disconnected');
    });
});

server.listen(port, () => {
    console.log('listening on *:' + port);
});
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/./index.html'));
});

io.on('connection', (client) => {
    console.log(client.id + ' connected');

    // client.join("room-" + client.id);
    // console.log("You are in room: " + "room-" + client.id);

    client.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    client.on('disconnect', () => {
        console.log(client.id + ' disconnected');
    });
});

io.on('howdy', client => {
    console.log("test triggered");
});

server.listen(port, () => {
    console.log('listening on *:' + port);
});
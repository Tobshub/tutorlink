const express = require('express');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');
const { Server } = require('socket.io');

const app = express();
const port = 9000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('WebRTC server is running');
});

const server = app.listen(port, () => {
  console.log(`WebRTC server listening on port ${port}`);
});

const peerServer = ExpressPeerServer(server, {
  path: '/',
});

peerServer.on("connection", (client) => {
  console.log("A peer connected:", client.getId());
});

peerServer.on("disconnect", (client) => {
  console.log("A peer disconnected:", client.getId());
});

app.use('/peerjs', peerServer);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`user joined room: ${room}`);
  });

  socket.on('message', (room, message) => {
    socket.to(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

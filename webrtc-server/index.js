const express = require('express');
const cors = require('cors');
const { ExpressPeerServer } = require('peer');

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

app.use('/peerjs', peerServer);

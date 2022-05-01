const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWSS = WSServer.getWss();

const port = process.env.PORT || 5000;

app.ws('/', (ws, req) => {
  console.log('ПІДКЛЮЧЕННЯ ВСТАНОВЛЕНО');
  ws.on('message', (msg) => {
    msg = JSON.parse(msg);
    switch (msg.method) {
      case 'connection':
        connectionHandler(ws, msg);
        break;
      case 'draw':
        broadcastConnection(ws, msg);
        break;
      default:
        break;
    }
    console.log(msg);
  })
})

const connectionHandler = (ws, msg) => {
  ws.id = msg.id;
  broadcastConnection(ws, msg);
}

const broadcastConnection = (ws, msg) => {
  aWSS.clients.forEach(client => {
    if (client.id === msg.id) {
      client.send(JSON.stringify(msg));
    }
  })
}

async function start(){
  app.listen(
    port,
    () => console.log(`Example app listening on port ${port}!`))
}

start();


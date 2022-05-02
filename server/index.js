const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const app = express();
const WSServer = require('express-ws')(app);
const aWSS = WSServer.getWss();
const router = require('./picture/pictureRouter');

const port = process.env.PORT || 5000;
const mongo_url = process.env.URL_MONGO || '';

app.use(cors());
app.use(express.json());
app.use(router);


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

const start = async () => {
  try {
    await mongoose.connect(mongo_url);
    
    app.listen(port,() => console.log(`Сервер запущено на порту ${port}!`))  
  } catch (error) {
    console.log(error);
  }
}

start();


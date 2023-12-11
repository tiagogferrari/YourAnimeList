require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const axios = require('axios');
const WebSocket = require('ws');
const cache = require('express-redis-cache')
const { xss } = require('express-xss-sanitizer')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//xss
app.use(xss());

const cacheRedis = cache({
  host: 'localhost',
  port: 6379
});

app.use('/install', require('./controller/installBd'))
app.use('/anime', require('./controller/AnimeApi'))
app.use('/user', require('./controller/UsuarioApi'))  

app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let conns = [];

wss.on('connection', (socket) => {
  console.log(`Nova conexão... ${conns.length}`);
  conns.push(socket);

  socket.on('close', () => {
  console.log(`Fechando conexão... ${conns.indexOf(socket)}`);
  conns = conns.filter((s) => s !== socket);
  });

  socket.on('message', (msg) => {
    console.log(`${conns.indexOf(socket)}: ${msg}`);

    conns.forEach((conn) => {
      conn.send(`${conns.indexOf(socket)}: ${msg}`);
    });
  });

});

try {
  server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    axios.get('http://localhost:' + PORT)
      .then(response => {
        console.log('Servidor está funcionando!');
        return axios.get('http://localhost:' + PORT + '/install');
      })
      .then(response => {
        console.log('Banco de dados instalado!');
      })
      .catch(error => {
        console.error('Erro: ', error);
      });
  });
} catch (error) {
  console.error('Erro ao iniciar o servidor:', error);
}

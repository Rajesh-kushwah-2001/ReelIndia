require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDb = require('./config/db');
const setupSocket = require('./socket');

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDb();

  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: process.env.CLIENT_URL, credentials: true } });

  app.set('io', io);

  setupSocket(io);

  server.listen(PORT, () => {
    console.log(`YouPlay API running on ${PORT}`);
  });
})();

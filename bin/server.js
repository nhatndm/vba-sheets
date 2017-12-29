require('newrelic');
require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').Server(app);
const dbServices = require('../services/dbSer');
const bodyParser = require('body-parser');
const ExceptionHanlder = require('../helpers/exceptionHandler');
const AppRoutes = require('./routes');
const io = require('socket.io')(server);
const seatSelectionService = require('../controllers/seatSelectionCtrl');

// Cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Middlerware to handle JSON
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './views' });
});

// Connect DB
dbServices.startDB();

// Start SeatSelection Services
seatSelectionService(io);

// Start Server
server.listen(process.env.PORT);

// App Routes
AppRoutes(app);

// Exception Hanlder
ExceptionHanlder(app);

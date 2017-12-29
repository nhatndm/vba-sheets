const MatchController = require('../controllers/matchCtrl');
const webhookController = require('../controllers/webhook');
const express = require('express');

module.exports = (app) => {
  const matchRoutes = express.Router();
  const webhookRoutes = express.Router();

  matchRoutes.post('/match/create', MatchController.createSeatMatch);
  matchRoutes.get('/match/get', MatchController.getMatch);
  matchRoutes.get('/match/seat', MatchController.getSeat);
  matchRoutes.post('/match/seat', MatchController.editSeat);

  webhookRoutes.post('/webhook', webhookController.webhook);

  app.use('/api/v1',[matchRoutes]);
  app.use('/api', webhookRoutes);
};

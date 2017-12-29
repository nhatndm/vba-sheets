const MatchController = require('../controllers/matchCtrl');
const express = require('express');

module.exports = (app) => {
  const matchRoutes = express.Router();

  matchRoutes.post('/match/create', MatchController.createSeatMatch);
  matchRoutes.get('/match/get', MatchController.getMatch);
  matchRoutes.get('/match/seat', MatchController.getSeat);
  matchRoutes.post('/match/seat', MatchController.editSeat);

  app.use('/api/v1',[matchRoutes]);
};

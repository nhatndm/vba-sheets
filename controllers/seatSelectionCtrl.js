const seatHelper = require('../helpers/seat');
const SeatType = require('../models/seatType');
const Seat = require('../models/seat');
const _ = require('lodash');
const error = require('../helpers/error');
const DISABLED_SEAT = 1;
const ENABLED_SEAT = 0;

module.exports = (io) => {
  io.on('connection', (client) => {
    client.on('parse_value', (data) => {
      let dataResponse = {
        seat: {
          status: data.status,
          seatId: data.seatId,
          col: data.col,
          row: data.row,
          block: data.block,
          type: data.type,
          seasonID: client.id
        }
      };
      io.sockets.emit('update_seat', {dataResponse});
      Seat.findByIdAndUpdate(data.seatId, {$set: {status: data.status}}, (err, seatSaved) => {
        if (err) {
          console.log(err)
        }
        else {
          console.log(seatSaved)
        }
      })
    })
  });
};

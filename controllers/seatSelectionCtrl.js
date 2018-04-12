const seatHelper = require('../helpers/seat');
const SeatType = require('../models/seatType');
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
          col: data.col,
          row: data.row,
          block: data.block,
          type: data.type,
          seasonID: client.id
        }
      };
      io.sockets.emit('update_seat', {dataResponse});
      SeatType.findById(data.type, (err, type) => {
        if (err) {
          return console.log(err)
        }

        if (!type) {
          return console.log(err)
        }
        let blocks = type.blocks;
        console.log('stt', data.status)
        blocks[data.block].seats[data.row][data.col].status = data.status;
        SeatType.findByIdAndUpdate({_id: type._id}, {$set: {blocks: blocks}}, {new: true}, (err, seatSaved) => {
          if (err) {
            console.log(err)
          }
          else {
            console.log(seatSaved)
          }
        })
      });
    })
  });
};

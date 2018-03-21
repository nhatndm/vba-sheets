const seatHepler = require('../helpers/seat');
const SeatType = require('../models/seatType');
const _ = require('lodash');
const error = require('../helpers/error');
const DISABLEDSEAT = 1;
const ENABLEDSEAT = 0;

module.exports = (io) => {
  io.on('connection', (client) => {
    client.on('parse_value', (data) => {
      let dataResponse = {seat: {
        status: data.status,
        name: data.name,
        nameSeatIndex: data.nameSeatIndex,
        seatIndex: data.seatIndex,
        seasonID: client.id
      }};
      io.sockets.emit('update_seat', { dataResponse });
      SeatType.findById(data.data.seat_id, (err, seat) => {
        if (err) {
          return console.log(err)
        } 
    
        if (!seat) {
          return console.log(err)
        }
    
        let positionEnabled = data.data.position_enabled;
        let positionDisabled = data.data.position_disabled;
        seat.seats = seatHepler.generateSpecificSeats(seat.nameSeat ,seat.seats , positionDisabled, DISABLEDSEAT);
        seat.seats = seatHepler.generateSpecificSeats(seat.nameSeat ,seat.seats , positionEnabled, ENABLEDSEAT);
      
        SeatType.findByIdAndUpdate({ _id: seat.id }, { $set: { seats: seat.seats } }, { new: true }, (err, seatSaved) => {
          if (err) {
            console.log(err)
          }
        })
      });
    })
  });
};

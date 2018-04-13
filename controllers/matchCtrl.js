const error = require('../helpers/error');
const Match = require('../models/match');
const SeatType = require('../models/seatType');
const _ = require('lodash');
const nj = require('numjs');
const seatHelper = require('../helpers/seat');
const DISABLED_SEAT = 2;
const SELECTED_SEAT = 1;
const ENABLED_SEAT = 0;

exports.createSeatMatch = (req, res, next) => {
  let matchID = req.body.match_id;
  let seatsReq = req.body.seats;
  let seats = [];
  _.forEach(seatsReq, (seat) => {
    seats.push(
      new Promise((resolve, reject) => {
        console.log(seat);
        let name = seat.name;
        let row = seat.row;
        let col = seat.col;
        let price = Number(seat.price);
        let blocks = [];
        // TODO make this to blocks []
        let blockLength = seat.blocks.length;
        for (let i = 0; i<blockLength; i++) {
          let block = seat.blocks[i]
          let direction = block.direction;
          let seatArray = [];
          let numberOfX = block.endCol - block.startCol + 1;
          let numberOfY = block.endRow - block.startRow + 1;
          let startNumber = block.startNumber;
          let stopNumber = block.startNumber + numberOfX;
          let nameSeat = block.rowNames;
          for (let i = 0; i < numberOfY; i++) {
            let subArray = nj.arange(startNumber, stopNumber).tolist();
            subArray = _.map(subArray, (value) => {
              return {
                name: value,
                status: 0,
              }
            });
            subArray = (direction === 0) ? subArray : subArray.reverse();
            seatArray.push(subArray);
          }
          if (block.unavailableSeats) {
            seatArray = seatHelper.generateSpecificSeats(nameSeat, seatArray, block.unavailableSeats, DISABLED_SEAT);
          }
          blocks.push({
            seats: seatArray,
            nameSeat: nameSeat,
            direction: direction,
            startNumber: startNumber,
            position: {
              col: {
                start: block.startCol,
                end: block.endCol
              },
              row: {
                start: block.startRow,
                end: block.endRow
              }
            }
          })
        }
        let seatDB = new SeatType({
          name: name,
          row: row,
          col: col,
          blocks: blocks,
          price: price
        });
        seatDB.save((err, seatSaved) => {
          if (err) {
            reject(err);
          } else {
            resolve(seatSaved._id);
          }
        })
      })
    )
  });

  const generateMatch = new Promise((resolve, reject) => {
    Promise.all(seats)
      .then((value) => {
        let matchDB = new Match({
          matchID: matchID,
          seatTypes: value
        });
        matchDB.save((err, matchSaved) => {
          if (err) {
            reject(err);
          } else {
            resolve(matchSaved);
          }
        });
      })
      .catch((err) => {
        reject(err);
      });
  });

  generateMatch.then((value) => {
    res.status(201).send({
      seatArrays: value.seatTypes
    });
  }).catch((err) => {
    return error(500, err, next);
  });
};

exports.getMatch = (req, res, next) => {
  let matchID = req.query.match_id;
  Match.findOne({matchID: matchID}).populate('seatTypes').exec((err, match) => {
    if (err) {
      return error(500, err, next);
    }

    if (!match) {
      return error(404, 'Can not find this match', next);
    }

    res.status(200).send(match);
  });
};

exports.getSeat = (req, res, next) => {
  let seatID = req.query.seat_id;
  SeatType.findById(seatID, (err, seat) => {
    if (err) {
      return error(500, err, next);
    }

    if (!seat) {
      return error(404, 'Can not find this seat', next);
    }

    res.status(200).send(seats);
  });
};

exports.editSeat = (req, res, next) => {
  let seatID = req.body.seat_id;
  SeatType.findById(seatID, (err, seat) => {
    if (err) {
      return error(500, err, next);
    }

    if (!seat) {
      return error(404, 'Can not find this seat', next);
    }

    let positionEnabled = req.body.position_enabled;
    let positionDisabled = req.body.position_disabled;
    seat.seats = seatHelper.generateSpecificSeats(seat.nameSeat, seat.seats, positionDisabled, SELECTED_SEAT);
    seat.seats = seatHelper.generateSpecificSeats(seat.nameSeat, seat.seats, positionEnabled, ENABLED_SEAT);

    SeatType.findByIdAndUpdate({_id: seat.id}, {$set: {seats: seat.seats}}, {new: true}, (err, seatSaved) => {
      if (err) {
        return error(500, err, next);
      } else {
        res.status(201).send(seatSaved);
      }
    })
  });
}

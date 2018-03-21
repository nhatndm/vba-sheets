const error = require('../helpers/error');
const Match = require('../models/match');
const SeatType = require('../models/seatType');
const _ = require('lodash');
const nj = require('numjs');
const seatHepler = require('../helpers/seat');
const DISABLEDSEAT = 1;
const ENABLEDSEAT = 0;

exports.createSeatMatch = (req, res, next) => {
  let matchID = req.body.match_id;
  let seatsReq = req.body.seats;
  let seats = [];
  _.forEach(seatsReq, (seat) => {
    seats.push(
      new Promise((resolve, reject) => {
        let seatArray = [];
        let numberOfX = seat.number_of_x;
        let numberOfY = seat.number_of_y;
        let startNumber = seat.start_number;
        let stopNumber = seat.start_number + numberOfX;
        let direction = seat.direction;
        let nameSeat = seat.name_seat;
        let name = seat.name;
        for(let i = 0; i < numberOfY; i++) {
          let subArray = nj.arange(startNumber, stopNumber).tolist();
          subArray = _.map(subArray, (value) => {
            return {
              name: value,
              status: 0,
            }
          });
          subArray = direction === 0 ? subArray : subArray.reverse();
          seatArray.push(subArray); 
        }

        if (seat.positionSpecific) {
          seatArray = seatHepler.generateSpecificSeats(nameSeat ,seatArray , seat.positionSpecific, DISABLEDSEAT);          
        }

        let seatDB = new SeatType({
          name: name,
          seats: seatArray,
          nameSeat: nameSeat,
          startNumber: startNumber,
          direction: direction,
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
  Match.findOne({ matchID: matchID }).populate('seatTypes').exec((err, match) => {
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
    seat.seats = seatHepler.generateSpecificSeats(seat.nameSeat ,seat.seats , positionDisabled, DISABLEDSEAT);
    seat.seats = seatHepler.generateSpecificSeats(seat.nameSeat ,seat.seats , positionEnabled, ENABLEDSEAT);
  
    SeatType.findByIdAndUpdate({ _id: seat.id }, { $set: { seats: seat.seats } }, { new: true }, (err, seatSaved) => {
      if (err) {
        return error(500, err, next);
      }else {
        res.status(201).send(seatSaved);
      }
    })
  });
}

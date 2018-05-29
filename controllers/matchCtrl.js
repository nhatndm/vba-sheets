const error = require('../helpers/error');
const Match = require('../models/match');
const SeatType = require('../models/seatType');
const Seat = require('../models/seat');
const _ = require('lodash');
const nj = require('numjs');
const seatHelper = require('../helpers/seat');
const DISABLED_SEAT = 2;
const SELECTED_SEAT = 1;
const ENABLED_SEAT = 0;
const async = require('async')

exports.createSeatMatch = (req, res, next) => {
  let matchID = req.body.match_id;
  let seatsReq = req.body.seats;
  let seatTypes = [];
  _.forEach(seatsReq, (seat) => {
    seatTypes.push(
      new Promise(async (resolve, reject) => {
        let name = seat.name;
        let row = seat.row;
        let col = seat.col;
        let price = Number(seat.price);
        let blocks = [];
        let blockLength = seat.blocks.length;
        for (let i = 0; i < blockLength; i++) {
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
            let rowPromise = []
            subArray = _.map(subArray, (value) => {
              rowPromise.push(
                new Promise((resolve, reject) => {
                  let seat = new Seat({
                    name: value,
                    status: 0,
                  })
                  seat.save((err, data) => {
                    if (err) reject(err)
                    else {
                      resolve(data)
                    }
                  })
                })
              )
            });
            await Promise.all(rowPromise).then((value) => {
              value = (direction === 0) ? value : value.reverse();
              seatArray.push(value);
              console.log(seatArray)
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
            })
          }
        }
        console.log(blocks)
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
    Promise.all(seatTypes)
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

    SeatType.populate(match, {
      path: 'seatTypes.blocks.seats',
      model: Seat // <== We are populating phones so we need to use the correct model, not User
    }, function (err, doc) {
      if (!match) {
        return error(404, 'Can not find this match', next);
      }

      res.status(200).send(match);
    });
  });
};

exports.getSeat = (req, res, next) => {
  let seatID = req.query.seat_id;
  Folder.findOneAndUpdate(
    {
      "_id": seatID, "blocks.seats": {
        $in: []
      }
    },
    {
      "$set": {
        "permissions.$": permission
      }
    },
    function (err, doc) {

    }
  );

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

exports.editSeat = async (req, res, next) => {
  let seats = req.body.seats;
  let statusOrder = req.query.status;

  if (!seats) {
    return error(422, 'Missing params!', next)
  }
  let queryUpdate = {
    $set: {}
  };

  if (statusOrder && statusOrder === 'complete') {
    queryUpdate.$set = {
      orderStatus: 'complete',
      status: SELECTED_SEAT
    }
  }
  else {
    queryUpdate.$set = {
      status: ENABLED_SEAT
    }
  }


  await req.body.seats.forEach((seat) => {
    Seat.findByIdAndUpdate(seat, queryUpdate, {new: true},(err, dataSaved) => {
      if (err) {
        return error(500, err, next);
      }
    })
  })
  res.status(200).json({message: 'Successful'})
}

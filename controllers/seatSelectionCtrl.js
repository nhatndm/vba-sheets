const seatHelper = require('../helpers/seat');
const SeatType = require('../models/seatType');
const Seat = require('../models/seat');
const _ = require('lodash');
const error = require('../helpers/error');
const DISABLED_SEAT = 1;
const ENABLED_SEAT = 0;
const CronJob = require('cron').CronJob;
const axios = require('axios')
const vbaRailsEndpoint = process.env.RAILS_ENDPOINT

module.exports = (io) => {
  let listSession = [];
  io.on('connection', (client) => {
    client.on('parse_value', (data) => {
      if (!client.seat) {
        client.seat = []
      }
      if (data.status) {
        client.seat.push(data.seatId)
      }
      if (data.status === ENABLED_SEAT) {
        if (client.seat.indexOf(data.seatId) !== -1) {
          client.seat.splice(client.seat.indexOf(data.seatId), 1)
        }
        else {
          data.status = DISABLED_SEAT
        }
      }
      let dataResponse = {
        seat: {
          status: data.status,
          seatId: data.seatId
        }
      };
      io.sockets.emit('update_seat', {dataResponse});
      if (data.status === 1) {
        Seat.findByIdAndUpdate(data.seatId, {$set: {status: data.status}}, (err, seatSaved) => {
          if (err) {
            console.log(err)
          }
          else {
            console.log('start job')
            let date = new Date()
            date.setMinutes(date.getMinutes() + 5)
            let job = new CronJob(date, function () {
                axios.get(vbaRailsEndpoint + '/api/check_order?seat_id=' + seatSaved._id)
                  .then(function (response) {
                    console.log(response);
                  })
                  .catch(function (error) {
                    console.log('error: ', error)
                    io.sockets.emit('update_seat', {
                      seat: {
                        status: ENABLED_SEAT,
                        seatId: seatSaved._id
                      }
                    });
                    Seat.findByIdAndUpdate(seatSaved._id, {$set: {status: ENABLED_SEAT}}, (err, seatSaved) => {
                    })
                  });
              }, function () {
                console.log('done')
              },
              true
            );
            job.start();
          }
        })
      }
    });
    client.on('disconnect', () => {
      console.log('got disconnect')
      console.log(client.seat)
      console.log(client.id);
      if (client.seat || client.seat > 0) {
        listSession.push({
          id: client.id,
          seat: client.seat
        })
      }
    });
    client.on('reconnect', (session) => {
      let obj = _.find(listSession, function (o) {
        return o.id === session
      });
      if (obj) {
        client.seat = obj.seat
        listSession.splice(_.findIndex(listSession, function (o) {
          return o.id === session
        }), 1);
        io.sockets[client.id].send('reconnect', {code: 1, message: 'reconnect successful'})

      }
      else {
        io.sockets[client.id].send('reconnect', {code: 0, message: 'reconnect failed'})
      }
    })
  });
};

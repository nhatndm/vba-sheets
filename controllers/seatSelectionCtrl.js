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
      console.log('parse val');
      if (!client.seat) {
        client.seat = []
      }
      if (data.status === DISABLED_SEAT) {
        client.seat.push(data.seatId)
      }
      let isInSession = false;
      if (data.status === ENABLED_SEAT) {
        if (client.seat.indexOf(data.seatId) !== -1) {
          client.seat.splice(client.seat.indexOf(data.seatId), 1)
          isInSession = true;
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
      if (data.status === DISABLED_SEAT || isInSession) {
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
    client.on('disconnect', (session_disconnect) => {
      console.log('got disconnect');
      console.log(client.seat);
      console.log('session_var: ', session_disconnect);
      if (session_disconnect !== 'server namespace disconnect') {
        if (Array.isArray(client.seat) || client.seat > 0) {
          Seat.update({_id: {$in: client.seat}}, {status: ENABLED_SEAT}, {multi: true}, (err, data) => {
            if (err) {
              console.log('err:', err)
            }
            else {
              console.log('data', data)
            }
          })
        }
      }
    });
    client.on('session_disconnect', () => {
      listSession.push({
        id: client.id,
        seat: client.seat
      });
      client.disconnect();
      console.log(JSON.stringify(client.packet))
    });
    client.on('reconnect_session', (session) => {
      console.log('reconnect');
      let obj = _.find(listSession, function (o) {
        return o.id === session
      });
      if (obj) {
        client.seat = obj.seat
        listSession.splice(_.findIndex(listSession, function (o) {
          return o.id === session
        }), 1);
      }
      else {
      }
    })
  });
};

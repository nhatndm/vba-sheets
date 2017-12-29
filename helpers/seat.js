const _ = require('lodash');

exports.generateSpecificSeats = (nameSeat, seatArray, positionSpecific, status) => {
  _.forEach(positionSpecific, (position) => {
    let positionY = position.split("-")[0];
    let positionX = position.split("-")[1];
    let indexPositionY = _.findIndex(nameSeat, (value) => value == positionY);
    let indexPositionX = _.findIndex(seatArray[indexPositionY],  (value) => value.name == positionX);
    if (indexPositionX !== -1 && indexPositionY !== -1) {
      seatArray[indexPositionY][indexPositionX].status = status;
    }
  });
  return seatArray;
};
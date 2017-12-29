const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeatTypeSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  nameSeat : {
    type: [String],
    required: true,
  },
  seats: {
    type: [[]],
    required: true
  },
  direction: {
    type: Number,
    required:true,
  },
  startNumber: {
    type: Number,
    required:true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('SeatType', SeatTypeSchema);

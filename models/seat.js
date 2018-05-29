const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeatSchema = Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    enum: [0, 1, 2]
  },
  userId: {
    type: String
  },
  orderStatus: {
    type: String,
    enum: ['selected', 'ordered', 'complete']
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Seat', SeatSchema);

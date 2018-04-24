const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchSchema = Schema({
  matchID: {
    type: Number,
    unique: true,
    required: true,
  },
  seatTypes: [{
    type: Schema.Types.ObjectId,
    ref: 'SeatType'
  }]
}, {
  timestamps: true,
});
module.exports = mongoose.model('Match', MatchSchema);

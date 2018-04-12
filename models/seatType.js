const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlockSchema = Schema({
  nameSeat: {
    type: [String],
    required: true,
  },
  seats: {
    type: [[]],
    required: true
  },
  direction: {
    type: Number,
    required: true,
  },
  startNumber: {
    type: Number,
    required: true,
  },
  position: {
    row: {
      type: {
        start: {
          type: Number,
          required: true,
          min: [1],
        },
        end: {
          type: Number,
          required: true,
          min: [1],
        }
      },
      required: true
    },
    col: {
      type: {
        start: {
          type: Number,
          required: true,
          min: [1],
        },
        end: {
          type: Number,
          required: true,
          min: [1],
        }
      },
      required: true
    }
  }
}, { _id : true })

const SeatTypeSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  row: {
    type: Number,
    min: [1, 'Row must greater than 0']
  },
  col: {
    type: Number,
    min: [1, 'Column must greater than 0']
  },
  blocks: {
    type: [BlockSchema],
    validate: {
      validator: function (value) {
        return value.length > 0
      },
      message: 'Must have at least one block'
    }
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('SeatType', SeatTypeSchema);

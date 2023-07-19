const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Programme Parent Schema
 */
const programmeParentSchema = new Schema({
  owner: {
    type: String,
    required: [true, "station owner id not provided"]
  },
  programme: {
    type: String,
    required: [true, "station name not provided"]
  },
  freq: {
    type: String,
    enum: ["daily","weekly","monthly"],
    required: [true, "Please specify a frequency"]
  },
  interval: {
    type: Number,
    required: [true, "Please provide an interval"]
  },
  days: {
    type: [Number]
  },
  start: {
    type: Number
  },
  end: {
    type: Number
  },
  programmeStart: {
    type: String
  },
  programmeEnd: {
    type: String
  }
});

module.exports = mongoose.model('ProgrammeParent', programmeParentSchema);
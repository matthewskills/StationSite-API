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
  rule: {
    type: String,
    enum: ["weekly","monthly"],
    required: [true, "Please specify a frequency"]
  },
  exceptions: {
    type: String
  },
  cancelations: {
    type: String
  }
});

module.exports = mongoose.model('ProgrammeParent', programmeParentSchema);
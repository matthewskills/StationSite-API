const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Programmes Schema
 */
const programmeSchema = new Schema({
  owner: {
    type: String,
    required: [true, "programme owner id not provided"]
  },
  name: {
    type: String,
    required: [true, "programme name not provided"]
  },
  description: {
    type: String,
  },
  artwork1: {
    type: String
  },
  artwork2: {
    type: String
  }
});

module.exports = mongoose.model('Programme', programmeSchema);
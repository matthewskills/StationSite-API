const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Station Schema
 */
const stationSchema = new Schema({
  owner: {
    type: String,
    required: [true, "station owner id not provided"]
  },
  name: {
    type: String,
    required: [true, "station name not provided"]
  },
  description: {
    type: String,
  },
  tagline: {
    type: String
  },
  websiteUrl: {
    type: String
  },
  streamUrl: {
    type: String
  },
  artwork1: {
    type: String
  },
  artwork2: {
    type: String
  }
});

module.exports = mongoose.model('Station', stationSchema);
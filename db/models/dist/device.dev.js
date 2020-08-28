"use strict";

var mongoose = require('mongoose');

var deviceSchema = new mongoose.Schema({
  license_plate: {
    type: String,
    unique: true
  },
  driver: {
    type: String
  },
  blueprint_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blueprint"
  },
  line: {
    type: String
  },
  timestamp: {
    type: Date,
    "default": Date.now
  }
});
var Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
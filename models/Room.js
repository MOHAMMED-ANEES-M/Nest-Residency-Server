const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomType: String,
  price: Number,
  amenities: [String],
  availability: [{
    date: Date,
    isBooked: Boolean
  }]
});

module.exports = mongoose.model('Room', RoomSchema);
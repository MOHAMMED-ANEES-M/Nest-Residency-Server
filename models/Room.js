const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  roomType: { type: String, required: true },
  roomPrice: { type: String, required: true },
});

module.exports = mongoose.model('Room', RoomSchema);
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  checkInDate: Date,
  checkOutDate: Date,
  status: { type: String, default: 'booked' },
  paymentId: String
});

module.exports = mongoose.model('Booking', BookingSchema);
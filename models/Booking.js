const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  status: { type: String, default: 'booked', required: true },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true }, 
});

module.exports = mongoose.model('Booking', BookingSchema);
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  roomNumber: { type: String, required: true },
  roomType: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  status: { type: String, default: 'Booked', required: true },
  bookingMode: { type: String, required: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  specialRequest: { type: String },
  gstNumber: { type: String },
  cancelReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

BookingSchema.pre('save', function (next) {
  const now = new Date();
  if (this.checkOutDate < now && this.status !== 'Checked Out') {
    this.status = 'Checked Out';
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
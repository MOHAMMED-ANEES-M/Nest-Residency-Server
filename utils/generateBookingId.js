const Booking = require("../models/Booking");

const generateBookingId = async () => {
  const lastBooking = await Booking.findOne().sort({ bookingId: -1 });

  let nextBookingId = '001001'; 

  if (lastBooking) {
    const lastIdNumber = parseInt(lastBooking.bookingId, 10);
    nextBookingId = (lastIdNumber + 1).toString().padStart(6, '0'); 
  }

  return nextBookingId;
};

module.exports = generateBookingId;
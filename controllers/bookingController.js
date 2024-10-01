const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

const rooms = ['001', '002', '003', '004'];


// Check availability of all rooms
exports.checkAvailability = asyncHandler(async (req, res) => {
  const { checkInDate, checkOutDate } = req.body;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Validate dates (check-in must be today or later, check-out must be after check-in)
  if (checkIn < new Date().setHours(0, 0, 0, 0) || checkOut <= checkIn) {
    return res.status(400).json({ message: 'Invalid check-in or check-out date' });
  }

  // Find all bookings that overlap with the selected check-in and check-out dates
  const overlappingBookings = await Booking.find({
    roomId: { $in: rooms },
    $or: [
      { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
    ]
  });

  // Get the unique room IDs that are already booked
  const bookedRooms = [...new Set(overlappingBookings.map(booking => booking.roomId))];

  // Get the available rooms by filtering out the booked rooms
  const availableRooms = rooms.filter(roomId => !bookedRooms.includes(roomId));

  res.status(200).json({
    availableRooms,
    bookedRooms,
  });
});


// Book a room
exports.bookRoom = asyncHandler(async (req, res) => {
  const { roomId, checkInDate, checkOutDate, paymentId, orderId, amount, fname, lname, phone, address } = req.body;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Validate dates (check-in must be today or later, check-out must be after check-in)
  if (checkIn < new Date().setHours(0, 0, 0, 0) || checkOut <= checkIn) {
    return res.status(400).json({ message: 'Invalid check-in or check-out date' });
  }

  // Check if the room is available by looking at existing bookings
  const existingBookings = await Booking.find({
    roomId,
    $or: [
      { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
    ]
  });

  if (existingBookings.length > 0) {
    return res.status(400).json({ message: 'Room is already booked for the selected dates' });
  }

  const payment = new Payment({
    orderId,
    paymentId,
    amount,
    currency: 'INR',
  });

  await payment.save();

  // Create booking
  const newBooking = new Booking({
    roomId,
    checkInDate,
    checkOutDate,
    payment: payment._id, // Reference the payment
    fname,
    lname,
    phone,
    address,
  });

  await newBooking.save();

  res.status(200).json({ message: 'Room booked successfully', booking: newBooking });
});


  // Get all bookings (Admin access)
exports.getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({})
      .populate('roomId', 'roomType price');
  
    res.json(bookings);
});

// Get a specific booking by ID
exports.getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  res.json(booking);
});

// Delete a booking (Admin access)
exports.deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  await booking.remove();
  res.json({ message: 'Booking deleted successfully' });
});
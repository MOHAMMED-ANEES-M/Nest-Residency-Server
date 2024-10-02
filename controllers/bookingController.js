const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');

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
    ], 
    status: 'Booked'
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
  const { roomId, checkInDate, checkOutDate, fname, lname, phone, email } = req.body;

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
    ],
    status: 'Booked'
  });

  if (existingBookings.length > 0) {
    return res.status(400).json({ message: 'Room is already booked for the selected dates' });
  }

  // const payment = new Payment({
  //   orderId,
  //   paymentId,
  //   amount,
  //   currency: 'INR',
  // });

  // await payment.save();

  // Create booking
  const newBooking = new Booking({
    roomId,
    checkInDate,
    checkOutDate,
    bookingMode: 'Offline',
    fname,
    lname,
    phone,
    email,
  });

  await newBooking.save();

  res.status(200).json({ success: true, message: 'Room booked successfully', booking: newBooking });
});


  // Get all bookings (Admin access)
exports.getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('paymentId'); 
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

// Cancel a booking (Admin access)
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Update the status and add cancelReason without modifying required fields
  booking.status = 'Cancelled';
  booking.cancelReason = req.body.cancelReason;

  // Save the updated booking document
  await booking.save({ validateModifiedOnly: true }); // Only validate modified fields

  res.json({ message: 'Booking cancelled successfully', booking });
});
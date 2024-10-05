const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { sendBookingCancellationEmail } = require('../services/emailService');

// Check availability of all rooms
exports.checkAvailability = asyncHandler(async (req, res) => {
  const { checkInDate, checkOutDate } = req.body;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Validate dates (check-in must be today or later, check-out must be after check-in)
  if (checkIn < new Date().setHours(0, 0, 0, 0) || checkOut <= checkIn) {
    return res.status(400).json({ message: 'Invalid check-in or check-out date' });
  }

  // Step 1: Get all rooms from the Room model
  const allRooms = await Room.find({});

  // Step 2: Extract room numbers from the fetched rooms
  const roomIds = allRooms.map(room => room.roomNumber);

  // Step 3: Find all bookings that overlap with the selected check-in and check-out dates
  const overlappingBookings = await Booking.find({
    roomId: { $in: roomIds },
    $or: [
      { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
    ],
    status: 'Booked'
  });

  // Step 4: Get the unique room numbers that are already booked
  const bookedRooms = [...new Set(overlappingBookings.map(booking => booking.roomId))];

  // Step 5: Filter out the available rooms from the full room data
  const availableRooms = allRooms.filter(room => !bookedRooms.includes(room.roomNumber));

  // Step 6: Prepare response containing full details of both available and booked rooms
  const bookedRoomDetails = allRooms.filter(room => bookedRooms.includes(room.roomNumber));

  // Step 7: Send available and booked rooms with full details to the frontend
  res.status(200).json({
    availableRooms,
    bookedRooms: bookedRoomDetails, // Full details of booked rooms
  });
});


// Book a room
exports.bookRoom = asyncHandler(async (req, res) => {
  const { roomNumber, checkInDate, checkOutDate, fname, lname, phone, email, gstNumber, specialRequest } = req.body;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Validate dates (check-in must be today or later, check-out must be after check-in)
  if (checkIn < new Date().setHours(0, 0, 0, 0) || checkOut <= checkIn) {
    return res.status(400).json({ message: 'Invalid check-in or check-out date' });
  }

  // Step 1: Fetch the room details based on the roomNumber
  const room = await Room.findOne({ roomNumber });
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  // Step 2: Check if the room is available by looking at existing bookings
  const existingBookings = await Booking.find({
    roomId: room._id,
    $or: [
      { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
    ],
    status: 'Booked'
  });

  if (existingBookings.length > 0) {
    return res.status(400).json({ message: 'Room is already booked for the selected dates' });
  }

  // Step 3: Create booking with roomCategory
  const newBooking = new Booking({
    roomNumber,
    roomType: room.roomType, 
    gstNumber,
    specialRequest,
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
  const booking = await Booking.findById(req.params.id).populate('paymentId');

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

  booking.status = 'Cancelled';
  booking.cancelReason = req.body.cancelReason;

  await booking.save({ validateModifiedOnly: true }); 

  await sendBookingCancellationEmail(booking.email, `${booking.fname} ${booking.lname}`, booking.cancelReason, process.env.APP_NAME);

  res.json({ message: 'Booking cancelled successfully', booking });
});
const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { sendBookingCancellationEmail } = require('../services/emailService');

const generateBookingId = async () => {
  const lastBooking = await Booking.findOne().sort({ bookingId: -1 });

  let nextBookingId = '001001'; 

  if (lastBooking) {
    const lastIdNumber = parseInt(lastBooking.bookingId, 10);
    nextBookingId = (lastIdNumber + 1).toString().padStart(6, '0'); 
  }

  return nextBookingId;
};

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
    roomNumber: { $in: roomIds },
    $or: [
      { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
    ],
    status: 'Booked'
  });  

  // Step 4: Get the unique room numbers that are already booked
  const bookedRooms = [...new Set(overlappingBookings.map(booking => booking.roomNumber))];  

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
  const { roomType, checkInDate, checkOutDate, fname, lname, phone, email, gstNumber, specialRequest } = req.body;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Validate dates (check-in must be today or later, check-out must be after check-in)
  if (checkIn < new Date().setHours(0, 0, 0, 0) || checkOut <= checkIn) {
    return res.status(400).json({ message: 'Invalid check-in or check-out date' });
  }

  // Step 1: Fetch all rooms of the requested room type
  const availableRooms = await Room.find({ roomType });

  if (availableRooms.length === 0) {
    return res.status(404).json({ message: 'No rooms available for the selected room type' });
  }

  // Step 2: Find any rooms that are already booked for the selected dates
  const overlappingBookings = await Booking.find({
    roomNumber: { $in: availableRooms.map(room => room.roomNumber) },
    $or: [
      { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
    ],
    status: 'Booked'
  });

  // Step 3: Get the room numbers that are already booked
  const bookedRoomNumbers = overlappingBookings.map(booking => booking.roomNumber);

  // Step 4: Filter available rooms that are not booked
  const unbookedRooms = availableRooms.filter(room => !bookedRoomNumbers.includes(room.roomNumber));

  if (unbookedRooms.length === 0) {
    return res.status(400).json({ message: 'No rooms available for the selected dates' });
  }

  // Step 5: Randomly select a room from the unbooked rooms
  const randomRoom = unbookedRooms[Math.floor(Math.random() * unbookedRooms.length)];

  const bookingId = await generateBookingId();

  // Step 6: Create the booking with the selected room number and room type
  const newBooking = new Booking({
    bookingId,
    roomNumber: randomRoom.roomNumber, // Selected room number
    roomType, // The requested room type
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
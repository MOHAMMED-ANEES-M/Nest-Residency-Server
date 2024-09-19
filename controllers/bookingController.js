const Booking = require('../models/Booking');
const Room = require('../models/Room');
const asyncHandler = require('express-async-handler');

// Book a room
exports.bookRoom = asyncHandler(async (req, res) => {
    const { userId, roomId, checkInDate, checkOutDate } = req.body;
  
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
  
    // Validate dates
    if (checkIn < new Date() || checkOut <= checkIn) {
      return res.status(400).json({ message: 'Invalid check-in or check-out date' });
    }
  
    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
  
    // Check if the room is available for the entire stay period
    const isBooked = room.bookings.some(booking => 
      (checkIn < booking.date && booking.date < checkOut) ||
      (booking.date < checkIn && checkIn < booking.date) ||
      (booking.date < checkOut && checkOut < booking.date)
    );
  
    if (isBooked) {
      return res.status(400).json({ message: 'Room is already booked for the selected dates' });
    }
  
    // Create a booking
    const newBooking = new Booking({
      userId,
      roomId,
      checkInDate,
      checkOutDate,
    });
  
    await newBooking.save();
  
    // Update the room's bookings
    for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
      room.bookings.push({ date: new Date(d), userId });
    }
    await room.save();
  
    res.status(200).json({ message: 'Room booked successfully', booking: newBooking });
});

  // Get all bookings (Admin access)
exports.getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({})
      .populate('userId', 'name email')
      .populate('roomId', 'roomType price');
  
    res.json(bookings);
});
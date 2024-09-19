const Room = require('../models/Room');
const asyncHandler = require('express-async-handler');

// Check room availability
exports.checkAvailability = asyncHandler(async (req, res) => {
    const { roomType, checkInDate, checkOutDate } = req.query;
  
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
  
    // Ensure check-in and check-out are valid
    if (checkIn < new Date() || checkOut <= checkIn) {
      return res.status(400).json({ message: 'Invalid check-in or check-out date' });
    }
  
    // Find rooms of the specified type
    const availableRooms = await Room.find({
      roomType,
      'bookings': {
        $not: {
          $elemMatch: {
            date: {
              $gte: checkIn,
              $lt: checkOut
            }
          }
        }
      }
    });
  
    if (availableRooms.length === 0) {
      return res.status(404).json({ message: 'No rooms available for the selected dates' });
    }
  
    res.json(availableRooms);
  });
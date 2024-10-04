const Room = require("../models/Room");

exports.addRoom = async (req, res) => {
  const { roomNumber, roomType, roomPrice } = req.body;

  if (!roomNumber || !roomType || !roomPrice) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newRoom = new Room({
      roomNumber,
      roomType,
      roomPrice,
    });

    await newRoom.save();

    return res.status(201).json({ message: 'Room added successfully', room: newRoom });
  } catch (error) {
    console.error('Error adding room:', error.message);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
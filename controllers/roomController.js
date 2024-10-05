const asyncHandler = require('express-async-handler');
const Room = require("../models/Room");

exports.addRoom = asyncHandler(async (req, res) => {
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
});


// Update Room Details by ID
exports.updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract ID from the request parameters
  const { roomNumber, roomType, roomPrice } = req.body; // Extract details from the request body

  // Validate input
  if (!roomNumber && !roomType && !roomPrice) {
    return res.status(400).json({ message: 'At least one field is required to update' });
  }

  // Find the room by ID and update the details
  const room = await Room.findByIdAndUpdate(
    id,
    { roomNumber, roomType, roomPrice },
    { new: true, runValidators: true }
  );

  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  res.status(200).json({ success: true, message: 'Room details updated successfully', room });
});


// Update Room Price for all rooms with the same roomType
exports.updateRoomPrice = asyncHandler(async (req, res) => {
  const { roomType, newPrice } = req.body;

  // Ensure that a new price is provided
  if (!newPrice) {
    return res.status(400).json({ message: 'New price is required' });
  }

  // Find and update all rooms that match the provided roomType
  const result = await Room.updateMany(
    { roomType }, // Match all rooms with the same roomType
    { roomPrice: newPrice }, // Update the price
    { new: true, runValidators: true }
  );

  // If no rooms were updated (roomType not found)
  if (result.nModified === 0) {
    return res.status(404).json({ message: 'No rooms found with the specified room type' });
  }

  // Return success response
  res.status(200).json({
    success: true,
    message: `Room price updated successfully for all rooms with type ${roomType}`,
    updatedRooms: result.nModified, // Include the number of updated rooms
  });
});


// Find Room by ID (Previously defined)
exports.findRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Room ID is required' });
  }

  const room = await Room.findById(id);

  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }

  res.status(200).json({ success: true, room });
});


exports.getUniqueRoomTypes = asyncHandler(async (req, res) => {
  try {
    // Use aggregation to group by roomType and get one room from each type
    const uniqueRooms = await Room.aggregate([
      {
        $group: {
          _id: "$roomType", // Group by roomType
          roomNumber: { $first: "$roomNumber" }, // Get the first roomNumber for each roomType
          roomPrice: { $first: "$roomPrice" } // Get the first roomPrice for each roomType
        }
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the result
          roomNumber: 1,
          roomType: "$_id", // Include roomType in the result
          roomPrice: 1
        }
      },
      {
        $sort: { roomPrice: 1 } // Sort by roomPrice in ascending order
      }
    ]);

    res.status(200).json({ success: true, rooms: uniqueRooms });
  } catch (error) {
    console.error('Error fetching unique rooms:', error.message);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});
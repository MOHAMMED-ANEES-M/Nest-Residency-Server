const express = require('express');
const { getUniqueRoomTypes } = require('../controllers/roomController');
const router = express.Router();

router.get('/get-rooms', getUniqueRoomTypes);

module.exports = router;
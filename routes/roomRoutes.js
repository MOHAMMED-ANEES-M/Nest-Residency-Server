const express = require('express');
const { checkAvailability } = require('../controllers/roomController');
const router = express.Router();

router.get('/availability', checkAvailability);

module.exports = router;
const express = require('express');
const { login } = require('../controllers/authController');
const refreshToken = require('../middleware/refreshTokenHandler');
const router = express.Router();

router.post('/login', login);
router.post('/refresh', refreshToken);

module.exports = router;
const express = require('express');
const { login, register, currentUser, logoutUser } = require('../controllers/authController');
const refreshToken = require('../middleware/refreshTokenHandler');
const verifyToken = require('../middleware/verifyTokenHandler');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', verifyToken, currentUser);
router.post('/logout',verifyToken, logoutUser);
router.get('/refresh', refreshToken, currentUser);

module.exports = router;
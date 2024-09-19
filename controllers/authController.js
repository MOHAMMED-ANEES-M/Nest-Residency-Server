const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400)
        throw new Error("All fields are mandatory")
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400)
        throw new Error("Invalid credentials")
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400)
        throw new Error("Invalid credentials")
    }
    const accessToken = jwt.sign(
        { userId: user._id, email: user.email }, 
        process.env.JWT_ACCESS_SECRET, 
        { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' } 
    );
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000 // 1 hour
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    return res.status(200).json({ message: "Successfully Logged In", user, accessToken, refreshToken });
});
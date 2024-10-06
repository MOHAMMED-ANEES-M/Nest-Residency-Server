const Otp = require('../models/Otp');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { generateOTP } = require('../services/otpService.js');
const { sendResetPasswordEmail } = require('../services/emailService/index.js');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const bcrypt = require('bcrypt');


exports.register = asyncHandler(async (req, res) => {
    const { fname, lname, email, password, role } = req.body
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,16}$/;
    if( !fname || !lname || !email || !password || !role ) {
        res.status(400);
        throw new Error('All fields are mandatory')
    }
    if (!emailRegex.test(email)) {
        res.status(400);
        throw new Error('Invalid email format');
    }
    if (!passwordRegex.test(password)) {
        res.status(400);
        throw new Error('Password must be 6-16 characters long, contain at least one number, one special character, and one letter.');
    }
    const userExist = await User.findOne({email})
    if (userExist) {
        res.status(400);
        throw new Error('User already registered')
    }
    const hashedPassword = await bcrypt.hash( password, saltRounds )
    console.log('Hashed Password:',hashedPassword);
    const user = await User.create({ fname, lname, email, password: hashedPassword, role })
    if (user) {   
        console.log('User created',user);
        res.status(201).json({message: "Successfully Registered", user})
    } else {
        res.status(400);
        throw new Error('User data is invalid')
    }
});


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


exports.currentUser = asyncHandler(async (req,res) => {
    res.json(req.user)
    console.log('Current user:',req.user);
})


exports.requestPasswordReset = async (req, res) => {
    const  email  = 'mhdaneeslm10@gmail.com';

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User with this email does not exist" });
    }

    const resetToken = generateOTP();
    const expiry = new Date(Date.now() + 3 * 60 * 1000); 

    await Otp.create({ email, otp: resetToken, expiresAt: expiry });

    await sendResetPasswordEmail(email, resetToken);

    res.status(200).json({ message: "Password reset OTP sent" });
};


// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    const validOtp = await Otp.findOne({ email, otp });

    if (!validOtp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > validOtp.expiresAt) {
        return res.status(400).json({ message: "OTP has expired" });
    }

    await User.updateOne({ email }, { $set: { emailVerified: true } });
    await Otp.deleteMany({ email });

    res.status(200).json({ message: "OTP verified successfully" });
};


// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const validOtp = await Otp.findOne({ email, otp });

    if (!validOtp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > validOtp.expiresAt) {
        return res.status(400).json({ message: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.updateOne({ email }, { $set: { password: hashedPassword } });
    await Otp.deleteMany({ email });

    res.status(200).json({ message: "Password has been reset successfully" });
};

exports.logoutUser = asyncHandler(async (req, res) => {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken || !refreshToken) {
        res.status(400);
        throw new Error("Couldn't find token");
    }

    // jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(403);
    //         throw new Error("Authentication failed");
            
    //     }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: "Successfully Logged Out" });
    // });
});
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const refreshToken = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.cookies;
    console.log(refreshToken, 'refresh token');
    const prevToken = refreshToken;
    if (!prevToken) {
        res.status(400);
        throw new Error("Invalid token");
    }
    jwt.verify(String(prevToken), process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            res.status(403);
            throw new Error("Authentication failed");
        }
        
        const newAccessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '1h' }
        );
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000 
        });        
        req.id = user.userId;   
        console.log(req.id, 'req id');
        next();
    });
});

module.exports = refreshToken;
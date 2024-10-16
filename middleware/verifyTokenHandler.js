const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const verifyToken = asyncHandler(async (req, res, next) => {
    const { accessToken } = req.cookies; 
    if (!accessToken) {
        
        res.status(401); 
        throw new Error("No token found or token format is incorrect");
    }
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            res.status(403); 
            throw new Error("Authentication failed");   
        }
        req.id = user.userId; 
        console.log(req.id, 'req id');
        next();
    });
});

module.exports = verifyToken;
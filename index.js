const express = require('express')
const connectDB = require('./config/dbConnection');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const dotenv = require('dotenv').config()
const api = require('./services/api')
const errorHandler = require('./middleware/errorHandler');

connectDB()
const app=express()

const port = process.env.PORT || 5001

const allowedOrigins = ['https://nestresidencycalicut.in', 'https://nestresidencycalicut-llmcedxq4-anees-projects-f001e9a0.vercel.app'];

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));app.use(cookieParser());

app.use(express.json())

app.use("/api", api)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
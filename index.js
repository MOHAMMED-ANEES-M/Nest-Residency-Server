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

const corsOptions = {
    origin: ['http://nestresidencycalicut.in', 'http://www.nestresidencycalicut.in'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json())

app.use("/api", api)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
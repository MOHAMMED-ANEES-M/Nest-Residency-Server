const express = require('express')
const connectDB = require('./config/dbConnection');
// const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
var cors = require('cors');
const dotenv = require('dotenv').config()
const api = require('./services/api')
const errorHandler = require('./middleware/errorHandler');

connectDB()
const app=express()

const port = process.env.PORT || 5001

app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use(cookieParser());
app.use(express.json())

app.use("/api", api)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
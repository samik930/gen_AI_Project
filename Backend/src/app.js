const express = require('express')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')
const cors = require("cors")

const app = express()
require("dotenv").config();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "https://gen-ai-project-5w4j.onrender.com",
    credentials :  true
}))

app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)


module.exports = app 
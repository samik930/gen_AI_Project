const express = require("express")
const upload = require("../middlewares/file.middleware")
const {authUser} = require("../middlewares/auth.middleware")
const { generateInterviewReportController,getInterviewReportByIdController,getAllInterviewReportsController } = require("../controllers/interview.controller")

const interviewRouter = express.Router()
interviewRouter.post("/",authUser,upload.single("resume"),generateInterviewReportController) 
interviewRouter.get("/report/:interviewId", authUser, getInterviewReportByIdController)
interviewRouter.get("/", authUser, getAllInterviewReportsController)



module.exports = interviewRouter
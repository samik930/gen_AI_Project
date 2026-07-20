const pdfParse = require("pdf-parse")
const interviewReportModel = require("../models/interviewreport.model")
const {generateInterviewReport} = require("../services/ai.service")
async function generateInterviewReportController(req,res) {
    try {
        const {selfDescription,jobDescription} = req.body
        let resumeText = ""
        if (req.file && req.file.buffer) {
            const parsedPdf = await pdfParse(req.file.buffer)
            resumeText = parsedPdf.text
        }
        const interviewReportByAi = await generateInterviewReport({
            resume : resumeText,
            selfDescription,
            jobDescription
        })
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume : resumeText,
            selfDescription,
            jobDescription,
            title: "Custom Interview Plan", // Fallback title
            ...interviewReportByAi
        })
        res.status(201).json({
            message : "Interview repprt generated successfully",
            interviewReport
        })
    } catch (error) {
        require('fs').writeFileSync('e:/gen-AI_project/backend_error.log', error.stack || error.toString());
        res.status(500).json({ error: error.message });
    }
}

async function getInterviewReportByIdController(req,res) {
    const {interviewId} = req.params
    const interviewReport = await interviewReportModel.findOne({_id:interviewId,user:req.user.id})
    if(!interviewReport) {
        return res.status(404).json({
            message : "Interview Report not found"
        })
    }
    res.status(200).json({
        message : "Interview Report fetched succesfully",
        interviewReport
    })
}

async function getAllInterviewReportsController(req,res) {
    const interviewReports = await interviewReportModel.find({user:req.user.id}).sort({createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
    res.status(200).json({
        message : "Interview Reports fetched succesfully",
        interviewReports
    })
}


module.exports = {generateInterviewReportController,getInterviewReportByIdController,getAllInterviewReportsController}
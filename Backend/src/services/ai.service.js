const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

function safeParseGeminiResponse(text) {
    try {
        // Already valid JSON
        return JSON.parse(text);
    } catch (e) {}

    // Remove markdown code fences
    text = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    // Extract only the JSON object
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
        text = text.substring(start, end + 1);
    }

    // Remove trailing commas
    text = text.replace(/,\s*([}\]])/g, "$1");

    try {
        return JSON.parse(text);
    } catch (err) {
        console.error("Still couldn't parse JSON.");
        console.error(text);
        throw err;
    }
}

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate profile matches the job description."),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"])
        })
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string())
        })
    ),

    title: z.string()
});

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
Generate a structured interview report.

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Job Description:
${jobDescription}

IMPORTANT:

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT wrap JSON inside triple backticks.

Return EXACTLY this structure:

{
"title":"",
"matchScore":85,
"technicalQuestions":[
{
"question":"",
"intention":"",
"answer":""
}
],
"behavioralQuestions":[
{
"question":"",
"intention":"",
"answer":""
}
],
"skillGaps":[
{
"skill":"",
"severity":"medium"
}
],
"preparationPlan":[
{
"day":1,
"focus":"",
"tasks":[
"",
"",
""
]
}
]
}

Generate

- exactly 10 technical questions
- exactly 7 behavioral questions
- exactly 5 skill gaps
- exactly 5 preparation days
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    console.log("Raw Response:");
    console.log(response.text);

    let report;

    try {
        report = interviewReportSchema.parse(safeParseGeminiResponse(response.text));
    } catch (err) {
        console.log("JSON Parse Failed");
        throw err;
    }

    // ------------------------
    // TECHNICAL QUESTIONS
    // ------------------------

    if (Array.isArray(report.technicalQuestions)) {

        report.technicalQuestions = report.technicalQuestions.map(q => {

            if (typeof q === "string") {
                return {
                    question: q,
                    intention: "Assess technical knowledge",
                    answer: "Discuss implementation, tradeoffs and experience."
                };
            }

            return q;

        });

    }

    // ------------------------
    // BEHAVIORAL QUESTIONS
    // ------------------------

    if (Array.isArray(report.behavioralQuestions)) {

        report.behavioralQuestions = report.behavioralQuestions.map(q => {

            if (typeof q === "string") {

                return {
                    question: q,
                    intention: "Evaluate soft skills",
                    answer: "Answer using the STAR method."
                };

            }

            return q;

        });

    }

    // ------------------------
    // SKILL GAPS
    // ------------------------

    if (Array.isArray(report.skillGaps)) {

        report.skillGaps = report.skillGaps.map(gap => {

            if (typeof gap === "string") {

                return {
                    skill: gap,
                    severity: "medium"
                };

            }

            return gap;

        });

    }

    // ------------------------
    // PREPARATION PLAN
    // ------------------------

    if (
        Array.isArray(report.preparationPlan) &&
        report.preparationPlan.length &&
        typeof report.preparationPlan[0] === "string"
    ) {

        try {

            const text = report.preparationPlan.join("");

            report.preparationPlan = JSON.parse("[" + text + "]");

        } catch {

            report.preparationPlan = [];

        }

    }

    // ------------------------
    // DEFAULT VALUES
    // ------------------------

    report.title = report.title || "Custom Interview Plan";

    report.matchScore = Number(report.matchScore) || 75;

    report.technicalQuestions ||= [];

    report.behavioralQuestions ||= [];

    report.skillGaps ||= [];

    report.preparationPlan ||= [];

    console.log("Final Report");

    console.log(JSON.stringify(report, null, 2));

    return report;

}
module.exports = {
    generateInterviewReport
};
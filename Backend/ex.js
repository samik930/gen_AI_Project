require("dotenv").config();

const { generateInterviewReport } = require("./src/services/ai.service");

async function main() {
    try {
        const report = await generateInterviewReport({
            resume: `
John Doe
Software Engineer

Skills:
- JavaScript
- React
- Node.js
- Express
- MongoDB
- Docker

Experience:
Built multiple MERN stack applications with JWT authentication and REST APIs.
            `,

            selfDescription: `
I enjoy building scalable backend systems and full-stack applications.
I have solved 500+ DSA problems and I'm preparing for product-based companies.
            `,

            jobDescription: `
Software Development Engineer

Requirements:
- Strong JavaScript and TypeScript
- React
- Node.js
- MongoDB
- REST APIs
- Docker
- AWS
- Good communication skills
- Knowledge of Redis is a plus
            `
        });

        console.log(JSON.stringify(report, null, 2));
    } catch (err) {
        console.error("Error:");
        console.error(err);
    }
}

main();
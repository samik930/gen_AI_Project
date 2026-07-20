require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function main() {
  const models = await ai.models.list();

  console.dir(models, { depth: null });
}

main().catch(console.error);
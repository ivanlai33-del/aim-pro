import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = "AIzaSyDdvCTJaSSQmHibunQHV2cEueVeyXqyjTY";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log("Success with gemini-1.5-flash:", result.response.text());
    } catch (e) {
        console.error("Failed with gemini-1.5-flash:", e.message);
        
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Hi");
            console.log("Success with gemini-pro:", result.response.text());
        } catch (e2) {
            console.error("Failed with gemini-pro:", e2.message);
        }
    }
}

listModels();

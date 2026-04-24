import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = "AIzaSyDdvCTJaSSQmHibunQHV2cEueVeyXqyjTY";
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Hi");
        console.log("Success with gemini-2.0-flash:", result.response.text());
    } catch (e) {
        console.error("Failed with gemini-2.0-flash:", e.message);
    }
}

test();

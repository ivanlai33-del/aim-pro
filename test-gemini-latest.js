import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = "AIzaSyDdvCTJaSSQmHibunQHV2cEueVeyXqyjTY";
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hi");
        console.log("Success with gemini-flash-latest:", result.response.text());
    } catch (e) {
        console.error("Failed with gemini-flash-latest:", e.message);
    }
}

test();

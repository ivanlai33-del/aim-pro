import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = "AIzaSyDdvCTJaSSQmHibunQHV2cEueVeyXqyjTY";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // We need to use the REST API to list models or the underlying fetch
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log("Available models:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Failed to list models:", e.message);
    }
}

listModels();

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/GOOGLE_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : null;

console.log("Checking API Key:", apiKey);

if (!apiKey) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function check() {
    try {
        const result = await model.generateContent("test");
        console.log("SUCCESS!");
    } catch (e) {
        console.error("DIAGNOSTIC ERROR:", e);
    }
}

check();

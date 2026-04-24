import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/GOOGLE_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : null;

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // The SDK doesn't have a direct listModels, we have to use fetch
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

listModels();

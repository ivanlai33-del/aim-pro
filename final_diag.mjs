import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  const apiKey = "AIzaSyAgjWaTkyHCRAauBTeevj3NBVDg-zeWb4Y";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  console.log("--- Gemini API Final Diagnostic ---");
  console.log("Checking which models are accessible with your Key...");

  const modelsToTest = [
    "gemini-1.5-flash", 
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro", 
    "gemini-1.0-pro"
  ];
    
  for (const modelName of modelsToTest) {
    process.stdout.write(`Testing ${modelName}... `);
    try {
      // Try with no version override first (let SDK decide)
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say 'OK'");
      console.log(`✅ WORKING! Response: "${result.response.text().trim()}"`);
    } catch (e) {
      console.log(`❌ FAILED. (${e.message.split(' ')[0]}...)`);
    }
  }
}

run();

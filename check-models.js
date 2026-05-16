const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

// 載入 .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("錯誤：找不到 API Key，請檢查 .env.local");
    return;
  }

  console.log("正在使用 Key 查詢可用模型...");
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // 嘗試列出模型
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (data.error) {
      console.error("API 錯誤：", data.error.message);
      return;
    }

    console.log("\n--- 目前您的 Key 可用的模型清單 ---");
    data.models.forEach(model => {
      if (model.supportedGenerationMethods.includes("generateContent")) {
        console.log(`- ${model.name.replace('models/', '')} (${model.displayName})`);
      }
    });
    console.log("----------------------------------\n");

  } catch (error) {
    console.error("發生異常：", error.message);
  }
}

listModels();

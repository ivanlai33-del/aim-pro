
const { generatePrompt } = require('./src/lib/promptGenerator');

const shortData = {
    projectType: 'web',
    projectName: 'Short Project',
    description: 'Short description.',
    features: 'Short features.'
};

const longData = {
    projectType: 'web',
    projectName: 'Long Project',
    description: 'This is a very long description that should trigger the detailed mode. '.repeat(10),
    features: 'This is a very detailed feature list that should also contribute to the length. '.repeat(10),
    optimizationGoals: 'And some optimization goals to ensure we cross the 500 character threshold. '.repeat(5)
};

console.log("--- Short Input Prompt ---");
const shortPrompt = generatePrompt(shortData);
if (shortPrompt.includes("精簡模式")) {
    console.log("✅ Detected Concise Mode");
} else {
    console.error("❌ Failed to detect Concise Mode");
}

console.log("\n--- Long Input Prompt ---");
const longPrompt = generatePrompt(longData);
if (longPrompt.includes("詳細模式")) {
    console.log("✅ Detected Detailed Mode");
} else {
    console.error("❌ Failed to detect Detailed Mode");
}

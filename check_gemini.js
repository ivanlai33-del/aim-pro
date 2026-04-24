const fs = require('fs');
const path = './node_modules/@google/generative-ai';
if (fs.existsSync(path)) {
  console.log("✅ SUCCESS: @google/generative-ai is installed in node_modules.");
  console.log("👉 ACTION: Please RESTART your dev server (Ctrl+C, then npm run dev) to pick up changes.");
} else {
  console.error("❌ ERROR: Package still missing. Re-running install...");
}

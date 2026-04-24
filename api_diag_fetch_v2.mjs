import fs from 'fs';

async function diagnose() {
    const apiKey = "AIzaSyAgjWaTkyHCRAauBTeevj3NBVDg-zeWb4Y";
    let output = "--- Gemini API Direct Fetch Diagnostic v2 ---\n";
    
    try {
        output += "1. Listing all models via fetch...\n";
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();
        
        if (data.error) {
            output += "❌ API ERROR: " + JSON.stringify(data.error, null, 2) + "\n";
        } else {
            output += "✅ Successfully listed models!\n";
            const modelNames = data.models.map(m => m.name.split('/').pop());
            output += "Available models: " + modelNames.join(", ") + "\n";
        }
    } catch (err) {
        output += "❌ Network or Execution Error: " + err.message + "\n";
    }

    fs.writeFileSync('./api_results_v2.txt', output);
    console.log("Done writing to api_results_v2.txt");
}

diagnose();

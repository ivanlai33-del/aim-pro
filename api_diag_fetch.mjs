async function diagnose() {
    const apiKey = "AIzaSyAgjWaTkyHCRAauBTeevj3NBVDg-zeWb4Y";
    console.log("--- Gemini API Direct Fetch Diagnostic ---");
    
    try {
        console.log("1. Listing all models via fetch...");
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();
        
        if (data.error) {
            console.log("❌ API ERROR:", JSON.stringify(data.error, null, 2));
            return;
        }
        
        console.log("✅ Successfully listed models!");
        const modelNames = data.models.map(m => m.name.split('/').pop());
        console.log("Available models:", modelNames.join(", "));
        
        if (modelNames.includes("gemini-1.5-flash")) {
            console.log("👉 gemini-1.5-flash IS in the list.");
        } else {
            console.log("❌ gemini-1.5-flash IS NOT in the list.");
        }
    } catch (err) {
        console.error("❌ Network or Execution Error:", err.message);
    }
}

diagnose();

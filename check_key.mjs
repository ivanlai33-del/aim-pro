const apiKey = "AIzaSyAgjWaTkyHCRAauBTeevj3NBVDg-zeWb4Y";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Checking API Key permissions via raw HTTP...`);

fetch(url)
  .then(async res => {
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    try {
        const data = JSON.parse(text);
        if (res.ok) {
            console.log("✅ API Key is VALID!");
            console.log("Available Models:", data.models.map(m => m.name.replace('models/', '')).join(', '));
        } else {
            console.log("❌ API Returned Error:");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.log("Response (Not JSON):", text);
    }
  })
  .catch(err => {
    console.log("❌ Network Error:", err.message);
  });

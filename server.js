const http = require('http');
const https = require('https');

const FIREBASE_URL = "https://sound-data-22c8d-default-rtdb.firebaseio.com/data.json"; // Remplace ici

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/proxy') {
    let body = "";

    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log("📩 Données reçues :", body);

      try {
        const data = JSON.stringify(JSON.parse(body));  // Sécurité de parsing

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
          }
        };

        const fbReq = https.request(FIREBASE_URL, options, fbRes => {
          let response = '';
          fbRes.on('data', chunk => response += chunk);
          fbRes.on('end', () => {
            console.log("✅ Firebase response :", response);
          });
        });

        fbReq.on('error', err => {
          console.error("❌ Erreur Firebase :", err.message);
        });

        fbReq.write(data);
        fbReq.end();

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("OK\n");

      } catch (e) {
        console.error("❌ Erreur parsing JSON :", e.message);
        res.writeHead(400);
        res.end("Bad JSON\n");
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not Found\n");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur proxy + Firebase sur port ${PORT}`);
});

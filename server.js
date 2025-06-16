const http = require('http');
const https = require('https');

// 🔧 Configure ici ton URL Firebase
const FIREBASE_URL = "https://sound-data-22c8d-default-rtdb.firebaseio.com/data.json"; // ⚠️ Remplace xxxxx

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/proxy') {
    let body = "";

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      console.log("📩 Données reçues :", body);

      // ✅ Envoi vers Firebase
      const data = JSON.stringify(JSON.parse(body)); // Assure que c’est un JSON propre

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };

      const fbReq = https.request(FIREBASE_URL, options, fbRes => {
        let responseBody = "";
        fbRes.on('data', chunk => responseBody += chunk);
        fbRes.on('end', () => {
          console.log("✅ Données envoyées à Firebase :", responseBody);
        });
      });

      fbReq.on('error', error => {
        console.error("❌ Erreur Firebase :", error.message);
      });

      fbReq.write(data);
      fbReq.end();

      // Réponse au SIM7000E
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end("OK");
    });
  } else {
    // Redirige toute autre requête
    res.writeHead(301, { Location: '/' });
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 Serveur Railway + Firebase actif sur le port", PORT);
});

const http = require('http');
const https = require('https');

const FIREBASE_URL = "https://sound-data-xxxxx-default-rtdb.firebaseio.com/data.json"; // remplace xxxxx

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/proxy') {
    let body = "";

    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log("📩 Données reçues :", body);

      const data = JSON.stringify(JSON.parse(body));

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
          console.log("✅ Envoyé à Firebase :", responseBody);
        });
      });

      fbReq.on('error', err => {
        console.error("❌ Firebase error :", err.message);
      });

      fbReq.write(data);
      fbReq.end();

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end("OK");
    });
  } else {
    res.writeHead(301, { Location: '/' });
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🚀 Proxy + Firebase actif sur port", PORT);
});

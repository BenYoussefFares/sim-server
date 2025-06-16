const http = require('http');
const https = require('https');

// 🔐 Ton lien complet vers Firebase Realtime Database
const FIREBASE_URL = 'https://sound-data-22c8d-default-rtdb.firebaseio.com/data.json';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/proxy') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log('📥 Données reçues :', body);

      // 🔁 Requête POST vers Firebase
      const fbReq = https.request(FIREBASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      }, fbRes => {
        console.log(`📤 Firebase status: ${fbRes.statusCode}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      });

      fbReq.on('error', err => {
        console.error('❌ Erreur Firebase :', err);
        res.writeHead(500);
        res.end('Erreur Firebase');
      });

      fbReq.write(body);
      fbReq.end();
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(8080, () => {
  console.log('🚀 Serveur proxy + Firebase sur port 8080');
});

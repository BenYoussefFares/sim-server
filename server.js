const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/') {
    let body = "";
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      console.log("📩 Données reçues :", body);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end("OK\n");
    });
  } else {
    res.writeHead(400);
    res.end("Bad Request");
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Serveur HTTP en écoute sur le port ${process.env.PORT || 3000}`);
});

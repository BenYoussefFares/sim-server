// server.js
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

app.post('/proxy', async (req, res) => {
  const data = req.body;

  // ✅ Met ici l'URL complète vers ta Firebase Realtime DB
  const firebaseUrl = 'https://sound-data-22c8d-default-rtdb.firebaseio.com/data.json';

  try {
    const response = await fetch(firebaseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    res.json({ success: true, firebase: result });
  } catch (err) {
    console.error('Erreur vers Firebase :', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🌐 Proxy actif sur le port ${port}`);
});

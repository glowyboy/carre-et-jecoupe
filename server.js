const express = require('express');
const cors = require('cors');
const app = express();
const {
  joinGame,
  startRound,
  passCard,
  declareCarré,
  getStatus,
  setCharade,
  jeCoupe,
} = require('./game');

app.use(cors()); // Allow all origins (adjust for production)
app.use(express.json()); // Parse JSON

// Routes
app.post('/api/join', (req, res) => {
  const { playerName } = req.body;
  res.json(joinGame(playerName));
});

app.post('/api/start', (req, res) => res.json(startRound()));

app.post('/api/pass-card', (req, res) => {
  const { playerId, cardIndex } = req.body;
  res.json(passCard(playerId, cardIndex));
});

app.post('/api/declare', (req, res) => {
  const { playerId, charade } = req.body;
  res.json(declareCarré(playerId, charade));
});

app.post('/api/set-charade', (req, res) => {
  const { teamIndex, charade } = req.body;
  res.json(setCharade(teamIndex, charade));
});

app.post('/api/je-coupe', (req, res) => {
  const { playerId } = req.body;
  res.json(jeCoupe(playerId));
});

app.get('/api/status', (req, res) => res.json(getStatus()));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

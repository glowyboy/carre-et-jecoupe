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

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/join', (req, res) => {
  const { playerName } = req.body;
  const result = joinGame(playerName);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

app.post('/api/start', (req, res) => {
  const result = startRound();
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

app.post('/api/pass-card', (req, res) => {
  const { playerId, cardIndex } = req.body;
  const result = passCard(playerId, cardIndex);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

app.post('/api/declare', (req, res) => {
  const { playerId, charade } = req.body;
  const result = declareCarré(playerId, charade);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

app.post('/api/set-charade', (req, res) => {
  const { teamIndex, charade } = req.body;
  const result = setCharade(teamIndex, charade);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

app.post('/api/je-coupe', (req, res) => {
  const { playerId } = req.body;
  const result = jeCoupe(playerId);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

app.get('/api/status', (req, res) => res.json(getStatus()));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

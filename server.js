const express = require('express');
const cors = require('cors');
const app = express();

const {
  createRoom,
  joinGame,
  startRound,
  passCard,
  declareCarré,
  jeCoupe,
  setCharade,
  resetGame,
  getStatus,
} = require('./game');

app.use(cors());
app.use(express.json());

// Create Room
app.post('/api/create-room', (req, res) => {
  const roomCode = createRoom();
  res.json({ roomCode });
});

// Join Room
app.post('/api/join', (req, res) => {
  const { playerName, roomCode } = req.body;
  const result = joinGame(roomCode, playerName);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// Reset Room
app.post('/api/reset', (req, res) => {
  const { roomCode } = req.body;
  const result = resetGame(roomCode);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// Start Round
app.post('/api/start', (req, res) => {
  const { roomCode } = req.body;
  const result = startRound(roomCode);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

app.post('/api/pass-card', (req, res) => {
  const { roomCode, playerId, cardIndex } = req.body;
  const result = passCard(roomCode, playerId, cardIndex);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});


// Declare Carré
app.post('/api/declare', (req, res) => {
  const { roomCode, playerId, charade } = req.body;
  const result = declareCarré(roomCode, playerId, charade);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// Je Coupe
app.post('/api/je-coupe', (req, res) => {
  const { roomCode, playerId } = req.body;
  const result = jeCoupe(roomCode, playerId);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// Set Charade
app.post('/api/set-charade', (req, res) => {
  const { roomCode, teamIndex, charade } = req.body;
  const result = setCharade(roomCode, teamIndex, charade);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// Get Status
app.get('/api/status/:roomCode', (req, res) => {
  const { roomCode } = req.params;
  const result = getStatus(roomCode);
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

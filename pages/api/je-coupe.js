// Keep track of who declared Carré
gameState.carreDeclaredBy = null;
gameState.jeCoupeResponses = [];

app.post('/api/declare', (req, res) => {
  const { playerId, charade } = req.body;

  if (!gameState.roundActive)
    return res.status(400).json({ error: "No active round." });

  const idx = playerId - 1;
  const cards = gameState.cards[idx];

  const isCarré = cards.every(c => c.type === cards[0].type);
  if (!isCarré)
    return res.status(400).json({ error: "You don’t have a Carré." });

  const teamIdx = gameState.players.findIndex(p => p.id === playerId) < 2 ? 0 : 1;
  if (gameState.charades[teamIdx] !== charade)
    return res.status(400).json({ error: "Wrong charade." });

  gameState.carreDeclaredBy = playerId;
  return res.json({ message: `Player ${playerId} declared Carré.` });
});

app.post('/api/je-coupe', (req, res) => {
  const { playerId } = req.body;

  if (!gameState.carreDeclaredBy)
    return res.status(400).json({ error: "No Carré has been declared yet." });

  // Prevent duplicate responses
  if (gameState.jeCoupeResponses.includes(playerId)) {
    return res.status(400).json({ error: "You already responded with Je Coupe." });
  }

  gameState.jeCoupeResponses.push(playerId);
  res.json({ message: `Player ${playerId} responded with Je Coupe.` });
});

app.post('/api/set-charade', (req, res) => {
    const { teamIndex, charade } = req.body;
  
    if (teamIndex !== 0 && teamIndex !== 1)
      return res.status(400).json({ error: "Invalid team index." });
  
    gameState.charades[teamIndex] = charade;
    res.json({ message: `Charade for Team ${teamIndex + 1} set to "${charade}"` });
  });
  
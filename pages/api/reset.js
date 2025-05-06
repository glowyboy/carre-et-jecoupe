// Reset route to reset all game data
app.post('/api/reset', (req, res) => {
    try {
      resetGame(); // Call the reset function to clear all game data
      res.json({ message: 'Game has been reset, you can start a new game.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to reset the game.' });
    }
  });
  
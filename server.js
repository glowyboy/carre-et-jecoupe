// server.js

const express = require("express");
const game = require("./api/game");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route to join the game
app.post("/join", (req, res) => {
    const { playerName } = req.body;
    const result = game.joinGame(playerName);
    if (result.error) {
        return res.status(400).json(result);
    }
    res.json(result);
});

// API route to start a round
app.post("/start", (req, res) => {
    const result = game.startRound();
    if (result.error) {
        return res.status(400).json(result);
    }
    res.json(result);
});

// API route to pass a card
app.post("/pass-card", (req, res) => {
    const { playerId, cardIndex } = req.body; // playerId and cardIndex to pass
    const result = game.passCard(playerId, cardIndex);
    if (result.error) {
        return res.status(400).json(result);
    }
    res.json(result);
});

// API route to declare Carré
app.post("/declare", (req, res) => {
    const { playerId, charade } = req.body; // playerId and charade word
    const result = game.declareCarré(playerId, charade);
    if (result.error) {
        return res.status(400).json(result);
    }
    res.json(result);
});

// API route to get current game status
app.get("/status", (req, res) => {
    res.json(game.getGameStatus());
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

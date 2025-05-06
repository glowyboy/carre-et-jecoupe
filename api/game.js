// game.js

// Generate 4 random cards for simplicity (you can improve this logic)
const generateCards = () => {
    return ["A", "B", "C", "D", "E", "F"].map((card) => ({
        type: card,
        value: Math.floor(Math.random() * 10),
    }));
};

// Game state management
let gameState = {
    players: [], // List of players
    currentTurn: 0, // Keeps track of the current player (clockwise)
    teams: [[], []], // Two teams (index 0 and 1)
    charades: [], // Charade words for teams
    cards: [], // Each player's current cards
    roundActive: false, // Whether a round is active
    winner: null, // Winning team or player
};

// Add player to the game
const joinGame = (playerName) => {
    if (gameState.players.length < 4) {
        const playerId = gameState.players.length + 1;
        gameState.players.push({ id: playerId, name: playerName });
        if (gameState.players.length === 4) {
            // Assign teams
            gameState.teams[0] = [gameState.players[0], gameState.players[1]];
            gameState.teams[1] = [gameState.players[2], gameState.players[3]];
        }
        return { message: `${playerName} joined. Waiting for more players...`, teams: gameState.teams };
    }
    return { error: "Game is full." };
};

// Start the round
const startRound = () => {
    if (gameState.players.length === 4) {
        gameState.roundActive = true;
        gameState.cards = gameState.players.map(() => generateCards());
        gameState.charades = ["Charade A", "Charade B"]; // Random charades for teams
        gameState.currentTurn = 0; // Player 1 starts
        return { message: "Round started", cards: gameState.cards };
    }
    return { error: "Not enough players to start the game." };
};

// Pass a card to the left (enemy)
const passCard = (playerId, cardIndex) => {
    if (!gameState.roundActive) {
        return { error: "No active round." };
    }
    const currentPlayer = gameState.players[gameState.currentTurn];
    if (currentPlayer.id !== playerId) {
        return { error: "Not your turn!" };
    }

    // Pass the card to the left (enemy)
    const passedCard = gameState.cards[gameState.currentTurn].splice(cardIndex, 1)[0];
    const enemyIndex = (gameState.currentTurn + 2) % 4; // The enemy is 2 positions away
    gameState.cards[enemyIndex].push(passedCard);

    // Update the turn
    gameState.currentTurn = (gameState.currentTurn + 1) % 4;

    return { message: `Card passed to ${gameState.players[gameState.currentTurn].name}`, nextTurn: gameState.players[gameState.currentTurn].name };
};

// Declare Carré and check if the player wins
const declareCarré = (playerId, charade) => {
    if (!gameState.roundActive) {
        return { error: "No active round." };
    }

    const player = gameState.players.find((p) => p.id === playerId);
    if (!player) return { error: "Player not found." };

    // Check if player has 4 matching cards (simplified logic)
    const playerCards = gameState.cards[playerId - 1];
    const cardTypes = playerCards.map((card) => card.type);
    const hasCarré = cardTypes.every((type) => type === cardTypes[0]);

    if (hasCarré && gameState.charades[0] === charade) {
        gameState.winner = player;
        gameState.roundActive = false;
        return { message: `${player.name} declared Carré and won the round!` };
    }

    return { error: "You must have 4 matching cards and declare the correct charade." };
};

// Get current game status
const getGameStatus = () => {
    return gameState;
};

module.exports = {
    joinGame,
    startRound,
    passCard,
    declareCarré,
    getGameStatus,
};

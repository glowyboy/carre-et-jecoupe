let gameState = {
  players: [],
  currentTurn: 0,
  teams: [[], []],
  charades: [],
  cards: [],
  roundActive: false,
  winner: null,
};

// Generate full shared deck with 4 cards of each type
function generateDeck() {
  const types = ["A", "B", "C", "D"];
  const deck = [];

  types.forEach(type => {
    for (let i = 0; i < 4; i++) {
      deck.push({ type, value: Math.random() });
    }
  });

  // Shuffle using Fisher-Yates
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function joinGame(playerName) {
  if (gameState.players.length >= 4) return { error: "Game is full." };

  const id = gameState.players.length + 1;
  gameState.players.push({ id, name: playerName });

  if (gameState.players.length === 4) {
    gameState.teams = [
      [gameState.players[0], gameState.players[1]],
      [gameState.players[2], gameState.players[3]],
    ];
  }

  return { message: `${playerName} joined.`, teams: gameState.teams };
}

function startRound() {
  if (gameState.players.length < 4)
    return { error: "Need 4 players." };

  gameState.roundActive = true;

  const deck = generateDeck();
  gameState.cards = [];

  // Deal 4 cards per player
  for (let i = 0; i < 4; i++) {
    gameState.cards.push(deck.splice(0, 4));
  }

  gameState.charades = ["Charade A", "Charade B"];
  gameState.currentTurn = 0;
  gameState.winner = null;

  return { message: "Round started", cards: gameState.cards };
}
function passCard(playerId, cardIndex) {
  if (!gameState.roundActive) return { error: "No active round." };
  
  const currentTurn = gameState.currentTurn;
  if (gameState.players[currentTurn].id !== playerId)
    return { error: "Not your turn." };

  // Get the card to pass
  const card = gameState.cards[currentTurn].splice(cardIndex, 1)[0];
  
  // Determine next player based on the diagram's flow
  // In your diagram: 1 -> 3 -> 2 -> 4 -> 1 (repeating)
  let nextTurn;
  
  switch(currentTurn) {
    case 0: // Player 1 passes to Player 3
      nextTurn = 2;
      break;
    case 1: // Player 2 passes to Player 4
      nextTurn = 3;
      break;
    case 2: // Player 3 passes to Player 2
      nextTurn = 1;
      break;
    case 3: // Player 4 passes to Player 1
      nextTurn = 0;
      break;
  }
  
  // Add the card to the next player's hand
  gameState.cards[nextTurn].push(card);
  
  // Update the current turn
  gameState.currentTurn = nextTurn;

  return {
    message: "Card passed",
    nextTurn: gameState.players[gameState.currentTurn].name
  };
}

function declareCarré(playerId, charade) {
  if (!gameState.roundActive) return { error: "No active round." };

  const idx = playerId - 1;
  const cards = gameState.cards[idx];

  if (!cards.every(c => c.type === cards[0].type))
    return { error: "You don’t have a Carré." };

  const teamIdx = idx < 2 ? 0 : 1;
  if (gameState.charades[teamIdx] !== charade)
    return { error: "Wrong charade." };

  gameState.roundActive = false;
  gameState.winner = gameState.players.find(p => p.id === playerId);

  return { message: `${gameState.winner.name} wins!` };
}

function getStatus() {
  return gameState;
}

module.exports = {
  joinGame,
  startRound,
  passCard,
  declareCarré,
  getStatus
};

let gameState = {
  players: [],
  currentTurn: 0,
  teams: [[], []],
  charades: [],
  cards: [],
  roundActive: false,
  winner: null,
  carreDeclaredBy: null,
  jeCoupeResponses: [],
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
  gameState.carreDeclaredBy = null;
  gameState.jeCoupeResponses = [];
  gameState.winner = null;

  const deck = generateDeck();
  gameState.cards = [];

  for (let i = 0; i < 4; i++) {
    gameState.cards.push(deck.splice(0, 4));
  }

  gameState.charades = ["Charade A", "Charade B"];
  gameState.currentTurn = 0;

  return {
    message: "Round started",
    cards: gameState.cards,
    charades: gameState.charades,
    turn: gameState.players[0].name
  };
}

function passCard(playerId, cardIndex) {
  if (!gameState.roundActive) return { error: "No active round." };

  const currentTurn = gameState.currentTurn;
  if (gameState.players[currentTurn].id !== playerId)
    return { error: "Not your turn." };

  const card = gameState.cards[currentTurn].splice(cardIndex, 1)[0];

  let nextTurn;
  switch (currentTurn) {
    case 0: nextTurn = 2; break;
    case 1: nextTurn = 3; break;
    case 2: nextTurn = 1; break;
    case 3: nextTurn = 0; break;
  }

  gameState.cards[nextTurn].push(card);
  gameState.currentTurn = nextTurn;

  return {
    message: "Card passed",
    nextTurn: gameState.players[nextTurn].name
  };
}

function declareCarré(playerId, charade) {
  if (!gameState.roundActive) return { error: "No active round." };

  const idx = playerId - 1;
  const cards = gameState.cards[idx];

  const isCarré = cards.every(c => c.type === cards[0].type);
  if (!isCarré) return { error: "You don’t have a Carré." };

  const teamIdx = idx < 2 ? 0 : 1;
  if (gameState.charades[teamIdx] !== charade)
    return { error: "Wrong charade." };

  gameState.carreDeclaredBy = playerId;

  return { message: `Player ${playerId} declared Carré.` };
}

function jeCoupe(playerId) {
  if (!gameState.carreDeclaredBy)
    return { error: "No Carré has been declared yet." };

  if (gameState.jeCoupeResponses.includes(playerId))
    return { error: "You already responded with Je Coupe." };

  gameState.jeCoupeResponses.push(playerId);

  return { message: `Player ${playerId} responded with Je Coupe.` };
}

function setCharade(teamIndex, charade) {
  if (teamIndex !== 0 && teamIndex !== 1)
    return { error: "Invalid team index." };

  gameState.charades[teamIndex] = charade;

  return { message: `Charade for Team ${teamIndex + 1} set to "${charade}"` };
}

function getStatus() {
  return gameState;
}

module.exports = {
  joinGame,
  startRound,
  passCard,
  declareCarré,
  jeCoupe,
  setCharade,
  getStatus,
};

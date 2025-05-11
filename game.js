const rooms = {};

function createGameState() {
  return {
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
}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateDeck() {
  const types = ["A", "B", "C", "D"];
  const deck = [];

  types.forEach(type => {
    for (let i = 0; i < 4; i++) {
      deck.push({ type, value: Math.random() });
    }
  });

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function createRoom() {
  const roomCode = generateRoomCode();
  rooms[roomCode] = createGameState();
  return roomCode;
}

function joinGame(roomCode, playerName) {
  const room = rooms[roomCode];
  if (!room) return { error: "Room not found." };

  if (room.players.length >= 4) {
    return { error: "Game is full." };
  }

  const id = room.players.length + 1;
  room.players.push({ id, name: playerName });

if (room.players.length === 4) {
  const shuffled = [...room.players].sort(() => Math.random() - 0.5);
  room.players = shuffled;

  // Assign teams
  room.teams = [
    [shuffled[0], shuffled[2]], // Team 1
    [shuffled[1], shuffled[3]]  // Team 2
  ];

  // Define fixed pass order: T1P1 → T2P1 → T1P2 → T2P2
  room.turnOrder = [shuffled[0], shuffled[1], shuffled[2], shuffled[3]];

  // Start with T1P1 (index 0)
  room.currentTurn = 0;
}


  return { message: `${playerName} joined.`, teams: room.teams };
}

function startRound(roomCode) {
  const room = rooms[roomCode];
  if (!room) return { error: "Room not found." };

  if (room.players.length < 4)
    return { error: "Need 4 players." };

  room.roundActive = true;
  room.carreDeclaredBy = null;
  room.jeCoupeResponses = [];
  room.winner = null;

  const deck = generateDeck();
  room.cards = [];

  for (let i = 0; i < 4; i++) {
    room.cards.push(deck.splice(0, 4));
  }

  room.charades = ["Charade A", "Charade B"];

  return {
    message: "Round started",
    cards: room.cards,
    charades: room.charades,
    turn: room.players[room.currentTurn].name
  };
}

function passCard(roomCode, playerId, cardIndex) {
  const room = rooms[roomCode];
  if (!room || !room.roundActive) return { error: "No active round." };

  const currentPlayer = room.turnOrder[room.currentTurn];
  if (currentPlayer.id !== playerId)
    return { error: "Not your turn." };

  // Find the actual player index in `room.players` to remove the card from
  const fromIndex = room.players.findIndex(p => p.id === playerId);
  const card = room.cards[fromIndex].splice(cardIndex, 1)[0];

  // Advance to next turn
  const nextTurn = (room.currentTurn + 1) % 4;
  const nextPlayer = room.turnOrder[nextTurn];

  // Find the actual player index in `room.players` to add the card to
  const toIndex = room.players.findIndex(p => p.id === nextPlayer.id);
  room.cards[toIndex].push(card);

  // Update turn
  room.currentTurn = nextTurn;

  return {
    message: "Card passed",
    nextTurn: nextPlayer.name
  };
}




function declareCarré(roomCode, playerId, charade) {
  const room = rooms[roomCode];
  if (!room || !room.roundActive) return { error: "No active round." };

  const idx = room.players.findIndex(p => p.id === playerId);
  if (idx === -1) return { error: "Player not found." };

  const cards = room.cards[idx];
  const isCarré = cards.every(c => c.type === cards[0].type);
  if (!isCarré) return { error: "You don’t have a Carré." };

  const teamIdx = idx < 2 ? 0 : 1;
  if (room.charades[teamIdx] !== charade)
    return { error: "Wrong charade." };

  room.carreDeclaredBy = playerId;

  return { message: `Player ${playerId} declared Carré.` };
}

function jeCoupe(roomCode, playerId) {
  const room = rooms[roomCode];
  if (!room || !room.carreDeclaredBy)
    return { error: "No Carré has been declared yet." };

  if (room.jeCoupeResponses.includes(playerId))
    return { error: "You already responded with Je Coupe." };

  room.jeCoupeResponses.push(playerId);

  return { message: `Player ${playerId} responded with Je Coupe.` };
}

function setCharade(roomCode, teamIndex, charade) {
  const room = rooms[roomCode];
  if (!room) return { error: "Room not found." };

  if (teamIndex !== 0 && teamIndex !== 1)
    return { error: "Invalid team index." };

  room.charades[teamIndex] = charade;

  return { message: `Charade for Team ${teamIndex + 1} set to "${charade}"` };
}

function resetGame(roomCode) {
  if (rooms[roomCode]) {
    rooms[roomCode] = createGameState();
    return { message: "Game has been reset." };
  }
  return { error: "Room not found." };
}

function getStatus(roomCode) {
  const room = rooms[roomCode];
  return room || { error: "Room not found." };
}

module.exports = {
  createRoom,
  joinGame,
  startRound,
  passCard,
  declareCarré,
  jeCoupe,
  setCharade,
  resetGame,
  getStatus,
};

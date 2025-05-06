// game.js
let gameState = {
  players: [],
  currentTurn: 0,
  teams: [[], []],
  charades: [],
  cards: [],
  roundActive: false,
  winner: null,
};

const generateCards = () =>
  ["A","B","C","D","E","F"].map(type => ({ type, value: Math.random() }));

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
  gameState.cards = gameState.players.map(() => generateCards());
  gameState.charades = ["Charade A","Charade B"];
  gameState.currentTurn = 0;
  return { message: "Round started", cards: gameState.cards };
}

function passCard(playerId, cardIndex) {
  if (!gameState.roundActive) return { error: "No active round." };
  const turn = gameState.currentTurn;
  if (gameState.players[turn].id !== playerId)
    return { error: "Not your turn." };
  const card = gameState.cards[turn].splice(cardIndex,1)[0];
  const enemy = (turn + 2) % 4;
  gameState.cards[enemy].push(card);
  gameState.currentTurn = (turn + 1) % 4;
  return { message: "Card passed", nextTurn: gameState.players[gameState.currentTurn].name };
}

function declareCarré(playerId, charade) {
  if (!gameState.roundActive) return { error: "No active round." };
  const idx = playerId - 1, cards = gameState.cards[idx];
  if (!cards.every(c=>c.type===cards[0].type))
    return { error: "You don’t have a Carré." };
  const teamIdx = gameState.players.findIndex(p=>p.id===playerId) < 2 ? 0 : 1;
  if (gameState.charades[teamIdx] !== charade)
    return { error: "Wrong charade." };
  gameState.roundActive = false;
  gameState.winner = gameState.players.find(p=>p.id===playerId);
  return { message: `${gameState.winner.name} wins!` };
}

function getStatus() {
  return gameState;
}

module.exports = { joinGame, startRound, passCard, declareCarré, getStatus };

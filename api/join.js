// api/join.js
const { joinGame } = require("../game");
export default function handler(req, res) {
  const { playerName } = req.body;
  res.json(joinGame(playerName));
}

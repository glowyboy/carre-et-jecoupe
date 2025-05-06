// api/pass-card.js
const { passCard } = require("../game");
export default (req, res) => {
  const { playerId, cardIndex } = req.body;
  res.json(passCard(playerId, cardIndex));
};

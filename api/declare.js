// api/declare.js
const { declareCarré } = require("../game");
export default (req, res) => {
  const { playerId, charade } = req.body;
  res.json(declareCarré(playerId, charade));
};

// api/start.js
const { startRound } = require("../game");
export default (req, res) => res.json(startRound());

// api/status.js
const { getStatus } = require("../game");
export default (req, res) => res.json(getStatus());

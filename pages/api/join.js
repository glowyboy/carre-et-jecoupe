import { joinGame } from '../../game';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { playerName } = req.body;
  res.json(joinGame(playerName));
}

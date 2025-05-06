import { declareCarré } from '../../game';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { playerId, charade } = req.body;
  const result = declareCarré(playerId, charade);
  if (result.error) return res.status(400).json(result);
  res.json(result);
}

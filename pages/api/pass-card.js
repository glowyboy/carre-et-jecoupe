import { passCard } from '../../game';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { playerId, cardIndex } = req.body;
  res.json(passCard(playerId, cardIndex));
}

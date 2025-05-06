import { setCharade } from '../../game';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { teamIndex, charade } = req.body;
  const result = setCharade(teamIndex, charade);
  if (result.error) return res.status(400).json(result);
  res.json(result);
}

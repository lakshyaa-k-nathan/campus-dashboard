import type { NextApiRequest, NextApiResponse } from 'next';
import classes from '../../data/raw/classes.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = (req.query.q as string || '').toLowerCase().trim();

  // If the query is empty, return an empty array
  if (!query) {
    return res.status(200).json([]);
  }

  // Split query into words for more flexible matching
  const queryWords = query.split(/\s+/);

  const filtered = classes
    .filter(cls => {
      const code = cls.code?.toLowerCase().replace(/\s+/g, '') || '';
      const name = cls.name?.toLowerCase() || '';

      // Check if every word in query is found in name or code
      return queryWords.every(word =>
        name.includes(word) || code.includes(word)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  res.status(200).json(filtered);
}

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  //   kyselyDb.with('oscar_nominated_movies', db =>
  //     db.selectFrom('oscars_nominations').select('movie_id').distinct().where('movie_id', '!=', null)
  //   );
  res.status(200).json({ message: 'sup' });
}

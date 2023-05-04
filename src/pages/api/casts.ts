import type { NextApiRequest, NextApiResponse } from 'next';
import { pick } from 'remeda';
import { db } from '~/db/db';

const getActors = () =>
  db.topActors(
    25,
    (actor) => pick(actor, ['id', 'name', 'profile_path']),
    (movie) => pick(movie, ['id', 'title', 'poster_path', 'release_date'])
  );

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ actors: ReturnType<typeof getActors> }>
) => {
  const actors = getActors();
  res.status(200).json({ actors });
};

export default handler;

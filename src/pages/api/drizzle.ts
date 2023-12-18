import { eq } from 'drizzle-orm';
import { type NextApiHandler } from 'next';
import { db } from '../../../drizzle/client';
import * as schema from '../../../drizzle/schema';

const handler: NextApiHandler = async (req, res) => {
  try {
    const response = await db.query.movies.findFirst({
      where: eq(schema.movies.title, 'Titanic'),
      with: {
        genres: { with: { genre: true } },
        actors: { with: { actor: true } },
        crew: { with: { crew: true } },
        keywords: { with: { keyword: true } },
        streamers: { with: { streamer: true } },
        productionCompanies: { with: { productionCompanies: true } },
        oscarsNominations: true,
      },
    });
    res.status(200).json({ data: 'hello', response });
  } catch (e) {
    console.error(e);
    res.status(400);
  }
};

export default handler;

import { type NextApiHandler } from 'next';
import { db } from '../../../drizzle/client';

const handler: NextApiHandler = async (req, res) => {
  try {
    // TODO: with isn't working
    const response = await db.query.movies.findFirst({
      with: { genres: { with: { genre: true } } },
    });
    res.status(200).json({ data: 'hello', response });
  } catch (e) {
    console.error(e);
    res.status(400);
  }
};

export default handler;

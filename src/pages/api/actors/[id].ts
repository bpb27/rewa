import { type NextApiHandler } from 'next';
import { z } from 'zod';
import { integer } from '~/utils/zschema';
import { getActor, type GetActorResponse } from '~/api/get-actor';

export type ApiGetActorResponse = GetActorResponse;

const paramsSchema = z.object({
  id: integer,
});

const handler: NextApiHandler<ApiGetActorResponse> = async (req, res) => {
  try {
    const params = paramsSchema.parse(req.query);
    const response = await getActor(params);
    res.status(200).json(response);
  } catch (e) {
    res.status(400);
  }
};

export default handler;

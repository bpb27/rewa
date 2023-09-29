import { type NextApiHandler } from 'next';
import { z } from 'zod';
import { getActor, type GetActorResponse } from '~/api/get-actor';
import { apiError } from '~/utils/format';
import { type ApiError } from '~/utils/general-types';
import { integer } from '~/utils/zschema';

export type ApiGetActorResponse = GetActorResponse;

const paramsSchema = z.object({
  id: integer,
});

const handler: NextApiHandler<ApiGetActorResponse | ApiError> = async (req, res) => {
  try {
    const params = paramsSchema.parse(req.query);
    const response = await getActor(params);
    res.status(200).json(response);
  } catch (e) {
    res.status(400).json(apiError('Failed to get actor', e));
  }
};

export default handler;

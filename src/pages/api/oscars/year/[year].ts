import { type NextApiHandler } from 'next';
import { z } from 'zod';
import { getOscarsByYear, type GetOscarsByYearResponse } from '~/api/get-oscars-by-year';
import { apiError } from '~/utils/format';
import { type ApiError } from '~/utils/general-types';
import { integer } from '~/utils/zschema';

export type ApiGetOscarsByYearParams = undefined;
export type ApiGetOscarsByYearResponse = GetOscarsByYearResponse;

const paramsSchema = z.object({
  year: integer,
});

const handler: NextApiHandler<ApiGetOscarsByYearResponse | ApiError> = async (req, res) => {
  try {
    const params = paramsSchema.parse(req.query);
    const response = await getOscarsByYear(params);
    res.status(200).json(response);
  } catch (e) {
    res.status(400).json(apiError('Failed to get year', e));
  }
};

export default handler;

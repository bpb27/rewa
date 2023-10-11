import { type NextApiHandler } from 'next';
import { getOscarCategories, type GetOscarCategoriesResponse } from '~/api/get-oscar-categories';
import { apiError } from '~/utils/format';
import { type ApiError } from '~/utils/general-types';

export type ApiGetOscarCategoriesParams = undefined;
export type ApiGetOscarCategoriesResponse = GetOscarCategoriesResponse;

const handler: NextApiHandler<ApiGetOscarCategoriesResponse | ApiError> = async (_req, res) => {
  try {
    const response = await getOscarCategories();
    res.status(200).json(response);
  } catch (e) {
    res.status(400).json(apiError('Failed to get oscar categories', e));
  }
};

export default handler;

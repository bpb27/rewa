import { kyselyDb } from '../../prisma/kysley';

export const getOscarCategories = async () => {
  return kyselyDb.selectFrom('oscars_categories').selectAll().execute();
};

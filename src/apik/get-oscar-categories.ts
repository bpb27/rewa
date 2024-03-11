import { kyselyDb } from '../../pg/db';

export const getOscarCategories = async () => {
  return kyselyDb.selectFrom('oscars_categories').selectAll().execute();
};

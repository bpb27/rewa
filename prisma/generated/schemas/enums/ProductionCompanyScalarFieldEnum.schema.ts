import { z } from 'zod';

export const ProductionCompanyScalarFieldEnumSchema = z.enum([
  'id',
  'logo_path',
  'name',
  'origin_country',
]);

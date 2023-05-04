import { z } from 'zod';

export const CrewScalarFieldEnumSchema = z.enum([
  'adult',
  'gender',
  'known_for_department',
  'name',
  'original_name',
  'popularity',
  'profile_path',
  'credit_id',
  'department',
  'job',
  'movie_id',
]);

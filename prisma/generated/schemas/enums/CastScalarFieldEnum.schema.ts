import { z } from 'zod';

export const CastScalarFieldEnumSchema = z.enum([
  'adult',
  'gender',
  'known_for_department',
  'name',
  'original_name',
  'popularity',
  'profile_path',
  'character',
  'credit_id',
  'order',
  'cast_id',
  'movie_id',
]);

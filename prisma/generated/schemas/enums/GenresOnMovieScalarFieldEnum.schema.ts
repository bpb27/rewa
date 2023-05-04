import { z } from 'zod';

export const GenresOnMovieScalarFieldEnumSchema = z.enum([
  'movieId',
  'genreId',
]);

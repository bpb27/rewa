import { useRouter } from 'next/router';
import { QpSchema } from '~/data/query-params';

export const useMovieMode = (): QpSchema['movieMode'] => {
  const { asPath } = useRouter();
  if (asPath.includes('/rewa')) return 'rewa';
  if (asPath.includes('/oscars')) return 'oscar';
  return 'any';
};

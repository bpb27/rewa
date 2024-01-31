import { useRouter } from 'next/router';
import { QpSchema } from '~/data/query-params';
import { NAV } from './nav-routes';

export const useMovieMode = (): QpSchema['movieMode'] => {
  const { asPath } = useRouter();
  if (asPath.includes(NAV.rewa.base)) return 'rewa';
  if (asPath.includes(NAV.oscar.base)) return 'oscar';
  return 'any';
};

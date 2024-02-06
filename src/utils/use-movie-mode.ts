import { useRouter } from 'next/router';
import { AppEnums } from './enums';
import { NAV } from './nav-routes';

export const useMovieMode = (): AppEnums['movieMode'] => {
  const { asPath } = useRouter();
  if (asPath.includes(NAV.rewa.base)) return 'rewa';
  if (asPath.includes(NAV.oscars.base)) return 'oscar';
  return 'any';
};

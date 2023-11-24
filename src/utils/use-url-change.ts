import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useUrlChange = (callback: (url: string) => void) => {
  const router = useRouter();
  useEffect(() => {
    callback(router.asPath);
  }, [router.asPath, callback]);
};

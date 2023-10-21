import { useEffect } from 'react';

type UseIsMobileProps = {
  onMobile: () => void;
  onDesktop: () => void;
};

export const useScreenSizeOnMount = ({ onMobile, onDesktop }: UseIsMobileProps) => {
  useEffect(() => {
    window.innerWidth <= 700 ? onMobile() : onDesktop();
  }, []);
};

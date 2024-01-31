import { useEffect, useState } from 'react';

export const useOverflowedOffScreen = (position: 'right' | 'left' | 'top' | 'bottom' = 'right') => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [offScreen, setOffScreen] = useState(false);

  useEffect(() => {
    const rightPosition = ref?.getBoundingClientRect()?.[position] || 0;
    setOffScreen(rightPosition > window.innerWidth);
  }, [ref, position]);

  return { offScreen, setOffScreenRef: setRef };
};

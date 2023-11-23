import { useEffect, useRef, useState } from 'react';

type Props = IntersectionObserverInit & { callback: () => void };

export const useVizSensor = ({ callback, root, rootMargin = '300px', threshold = 0.1 }: Props) => {
  const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          callback();
        }
      },
      { root, rootMargin, threshold }
    );

    const { current: currentObserver } = observer;
    if (elementRef) currentObserver.observe(elementRef);

    return () => currentObserver.disconnect();
  }, [elementRef, root, rootMargin, threshold, callback]);

  return setElementRef;
};

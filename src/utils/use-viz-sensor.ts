import { useEffect, RefObject, useRef } from 'react';

export const useVizSensor = (
  elementRef: RefObject<Element>,
  options: IntersectionObserverInit & { callback?: () => void }
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    const callback = options.callback ? options.callback : () => {};

    const observerOptions = { ...options };
    delete observerOptions.callback;

    observer.current = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        callback();
      }
    }, observerOptions);

    const { current: currentObserver } = observer;
    if (elementRef.current) currentObserver.observe(elementRef.current);

    return () => currentObserver.disconnect();
  }, [elementRef, options]);
};

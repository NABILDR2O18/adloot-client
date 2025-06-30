
import { useState, useEffect, RefObject } from 'react';

interface InViewOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export function useInView(
  elementRef: RefObject<Element>,
  options: InViewOptions = {}
): boolean {
  const [isInView, setIsInView] = useState(false);
  const { root = null, rootMargin = '0px', threshold = 0, once = false } = options;

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementInView = entry.isIntersecting;
        setIsInView(isElementInView);
        
        // If "once" is true and the element is in view, disconnect the observer
        if (isElementInView && once && observer) {
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );
    
    observer.observe(element);
    
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [elementRef, root, rootMargin, threshold, once]);

  return isInView;
}

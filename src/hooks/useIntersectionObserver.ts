import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [
  React.RefObject<HTMLElement>,
  boolean,
  IntersectionObserverEntry | undefined
] {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false
  } = options;
  
  const elementRef = useRef<HTMLElement>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  
  const isIntersecting = entry?.isIntersecting ?? false;
  const hasBeenVisible = useRef(false);
  
  useEffect(() => {
    const element = elementRef.current;
    
    if (!element || (freezeOnceVisible && hasBeenVisible.current)) {
      return;
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        
        if (entry.isIntersecting) {
          hasBeenVisible.current = true;
        }
        
        // If freezeOnceVisible is true and element is visible, disconnect
        if (freezeOnceVisible && entry.isIntersecting) {
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);
  
  return [elementRef, isIntersecting, entry];
}
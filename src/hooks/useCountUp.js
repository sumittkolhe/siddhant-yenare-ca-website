import { useState, useEffect, useRef } from 'react';

export function useCountUp(target, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!shouldStart) return;

    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(startValue + (target - startValue) * eased);

      setCount(currentCount);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, duration, shouldStart]);

  return count;
}

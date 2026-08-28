import { useEffect, useRef, useState } from 'react';

/**
 * CountUp — Animated number counter that triggers when scrolled into view.
 * Supports prefers-reduced-motion.
 */
export default function CountUp({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  separator = ',',
  decimals = 0,
  className = '',
  style = {},
}) {
  const ref = useRef(null);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [count, setCount] = useState(prefersReducedMotion ? end : 0);
  const [hasStarted, setHasStarted] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted, prefersReducedMotion, end]);

  useEffect(() => {
    if (!hasStarted || prefersReducedMotion) return;

    const startTime = performance.now();
    const startVal = 0;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for decelerating feel
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (end - startVal) * eased);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [hasStarted, end, duration, prefersReducedMotion]);

  const formatNumber = (num) => {
    const fixed = num.toFixed(decimals);
    const [whole, dec] = fixed.split('.');
    const withSep = whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return dec ? `${withSep}.${dec}` : withSep;
  };

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}

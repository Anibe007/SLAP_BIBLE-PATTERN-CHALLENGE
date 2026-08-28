import { useEffect, useRef, useState } from 'react';

/**
 * AnimateOnScroll — Intersection Observer wrapper that triggers CSS animation
 * when the element scrolls into the viewport. Supports prefers-reduced-motion.
 */
export default function AnimateOnScroll({
  children,
  animation = 'fadeUp',
  delay = 0,
  threshold = 0.15,
  duration = 700,
  className = '',
  style = {},
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el); // Only animate once
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, prefersReducedMotion]);

  const animationMap = {
    fadeUp: { from: { opacity: 0, transform: 'translateY(40px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
    fadeDown: { from: { opacity: 0, transform: 'translateY(-30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
    fadeLeft: { from: { opacity: 0, transform: 'translateX(-40px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
    fadeRight: { from: { opacity: 0, transform: 'translateX(40px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
    scaleIn: { from: { opacity: 0, transform: 'scale(0.92)' }, to: { opacity: 1, transform: 'scale(1)' } },
    fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
  };

  const anim = animationMap[animation] || animationMap.fadeUp;

  if (prefersReducedMotion) {
    return (
      <Tag ref={ref} className={className} style={style} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        ...(isVisible ? anim.to : anim.from),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

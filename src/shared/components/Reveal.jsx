import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-reveal wrapper. Fades + slides children in the first time
 * they enter the viewport. Zero dependencies (IntersectionObserver).
 *
 * Usage:
 *   <Reveal><HeroSection /></Reveal>
 *   <Reveal delay={120} y={36} className="...">...</Reveal>
 */
export default function Reveal({
  as: Tag = 'div',
  children,
  delay = 0,
  y = 28,
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
    );
    io.observe(el);
    const fallback = setTimeout(() => setVisible(true), 900);
    return () => {
      clearTimeout(fallback);
      io.disconnect();
    };
  }, []);

  const { style, ...passthrough } = rest;

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--reveal-delay': `${delay}ms`, '--reveal-y': `${y}px`, ...style }}
      {...passthrough}
    >
      {children}
    </Tag>
  );
}

/**
 * Stagger cascade wrapper. Direct children fade/slide in one after another
 * with zero per-child wiring. Ideal for card grids:
 *
 *   <RevealGroup className="grid gap-6 sm:grid-cols-3">
 *     {items.map(...)}
 *   </RevealGroup>
 */
export function RevealGroup({ children, className = '', ...rest }) {
  return (
    <Reveal className={`reveal-group${className ? ` ${className}` : ''}`} {...rest}>
      {children}
    </Reveal>
  );
}

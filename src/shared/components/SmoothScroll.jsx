import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

let lenisInstance = null;

export function getLenis() {
  return lenisInstance;
}

export function scrollToTop(immediate = true) {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate });
  } else {
    window.scrollTo(0, 0);
  }
}

/**
 * Global smooth-scroll provider (Lenis).
 * - Butter-smooth wheel scrolling, disabled automatically for
 *   users who prefer reduced motion.
 * - Scrolls to top on every route change.
 * - Smooth-scrolls in-page anchor links (a[href^="#"]).
 */
export default function SmoothScroll({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisInstance = lenis;

    let rafId = 0;
    const loop = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const onClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', onClick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    scrollToTop(true);
  }, [pathname]);

  return children;
}

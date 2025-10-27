import { ReactNode, useRef, useState, useEffect, KeyboardEvent } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import styles from '../styles/SwipeContainer.module.css';

interface SwipeContainerProps {
  children: ReactNode[];
  /** aria-label for the group of slides */
  ariaLabel?: string;
}

/**
 * Generic horizontal swipe container for full-width slides.
 *
 * – Touch & mouse drag (Framer Motion drag="x")
 * – Keyboard navigation (←/→)
 * – Accessible via aria-live + aria-roledescription
 * – Smooth inertia animation & snapping
 */
export default function SwipeContainer({ children, ariaLabel }: SwipeContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); // current offset
  const [index, setIndex] = useState(0);
  const slideCount = children.length;

  // Calculate width after mount to constrain dragging
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef]);

  // Snap to closest slide after drag end
  function handleDragEnd(_: any, info: { offset: { x: number } }) {
    const delta = info.offset.x;
    const raw = -x.get() + delta; // dragged position
    const newIndex = Math.round(raw / width);
    goTo(newIndex);
  }

  function clamp(val: number) {
    return Math.max(0, Math.min(val, slideCount - 1));
  }

  function goTo(targetIdx: number) {
    const clamped = clamp(targetIdx);
    setIndex(clamped);
    const targetX = -clamped * width;
    animate(x, targetX, { type: 'spring', stiffness: 260, damping: 30 });
  }

  // Keyboard navigation
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight') {
      goTo(index + 1);
    } else if (e.key === 'ArrowLeft') {
      goTo(index - 1);
    }
  }

  // When window resizes update width and position
  useEffect(() => {
    const handler = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setWidth(w);
        animate(x, -index * w, { type: 'spring', stiffness: 260, damping: 30 });
      }
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [index, x]);

  return (
    <div
      className={styles.wrapper}
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <motion.div
        className={styles.slider}
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -(slideCount - 1) * width, right: 0 }}
        onDragEnd={handleDragEnd}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`Страница ${i + 1} из ${slideCount}`}
          >
            {child}
          </div>
        ))}
      </motion.div>
      {/* Progress Indicator */}
      <div className={styles.progressBar} aria-hidden="true">
        <span
          className={styles.progressThumb}
          style={{ width: `${100 / slideCount}%`, transform: `translateX(${index * 100}%)` }}
        />
      </div>
    </div>
  );
}
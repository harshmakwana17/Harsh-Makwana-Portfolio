import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);
  const topHalfRef = useRef(null);
  const bottomHalfRef = useRef(null);
  const counterRef = useRef(null);
  const labelRef = useRef(null);
  const crescentRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Crescent moon scale in
      tl.fromTo(
        crescentRef.current,
        { scale: 0, rotation: -45, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 0.3, duration: 1, ease: 'back.out(1.4)' }
      );

      // Label reveal
      tl.fromTo(
        labelRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.5'
      );

      // Counter reveal
      tl.fromTo(
        counterRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );

      // Counter increment
      const counter = { value: 0 };
      tl.to(counter, {
        value: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          const val = Math.floor(counter.value);
          setCount(val);
        },
      });

      // Crescent slow rotation during count
      tl.to(
        crescentRef.current,
        { rotation: 15, duration: 2.2, ease: 'power1.inOut' },
        '-=2.2'
      );

      // Pause at 100%
      tl.to({}, { duration: 0.4 });

      // Exit: split curtain — top half goes up, bottom half goes down
      tl.to(counterRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in',
      });

      tl.to(
        labelRef.current,
        { y: -20, opacity: 0, duration: 0.3, ease: 'power3.in' },
        '-=0.3'
      );

      tl.to(
        crescentRef.current,
        { scale: 1.5, opacity: 0, duration: 0.5, ease: 'power2.in' },
        '-=0.2'
      );

      tl.to(topHalfRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
      });

      tl.to(
        bottomHalfRef.current,
        {
          yPercent: 100,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => onComplete?.(),
        },
        '-=0.8'
      );
    }, preloaderRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={preloaderRef} className="preloader">
      {/* Top half */}
      <div ref={topHalfRef} className="preloader__half preloader__half--top">
        <div className="preloader__half-inner" />
      </div>

      {/* Bottom half */}
      <div ref={bottomHalfRef} className="preloader__half preloader__half--bottom">
        <div className="preloader__half-inner" />
      </div>

      {/* Crescent moon shape */}
      <div ref={crescentRef} className="preloader__crescent" />

      {/* Content layer */}
      <div className="preloader__content">
        <div ref={labelRef} className="preloader__label">
          HARSH MAKWANA
        </div>
        <div ref={counterRef} className="preloader__counter">
          {count}<span className="preloader__percent">%</span>
        </div>
      </div>
    </div>
  );
}

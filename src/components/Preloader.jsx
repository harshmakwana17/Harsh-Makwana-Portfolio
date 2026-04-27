// import { useEffect, useRef, useState } from 'react';
// import gsap from 'gsap';

// export default function Preloader({ onComplete }) {
//   const preloaderRef = useRef(null);
//   const topHalfRef = useRef(null);
//   const bottomHalfRef = useRef(null);
//   const counterRef = useRef(null);
//   const labelRef = useRef(null);
//   const crescentRef = useRef(null);
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline();

//       // Crescent moon scale in
//       tl.fromTo(
//         crescentRef.current,
//         { scale: 0, rotation: -45, opacity: 0 },
//         { scale: 1, rotation: 0, opacity: 0.3, duration: 1, ease: 'back.out(1.4)' }
//       );

//       // Label reveal
//       tl.fromTo(
//         labelRef.current,
//         { y: 30, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
//         '-=0.5'
//       );

//       // Counter reveal
//       tl.fromTo(
//         counterRef.current,
//         { y: 50, opacity: 0 },
//         { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
//         '-=0.4'
//       );

//       // Counter increment
//       const counter = { value: 0 };
//       tl.to(counter, {
//         value: 100,
//         duration: 2.2,
//         ease: 'power2.inOut',
//         onUpdate: () => {
//           const val = Math.floor(counter.value);
//           setCount(val);
//         },
//       });

//       // Crescent slow rotation during count
//       tl.to(
//         crescentRef.current,
//         { rotation: 15, duration: 2.2, ease: 'power1.inOut' },
//         '-=2.2'
//       );

//       // Pause at 100%
//       tl.to({}, { duration: 0.4 });

//       // Exit: split curtain — top half goes up, bottom half goes down
//       tl.to(counterRef.current, {
//         y: -40,
//         opacity: 0,
//         duration: 0.4,
//         ease: 'power3.in',
//       });

//       tl.to(
//         labelRef.current,
//         { y: -20, opacity: 0, duration: 0.3, ease: 'power3.in' },
//         '-=0.3'
//       );

//       tl.to(
//         crescentRef.current,
//         { scale: 1.5, opacity: 0, duration: 0.5, ease: 'power2.in' },
//         '-=0.2'
//       );

//       tl.to(topHalfRef.current, {
//         yPercent: -100,
//         duration: 0.8,
//         ease: 'power4.inOut',
//       });

//       tl.to(
//         bottomHalfRef.current,
//         {
//           yPercent: 100,
//           duration: 0.8,
//           ease: 'power4.inOut',
//           onComplete: () => onComplete?.(),
//         },
//         '-=0.8'
//       );
//     }, preloaderRef);

//     return () => ctx.revert();
//   }, [onComplete]);

//   return (
//     <div ref={preloaderRef} className="preloader">
//       {/* Top half */}
//       <div ref={topHalfRef} className="preloader__half preloader__half--top">
//         <div className="preloader__half-inner" />
//       </div>

//       {/* Bottom half */}
//       <div ref={bottomHalfRef} className="preloader__half preloader__half--bottom">
//         <div className="preloader__half-inner" />
//       </div>

//       {/* Crescent moon shape */}
//       <div ref={crescentRef} className="preloader__crescent" />

//       {/* Content layer */}
//       <div className="preloader__content">
//         <div ref={labelRef} className="preloader__label">
//           HARSH MAKWANA
//         </div>
//         <div ref={counterRef} className="preloader__counter">
//           {count}<span className="preloader__percent">%</span>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const wrapperRef  = useRef(null);
  const circle1Ref  = useRef(null);
  const circle2Ref  = useRef(null);
  const circle3Ref  = useRef(null);
  const circle4Ref  = useRef(null);
  const enterRef    = useRef(null);
  const enterBgRef  = useRef(null);
  const startTLRef  = useRef(null);

  // Keep hover listeners as refs so we can remove them on click
  const hoverInRef  = useRef(null);
  const hoverOutRef = useRef(null);

  const getCircles = () => [
    circle1Ref.current,
    circle2Ref.current,
    circle3Ref.current,
    circle4Ref.current,
  ];

  useEffect(() => {
    const circles = getCircles();

    // ── Setup ────────────────────────────────────────────────────────────────
    // transformOrigin '50% 50%' works for SVG text elements rotating around
    // the SVG center — matches the original demo-2 intro.js exactly
    gsap.set(circles, { transformOrigin: '50% 50%', opacity: 0, scale: 0.8 });
    gsap.set(enterRef.current, { opacity: 0, scale: 0.8, pointerEvents: 'none' });

    // ── Start timeline (mirrors intro.js → start()) ───────────────────────
    startTLRef.current = gsap.timeline()
      // Alternate rotation: even index rotates +90, odd -90
      .to(circles, {
        duration: 3,
        ease: 'expo.inOut',
        rotation: (i) => (i % 2 === 0 ? 90 : -90),
        stagger: { amount: 0.4 },
      }, 0)
      // Fade + scale in — circles + enter button together
      .to([...circles, enterRef.current], {
        duration: 3,
        ease: 'expo.inOut',
        opacity: 1,
        scale: 1,
        stagger: { amount: 0.4 },
      }, 0)
      // Enable hover only after 2s
      .add(() => {
        gsap.set(enterRef.current, { pointerEvents: 'auto' });
        bindHover();
      }, 2);

    return () => startTLRef.current?.kill();
  }, []);

  // ── Hover (mirrors initEvents) ────────────────────────────────────────────
  const bindHover = () => {
    const btn = enterRef.current;

    hoverInRef.current = () => {
      const circles = getCircles();
      gsap.killTweensOf([enterBgRef.current, ...circles]);

      gsap.to(enterBgRef.current, {
        duration: 1,
        ease: 'expo',
        scale: 1.4,
      });
      gsap.to(circles, {
        duration: 1,
        ease: 'expo',
        scale: 1.15,
        // alternate direction per circle — exact demo-2 behaviour
        rotation: (i) => (i % 2 ? '-=90' : '+=90'),
        opacity: 0.4,
      });
    };

    hoverOutRef.current = () => {
      const circles = getCircles();
      gsap.to(enterBgRef.current, {
        duration: 1,
        ease: 'expo',
        scale: 1,
      });
      gsap.to(circles, {
        duration: 1,
        ease: 'expo',
        scale: 1,
        rotation: (i) => (i % 2 ? '+=120' : '-=120'),
        opacity: 1,
        stagger: { amount: -0.2 },
      });
    };

    btn.addEventListener('mouseenter', hoverInRef.current);
    btn.addEventListener('mouseleave', hoverOutRef.current);
  };

  const unbindHover = () => {
    const btn = enterRef.current;
    if (hoverInRef.current)  btn.removeEventListener('mouseenter', hoverInRef.current);
    if (hoverOutRef.current) btn.removeEventListener('mouseleave', hoverOutRef.current);
  };

  // ── Enter click (mirrors intro.js → enter()) ──────────────────────────────
  const handleEnterClick = () => {
    const circles = getCircles();
    startTLRef.current?.kill();
    unbindHover();
    gsap.set(enterRef.current, { pointerEvents: 'none' });

    gsap.timeline()
      // Button shrinks away
      .to(enterRef.current, {
        duration: 0.6,
        ease: 'back.in',
        scale: 0.2,
        opacity: 0,
      }, 0)
      // Circles collapse to center (scale: 0) — demo-2 exact
      .to(circles, {
        duration: 0.8,
        ease: 'back.in',
        scale: 0,
        opacity: 0,
        stagger: { amount: -0.4 },
      }, 0)
      // Fade out wrapper then hand off
      .to(wrapperRef.current, {
        duration: 0.4,
        opacity: 0,
        ease: 'power2.inOut',
      }, 0.7)
      .add(() => onComplete?.(), 1.0);
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0d0d10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gold glow behind button */}
      <div
        style={{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Circular SVG ──────────────────────────────────────────────────────
          viewBox 1400×1400 — font-size in SVG user units (not css px)
          textLength fills full circumference per circle:
            c1 r=450.5 → 2πr ≈ 2830
            c2 r=318.5 → 2πr ≈ 2001
            c3 r=213.5 → 2πr ≈ 1341
            c4 r=133   → 2πr ≈  836
      ──────────────────────────────────────────────────────────────────────── */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1400 1400"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '190vmin',
          height: '190vmin',
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        <defs>
          <path
            id="c1"
            d="M250,700.5 A450.5,450.5 0 1 1 1151,700.5 A450.5,450.5 0 1 1 250,700.5"
          />
          <path
            id="c2"
            d="M382,700.5 A318.5,318.5 0 1 1 1019,700.5 A318.5,318.5 0 1 1 382,700.5"
          />
          <path
            id="c3"
            d="M487,700.5 A213.5,213.5 0 1 1 914,700.5 A213.5,213.5 0 1 1 487,700.5"
          />
          <path
            id="c4"
            d="M567.5,700.5 A133,133 0 1 1 833.5,700.5 A133,133 0 1 1 567.5,700.5"
          />
        </defs>

        {/* Circle 1 — outermost — portfolio identity */}
        <text
          ref={circle1Ref}
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="80"
          fontWeight="300"
          fill="#c9a96e"
          letterSpacing="2"
        >
          <textPath href="#c1" textLength="2830" lengthAdjust="spacing">
            Harsh Makwana · Portfolio · Coming Soon · Webflow Developer ·{' '}
          </textPath>
        </text>

        {/* Circle 2 — skills (italic) */}
        <text
          ref={circle2Ref}
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="60"
          fontWeight="400"
          fontStyle="italic"
          fill="#a08550"
          letterSpacing="2"
        >
          <textPath href="#c2" textLength="2001" lengthAdjust="spacing">
            GSAP · Webflow CMS · WordPress · ScrollTrigger ·{' '}
          </textPath>
        </text>

        {/* Circle 3 — location */}
        <text
          ref={circle3Ref}
          fontFamily="'Inter', -apple-system, sans-serif"
          fontSize="44"
          fontWeight="300"
          fill="#6b5535"
          letterSpacing="5"
        >
          <textPath href="#c3" textLength="1341" lengthAdjust="spacing">
            Jamnagar · Gujarat · India ·{' '}
          </textPath>
        </text>

        {/* Circle 4 — innermost — year + role */}
        <text
          ref={circle4Ref}
          fontFamily="'Inter', -apple-system, sans-serif"
          fontSize="30"
          fontWeight="400"
          fill="#3f2e18"
          letterSpacing="7"
        >
          <textPath href="#c4" textLength="836" lengthAdjust="spacing">
            2025 · Frontend Animator ·{' '}
          </textPath>
        </text>
      </svg>

      {/* ── Enter Button ── */}
      <button
        ref={enterRef}
        onClick={handleEnterClick}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '96px',
          height: '96px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: 0,
          opacity: 0,
        }}
      >
        {/* Gold circle */}
        <div
          ref={enterBgRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c9a96e 0%, #a08050 100%)',
            transformOrigin: 'center',
          }}
        />
        <span
          style={{
            position: 'relative',
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#0d0d10',
          }}
        >
          Enter
        </span>
      </button>
    </div>
  );
}
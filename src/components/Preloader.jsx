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

/*
  FONTS: Typekit kit kxo3pgz — same as original index3.html
  Add to your index.html <head>:
    <link rel="stylesheet" href="https://use.typekit.net/kxo3pgz.css">

  Circle font map (exact original):
    c1 → ivymode,          sans-serif  weight 300
    c2 → modesto-condensed, serif      weight 400
    c3 → minerva-modern,   sans-serif  weight 400
    c4 → niagara,          serif       weight 300
*/

export default function Preloader({ onComplete }) {
  const wrapperRef  = useRef(null);
  const circle1Ref  = useRef(null);
  const circle2Ref  = useRef(null);
  const circle3Ref  = useRef(null);
  const circle4Ref  = useRef(null);
  const enterRef    = useRef(null);
  const enterBgRef  = useRef(null);
  const startTLRef  = useRef(null);
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

    // setup()
    gsap.set(circles, { transformOrigin: '50% 50%', opacity: 0, scale: 0.8 });
    gsap.set(enterRef.current, { opacity: 0, scale: 0.8, pointerEvents: 'none' });

    // start() — exact index3
    startTLRef.current = gsap.timeline()
      .addLabel('start', 0)
      .to(circles, {
        duration: 3,
        ease: 'expo.inOut',
        rotation: 90,
        stagger: { amount: 0.4 },
      }, 'start')
      .to([...circles, enterRef.current], {
        duration: 3,
        ease: 'expo.inOut',
        startAt: { opacity: 0, scale: 0.8 },
        scale: 1,
        opacity: 1,
        stagger: { amount: 0.4 },
      }, 'start')
      .add(() => {
        gsap.set(enterRef.current, { pointerEvents: 'auto' });
        bindHover();
      }, 'start+=2');

    return () => startTLRef.current?.kill();
  }, []);

  const bindHover = () => {
    const btn = enterRef.current;

    // mouseenter — exact index3
    hoverInRef.current = () => {
      const circles = getCircles();
      gsap.killTweensOf([enterBgRef.current, ...circles]);
      gsap.to(enterBgRef.current, {
        duration: 1.3,
        ease: 'expo',
        scale: 1.4,
      });
      gsap.to(circles, {
        duration: 0.5,
        ease: 'expo',
        rotation: '+=120',
        scale: 0.5,
        opacity: 0.2,
        stagger: { amount: -0.15 },
      });
    };

    // mouseleave — exact index3 (no killTweensOf)
    hoverOutRef.current = () => {
      const circles = getCircles();
      gsap.to(enterBgRef.current, {
        duration: 2,
        ease: 'elastic.out(1, 0.4)',
        scale: 1,
      });
      gsap.to(circles, {
        duration: 2,
        ease: 'elastic.out(1, 0.4)',
        scale: 1,
        rotation: '-=120',
        opacity: 1,
        stagger: { amount: 0.15 },
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

  // enter() — exact index3
  const handleEnterClick = () => {
    const circles = getCircles();
    startTLRef.current?.kill();
    unbindHover();
    gsap.set(enterRef.current, { pointerEvents: 'none' });

    gsap.timeline()
      .addLabel('start', 0)
      .to(enterRef.current, {
        duration: 0.6,
        ease: 'back.in',
        scale: 0.2,
        opacity: 0,
      }, 'start')
      .to(circles, {
        duration: 0.8,
        ease: 'back.in',
        scale: 1.6,
        opacity: 0,
        rotation: '-=20',
        stagger: { amount: 0.3 },
      }, 'start')
      .to(wrapperRef.current, {
        duration: 0.3,
        opacity: 0,
        ease: 'power2.inOut',
      }, 'start+=0.65')
      .add(() => onComplete?.(), 'start+=0.9');
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#08080a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glow behind button */}
      <div
        style={{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Circular SVG ───────────────────────────────────────────────────
          viewBox 1400×1400 | width 186vmin = original --dim
          font-size in SVG user units:
            c1 ivymode        300 → 180u  (clamp 170-180px)
            c2 modesto-condensed 400 → 153u  (clamp 136-153px)
            c3 minerva-modern 400 → 120u  (clamp 110-120px)
            c4 niagara        300 →  94u  (clamp 85-94px)
          textLength = 2πr:
            c1 r=450.5→2830  c2 r=318.5→2001
            c3 r=213.5→1341  c4 r=133→836
      ─────────────────────────────────────────────────────────────────── */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1400 1400"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '186vmin',
          height: '186vmin',
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        <defs>
          <path id="c1" d="M250,700.5 A450.5,450.5 0 1 1 1151,700.5 A450.5,450.5 0 1 1 250,700.5" />
          <path id="c2" d="M382,700.5 A318.5,318.5 0 1 1 1019,700.5 A318.5,318.5 0 1 1 382,700.5" />
          <path id="c3" d="M487,700.5 A213.5,213.5 0 1 1 914,700.5 A213.5,213.5 0 1 1 487,700.5" />
          <path id="c4" d="M567.5,700.5 A133,133 0 1 1 833.5,700.5 A133,133 0 1 1 567.5,700.5" />
        </defs>

        {/* c1 — ivymode, sans-serif, weight 300 */}
        <text
          ref={circle1Ref}
          fontFamily="ivymode, sans-serif"
          fontSize="180"
          fontWeight="300"
          fill="#7a7168"
          letterSpacing="-2"
        >
          <textPath href="#c1" textLength="2830" lengthAdjust="spacingAndGlyphs">
            HARSH MAKWANA · PORTFOLIO · COMING SOON · WEBFLOW ·
          </textPath>
        </text>

        {/* c2 — modesto-condensed, serif, weight 400 */}
        <text
          ref={circle2Ref}
          fontFamily="modesto-condensed, serif"
          fontSize="153"
          fontWeight="400"
          fill="#6e6560"
          letterSpacing="-2"
        >
          <textPath href="#c2" textLength="2001" lengthAdjust="spacingAndGlyphs">
            GSAP · WEBFLOW CMS · WORDPRESS · SCROLLTRIGGER ·
          </textPath>
        </text>

        {/* c3 — minerva-modern, sans-serif, weight 400 */}
        <text
          ref={circle3Ref}
          fontFamily="minerva-modern, sans-serif"
          fontSize="120"
          fontWeight="400"
          fill="#5c5650"
          letterSpacing="-2"
        >
          <textPath href="#c3" textLength="1341" lengthAdjust="spacingAndGlyphs">
            JAMNAGAR · GUJARAT · INDIA ·
          </textPath>
        </text>

        {/* c4 — niagara, serif, weight 300 */}
        <text
          ref={circle4Ref}
          fontFamily="niagara, serif"
          fontSize="94"
          fontWeight="300"
          fill="#4a4440"
          letterSpacing="-2"
        >
          <textPath href="#c4" textLength="836" lengthAdjust="spacingAndGlyphs">
            ANIMATOR · 2026 ·
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
          width: '90px',
          height: '90px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: 0,
          opacity: 0,
        }}
      >
        <div
          ref={enterBgRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: '#d6ae7c',
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
            color: '#1d1812',
          }}
        >
          Enter
        </span>
      </button>
    </div>
  );
}
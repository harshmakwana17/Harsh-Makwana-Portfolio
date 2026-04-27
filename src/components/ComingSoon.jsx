import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ComingSoon() {
  const containerRef = useRef(null);
  const blobsRef = useRef([]);
  const badgeRef = useRef(null);
  const headingCharsRef = useRef([]);
  const soonCharsRef = useRef([]);
  const subtitleRef = useRef(null);
  const socialsRef = useRef([]);
  const dividersRef = useRef([]);

  const handleSocialMouseMove = (e, el) => {
    if (!el) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.35;
    const y = (clientY - (top + height / 2)) * 0.35;
    gsap.to(el, {
      x,
      y,
      duration: 0.8,
      ease: 'power3.out',
    });
  };

  const handleSocialMouseLeave = (el) => {
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  useEffect(() => {
    let mouseMoveHandler;

    const ctx = gsap.context(() => {
      // --- Blobs smooth float animation (no jumping) ---
      blobsRef.current.forEach((blob, i) => {
        if (!blob) return;

        // Fade in blobs
        gsap.to(blob, {
          opacity: 0.6,
          duration: 2,
          delay: 0.3 + i * 0.15,
          ease: 'power2.out',
        });

        // Smooth continuous floating — separate x and y for organic feel
        gsap.to(blob, {
          keyframes: [
            { x: 15, y: -20, duration: 8 },
            { x: -10, y: 15, duration: 7 },
            { x: 20, y: 10, duration: 9 },
            { x: -15, y: -10, duration: 8 },
            { x: 0, y: 0, duration: 7 },
          ],
          repeat: -1,
          ease: 'sine.inOut',
          delay: i * 1.5,
        });

        // Slow scale breathing
        gsap.to(blob, {
          scale: 1.08,
          duration: 6 + i * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.8,
        });
      });

      // --- Mouse parallax (smooth, no overwrite conflicts) ---
      mouseMoveHandler = (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = (clientX - centerX) / centerX;
        const deltaY = (clientY - centerY) / centerY;

        blobsRef.current.forEach((blob, i) => {
          if (!blob) return;
          const speed = (i + 1) * 12;
          gsap.to(blob, {
            x: `+=${deltaX * speed * 0.05}`,
            y: `+=${deltaY * speed * 0.05}`,
            duration: 2,
            ease: 'power3.out',
            overwrite: false,
          });
        });
      };

      window.addEventListener('mousemove', mouseMoveHandler);

      // --- Content reveal animations ---
      const revealTl = gsap.timeline({ delay: 0.3 });

      // Badge
      revealTl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      // "Coming" — split mask reveal per character
      const comingChars = headingCharsRef.current.filter(Boolean);
      revealTl.fromTo(
        comingChars,
        {
          yPercent: 120,
          opacity: 0,
          rotationX: -40,
        },
        {
          yPercent: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.9,
          stagger: 0.04,
          ease: 'power4.out',
        },
        '-=0.3'
      );

      // "Soon" — split mask reveal per character with slight delay
      const soonChars = soonCharsRef.current.filter(Boolean);
      revealTl.fromTo(
        soonChars,
        {
          yPercent: 120,
          opacity: 0,
          rotationX: -40,
        },
        {
          yPercent: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.9,
          stagger: 0.05,
          ease: 'power4.out',
        },
        '-=0.5'
      );

      // Subtitle
      revealTl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      );

      // Social links — Enhanced Premium Reveal (Blur + Scale + Y)
      const socialEls = socialsRef.current.filter(Boolean);
      revealTl.fromTo(
        socialEls,
        { 
          opacity: 0, 
          y: 40,
          scale: 0.9,
          filter: 'blur(10px)'
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          stagger: 0.12,
          ease: 'power4.out',
        },
        '-=0.6'
      );

      // Dividers
      const dividerEls = dividersRef.current.filter(Boolean);
      revealTl.fromTo(
        dividerEls,
        { opacity: 0, scaleY: 0 },
        { opacity: 1, scaleY: 1, duration: 0.4, stagger: 0.08 },
        '-=0.4'
      );
    }, containerRef);

    return () => {
      if (mouseMoveHandler) {
        window.removeEventListener('mousemove', mouseMoveHandler);
      }
      ctx.revert();
    };
  }, []);

  const comingText = 'Coming';
  const soonText = 'Soon';

  return (
    <div ref={containerRef}>
      {/* Grain */}
      <div className="grain-overlay" />

      {/* Vignette */}
      <div className="vignette" />

      {/* Blobs */}
      <div className="blobs-container">
        <div ref={(el) => (blobsRef.current[0] = el)} className="blob blob--1" />
        <div ref={(el) => (blobsRef.current[1] = el)} className="blob blob--2" />
        <div ref={(el) => (blobsRef.current[2] = el)} className="blob blob--3" />
        <div ref={(el) => (blobsRef.current[3] = el)} className="blob blob--4" />
      </div>

      {/* Content */}
      <main className="coming-soon">
        {/* Badge */}
        <div ref={badgeRef} className="badge">
          <span className="badge__dot" />
          <span className="badge__text">In Progress</span>
        </div>

        {/* Heading */}
        <h1 className="heading">
          <span className="heading__line">
            {comingText.split('').map((char, i) => (
              <span
                key={`c-${i}`}
                ref={(el) => (headingCharsRef.current[i] = el)}
                className="heading__char"
              >
                {char}
              </span>
            ))}
          </span>
          <span className="heading__char">&nbsp;</span>
          <span className="heading__line heading__line--soon">
            {soonText.split('').map((char, i) => (
              <span
                key={`s-${i}`}
                ref={(el) => (soonCharsRef.current[i] = el)}
                className="heading__char heading__char--italic"
              >
                {char}
              </span>
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <p ref={subtitleRef} className="subtitle">
          Something new is being crafted
        </p>

        {/* Social Links */}
        <div className="socials">
          <a
            ref={(el) => (socialsRef.current[0] = el)}
            onMouseMove={(e) => handleSocialMouseMove(e, socialsRef.current[0])}
            onMouseLeave={() => handleSocialMouseLeave(socialsRef.current[0])}
            href="https://webflow.com/@harshmakwana"
            target="_blank"
            rel="noopener noreferrer"
            className="socials__link"
          >
            <svg viewBox="0 0 1080 674" xmlns="http://www.w3.org/2000/svg">
              <path d="M1080 0L735.386 673.684H411.695L555.916 394.481H549.445C430.464 548.934 252.942 650.61 -0.000488281 673.684V398.344C-0.000488281 398.344 161.813 388.787 256.938 288.776H-0.000488281V0.0053214H288.771V237.515L295.252 237.489L413.254 0.0053214H631.644V236.009L638.126 235.999L760.555 0H1080Z" />
            </svg>
            <span>Webflow</span>
          </a>

          <div ref={(el) => (dividersRef.current[0] = el)} className="socials__divider" />

          <a
            ref={(el) => (socialsRef.current[1] = el)}
            onMouseMove={(e) => handleSocialMouseMove(e, socialsRef.current[1])}
            onMouseLeave={() => handleSocialMouseLeave(socialsRef.current[1])}
            href="https://www.linkedin.com/in/harsh-makwana174/"
            target="_blank"
            rel="noopener noreferrer"
            className="socials__link"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span>LinkedIn</span>
          </a>

          <div ref={(el) => (dividersRef.current[1] = el)} className="socials__divider" />

          <a
            ref={(el) => (socialsRef.current[2] = el)}
            onMouseMove={(e) => handleSocialMouseMove(e, socialsRef.current[2])}
            onMouseLeave={() => handleSocialMouseLeave(socialsRef.current[2])}
            href="https://github.com/harshmakwana17"
            target="_blank"
            rel="noopener noreferrer"
            className="socials__link"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span>Github</span>
          </a>

          <div ref={(el) => (dividersRef.current[2] = el)} className="socials__divider" />

          <a
            ref={(el) => (socialsRef.current[3] = el)}
            onMouseMove={(e) => handleSocialMouseMove(e, socialsRef.current[3])}
            onMouseLeave={() => handleSocialMouseLeave(socialsRef.current[3])}
            href="https://www.instagram.com/harsh_makwana._17"
            target="_blank"
            rel="noopener noreferrer"
            className="socials__link"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <span>Instagram</span>
          </a>
        </div>
      </main>
    </div>
  );
}

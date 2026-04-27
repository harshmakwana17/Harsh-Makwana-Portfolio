// import { useState, useCallback } from 'react';
// import Preloader from './components/Preloader';
// import ComingSoon from './components/ComingSoon';

// function App() {
//   const [preloaderDone, setPreloaderDone] = useState(false);

//   const handlePreloaderComplete = useCallback(() => {
//     setPreloaderDone(true);
//   }, []);

//   return (
//     <>
//       {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
//       {preloaderDone && <ComingSoon />}
//     </>
//   );
// }

// export default App;

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Preloader from './components/Preloader';
import ComingSoon from './components/ComingSoon';

export default function App() {
  const [showMain, setShowMain] = useState(false);
  const mainRef = useRef(null);

  // When ComingSoon mounts, animate it in from slightly scaled up
  // — mirrors demo-2's content reveal (startAt scale:1.2, fade to scale:1)
  useEffect(() => {
    if (showMain && mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, scale: 1.08 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.0,
          ease: 'back.out(1.2)',
          delay: 0.1,
        }
      );
    }
  }, [showMain]);

  return (
    <>
      {!showMain && (
        <Preloader onComplete={() => setShowMain(true)} />
      )}

      {showMain && (
        <div ref={mainRef} style={{ opacity: 0 }}>
          <ComingSoon />
        </div>
      )}
    </>
  );
}
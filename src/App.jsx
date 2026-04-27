import { useState, useCallback } from 'react';
import Preloader from './components/Preloader';
import ComingSoon from './components/ComingSoon';

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <>
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
      {preloaderDone && <ComingSoon />}
    </>
  );
}

export default App;


import { useEffect, useState } from "react";
function ProgressLoadingBar({ loading }) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;

    if (loading) {
      setIsVisible(true);
      setProgress(20);

      // Move from 20% to 80% after a short delay
      timer = setTimeout(() => {
        setProgress(80);
      }, 2000);

      return () => clearTimeout(timer);
    }

    // Loading finished: show 100% before hiding
    if (isVisible) {
      setProgress(100);

      timer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [loading, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="w-full h-2 bg-primary/20 z-50">
      <div
        className="h-full bg-primary transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default ProgressLoadingBar;
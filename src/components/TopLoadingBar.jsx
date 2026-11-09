
import { useEffect, useState } from "react";

function TopLoadingBar({loading}) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress,setProgress] = useState(0);
  useEffect(() => {
    if(loading){
       setIsVisible(true);
       setProgress(90);
    }else if(isVisible){
        setProgress(100);
    }
    const timer = setTimeout(() => {
      setProgress(0);
      setIsVisible(false);
    }, 300);

    return () => clearTimeout(timer);
  },[loading])

  if(!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-999">
        <div className="h-full bg-text transition-all ease-in-out duration-200" style={{width : `${progress}%`}}></div>
    </div>
  )
}

export default TopLoadingBar
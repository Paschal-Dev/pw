// src/ResizeWindowComponent.jsx
import React, { useState, useEffect } from "react";

const ResizeWindowComponent = (): React.JSX.Element => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      // Check if there is a decrease in window size
      if (
        currentWidth < windowSize.width ||
        currentHeight < windowSize.height
      ) {
        // Attempt to resize the window to a specific size
        window.resizeTo(800, 600);
      }

      // Update the state with the new window size
      setWindowSize({
        width: currentWidth,
        height: currentHeight,
      });
    };

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowSize]);

  return <div></div>;
};

export default ResizeWindowComponent;

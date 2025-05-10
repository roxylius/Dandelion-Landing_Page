import React, { useState, useEffect } from 'react';
import './HeroAnimation.css'; // We'll create this CSS file
// Use the image URL from the Framer example
const imageUrl = 'https://framerusercontent.com/images/ot5Z8dURM7RmsRBzPeWT2oGCig.png';
const altText = 'Research Assistant AI'; // Alt text from the Framer example

const HeroAnimation = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animation-container">
      <div className={`image-wrapper ${isAnimated ? 'animate' : ''}`}>
        <img src={imageUrl} alt={altText} />
      </div>
    </div>
  );
};

export default HeroAnimation;
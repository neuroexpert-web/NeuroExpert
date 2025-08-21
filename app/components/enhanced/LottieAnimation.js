'use client';

import { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import { useInView } from 'react-intersection-observer';

// Пример анимаций с LottieFiles
const animations = {
  success: 'https://lottie.host/e6d4c7e4-9af8-4f8f-9b8f-2c8b8f8e8f8f/success.json',
  loading: 'https://lottie.host/a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6/loading.json',
  error: 'https://lottie.host/q7r8s9t0-u1v2-w3x4-y5z6-789012345678/error.json',
  rocket: 'https://lottie.host/123e4567-e89b-12d3-a456-426614174000/rocket.json',
  ai: 'https://lottie.host/987f6543-e21b-12d3-a456-426614174999/ai-brain.json'
};

export default function LottieAnimation({ 
  animationData, // JSON данные анимации
  animationUrl, // URL анимации
  animationType, // Тип из предустановленных
  loop = true,
  autoplay = true,
  style = {},
  className = '',
  onComplete,
  playOnHover = false,
  playOnView = false,
  ...props
}) {
  const lottieRef = useRef();
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  useEffect(() => {
    if (playOnView && inView && lottieRef.current) {
      lottieRef.current.play();
    }
  }, [inView, playOnView]);

  const handleMouseEnter = () => {
    if (playOnHover && lottieRef.current) {
      lottieRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (playOnHover && lottieRef.current) {
      lottieRef.current.pause();
    }
  };

  // Определяем источник анимации
  let animationSource = animationData;
  if (!animationSource && animationType && animations[animationType]) {
    animationSource = animations[animationType];
  } else if (!animationSource && animationUrl) {
    animationSource = animationUrl;
  }

  if (!animationSource) {
    return null;
  }

  return (
    <div 
      ref={ref}
      className={`lottie-wrapper ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={typeof animationSource === 'string' ? null : animationSource}
        path={typeof animationSource === 'string' ? animationSource : null}
        loop={loop}
        autoplay={autoplay && !playOnHover && !playOnView}
        onComplete={onComplete}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
        {...props}
      />
    </div>
  );
}

// Компонент для предзагрузки анимаций
export function PreloadLottie({ animations = [] }) {
  useEffect(() => {
    animations.forEach(url => {
      if (typeof url === 'string') {
        fetch(url).then(res => res.json());
      }
    });
  }, [animations]);

  return null;
}
'use client';

import { useState, useEffect, useRef } from 'react';

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className = '',
  placeholder = 'blur',
  blurDataURL
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef}
      className={`optimized-image-wrapper ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder blur */}
      {placeholder === 'blur' && !isLoaded && (
        <div 
          className="image-placeholder"
          style={{
            backgroundImage: blurDataURL ? `url(${blurDataURL})` : 'none',
            backgroundColor: blurDataURL ? 'transparent' : 'rgba(139, 92, 246, 0.1)',
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
        />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          className={`optimized-image ${isLoaded ? 'loaded' : ''}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}

      <style jsx>{`
        .optimized-image-wrapper {
          position: relative;
          overflow: hidden;
          background: rgba(139, 92, 246, 0.05);
        }

        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
        }

        .optimized-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }

        .optimized-image.loaded {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
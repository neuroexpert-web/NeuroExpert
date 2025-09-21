/**
 * OptimizedImage - компонент для оптимизированной загрузки изображений
 * Включает lazy loading, WebP поддержку, и responsive images
 */
'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  loading?: 'lazy' | 'eager';
  onLoadComplete?: () => void;
  fallbackSrc?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  fill = false,
  loading = 'lazy',
  onLoadComplete,
  fallbackSrc = '/images/placeholder.jpg'
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Генерация blur placeholder
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#e5e7eb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }
    
    return canvas.toDataURL('image/jpeg', 0.1);
  };

  const defaultBlurDataURL = blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  // Intersection Observer для lazy loading
  useEffect(() => {
    if (loading === 'lazy' && !priority) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Предзагружаем изображение
              const link = document.createElement('link');
              link.rel = 'preload';
              link.as = 'image';
              link.href = src;
              document.head.appendChild(link);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '50px' }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }
  }, [src, loading, priority]);

  // Responsive sizes по умолчанию
  const defaultSizes = sizes || `
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  `;

  const imageProps = {
    src: imgSrc,
    alt,
    quality,
    priority,
    placeholder: placeholder as any,
    blurDataURL: defaultBlurDataURL,
    sizes: defaultSizes,
    onLoad: handleLoad,
    onError: handleError,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    ...(fill ? { fill: true } : { width, height })
  };

  return (
    <div 
      ref={imgRef} 
      className={`relative overflow-hidden ${fill ? 'w-full h-full' : ''}`}
      style={!fill ? { width, height } : undefined}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={!fill ? { width, height } : undefined}
        />
      )}
      
      {/* Main image */}
      <Image {...imageProps} />
      
      {/* Error state */}
      {hasError && imgSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="ml-2 text-sm">Изображение недоступно</span>
        </div>
      )}
    </div>
  );
}

/**
 * Компонент для адаптивных изображений с несколькими источниками
 */
export function ResponsiveImage({
  src,
  alt,
  className = '',
  priority = false,
  breakpoints = {
    mobile: 640,
    tablet: 1024,
    desktop: 1920
  }
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  breakpoints?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}) {
  const generateSrcSet = (baseSrc: string) => {
    const formats = ['webp', 'jpg'];
    const sizes = [breakpoints.mobile, breakpoints.tablet, breakpoints.desktop];
    
    return formats.map(format => 
      sizes.map(size => `${baseSrc}?w=${size}&f=${format} ${size}w`).join(', ')
    );
  };

  return (
    <picture>
      {/* WebP sources */}
      <source 
        srcSet={`${src}?f=webp&w=${breakpoints.mobile} ${breakpoints.mobile}w, ${src}?f=webp&w=${breakpoints.tablet} ${breakpoints.tablet}w, ${src}?f=webp&w=${breakpoints.desktop} ${breakpoints.desktop}w`}
        type="image/webp"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      
      {/* Fallback */}
      <OptimizedImage
        src={src}
        alt={alt}
        className={className}
        priority={priority}
        width={breakpoints.desktop}
        height={Math.round(breakpoints.desktop * 0.6)} // 16:10 aspect ratio
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </picture>
  );
}
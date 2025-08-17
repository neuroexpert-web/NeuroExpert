import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

export default function PremiumBackground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const stopRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-init on resize for consistent density
      initParticles();
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles with adaptive density
    const initParticles = () => {
      particlesRef.current = [];
      const area = canvas.width * canvas.height;
      const baseCount = Math.floor(area / 15000);
      const maxCount = isMobile ? 60 : 160;
      const particleCount = Math.min(baseCount, maxCount);

      const styles = getComputedStyle(document.documentElement);
      const accent = styles.getPropertyValue('--accent').trim() || '#6366f1';
      const gold = '#FFD700';

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.25),
          speedY: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.25),
          opacity: Math.random() * 0.2 + 0.05,
          color: Math.random() > 0.6 ? gold : accent
        });
      }
    };

    // Reduced motion: keep static canvas (no animation)
    if (reduceMotion) {
      particlesRef.current = [];
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      window.addEventListener('resize', resizeCanvas);
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }

    // Mouse tracking (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    if (!isMobile) window.addEventListener('mousemove', handleMouseMove);

    // Pause when tab hidden
    const handleVisibility = () => {
      stopRef.current = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Animation loop with FPS throttling
    const targetFPS = isMobile ? 30 : 45;
    const frameInterval = 1000 / targetFPS;
    let last = performance.now();

    const animate = (now: number) => {
      if (stopRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const delta = now - last;
      if (delta < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      last = now;

      // Faint trail background for smoothness
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Mouse interaction (subtle)
        if (!isMobile) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.x -= (dx / (distance || 1)) * force * 1.5;
            particle.y -= (dy / (distance || 1)) * force * 1.5;
          }
        }

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with subtle glow (desktop only)
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        if (!isMobile) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = particle.color;
        }
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw neural connections
      const maxDistance = isMobile ? 90 : 150;
      const lineAlpha = isMobile ? 0.08 : 0.12;
      particlesRef.current.forEach((particle, i) => {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            ctx.globalAlpha = (1 - distance / maxDistance) * lineAlpha;
            ctx.strokeStyle = '#4136f1';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize after helper is defined
    // (initParticles may use canvas size from resizeCanvas)
    // Ensure some particles even if resize triggers later
    particlesRef.current.length === 0 && (function seed() { initParticles(); })();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (!isMobile) window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="premium-bg">
      {/* Luxury mesh gradient */}
      <div className="luxury-mesh-gradient" />
      
      {/* Animated orbs */}
      <div className="premium-orb orb-1" />
      <div className="premium-orb orb-2" />
      <div className="premium-orb orb-3" />
      
      {/* Premium grid */}
      <div className="premium-grid" />
      
      {/* Noise texture */}
      <div className="luxury-noise" />
      
      {/* Interactive particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
      
      {/* Vignette overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
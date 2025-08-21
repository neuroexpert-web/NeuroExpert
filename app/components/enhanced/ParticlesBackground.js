'use client';

import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log('Particles loaded', container);
  }, []);

  return (
    <Particles
      id="particles-bg"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: 'push',
            },
            onHover: {
              enable: true,
              mode: 'repulse',
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: '#0070f3',
          },
          shape: {
            type: 'circle',
          },
          opacity: {
            value: 0.5,
            random: false,
          },
          size: {
            value: 5,
            random: true,
          },
          links: {
            enable: true,
            distance: 150,
            color: '#0070f3',
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            outModes: {
              default: 'out',
            },
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 z-0"
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%', 
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  );
}
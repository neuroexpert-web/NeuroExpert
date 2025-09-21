'use client';

/**
 * Premium UI System v3.2 - Advanced Interactive Components
 * Система премиум UI с продвинутыми интерактивными компонентами
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';

// Advanced Animation Variants
const premiumAnimations = {
  // Liquid morphing effect
  liquidMorph: {
    initial: { 
      scale: 1,
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    hover: {
      scale: 1.05,
      borderRadius: '24px',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    tap: {
      scale: 0.98,
      borderRadius: '8px',
      transition: { duration: 0.1 }
    }
  },

  // Magnetic attraction effect
  magneticField: {
    initial: { x: 0, y: 0 },
    hover: (custom: { x: number; y: number }) => ({
      x: custom.x * 0.3,
      y: custom.y * 0.3,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 15
      }
    })
  },

  // Particle explosion
  particleExplosion: {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0],
      transition: {
        duration: 0.6,
        times: [0, 0.3, 1],
        ease: 'easeOut'
      }
    }
  },

  // Holographic shimmer
  holographicShimmer: {
    initial: { 
      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
      backgroundSize: '200% 200%',
      backgroundPosition: '-200% 0'
    },
    animate: {
      backgroundPosition: '200% 0',
      transition: {
        duration: 1.5,
        ease: 'linear',
        repeat: Infinity
      }
    }
  },

  // Neural network pulse
  neuralPulse: {
    initial: { 
      boxShadow: '0 0 0 0 rgba(102, 126, 234, 0.7)' 
    },
    animate: {
      boxShadow: [
        '0 0 0 0 rgba(102, 126, 234, 0.7)',
        '0 0 0 20px rgba(102, 126, 234, 0)',
        '0 0 0 0 rgba(102, 126, 234, 0)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeOut'
      }
    }
  }
};

// Premium Button Component
export const PremiumButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'neural' | 'holographic';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  magnetic?: boolean;
}> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled, 
  loading,
  magnetic = false 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current || !magnetic) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setMousePosition({
      x: e.clientX - centerX,
      y: e.clientY - centerY
    });
  }, [magnetic]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled || loading) return;
    
    // Create particle explosion effect
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }));
      
      setParticles(newParticles);
      
      // Clean up particles after animation
      setTimeout(() => setParticles([]), 600);
    }
    
    onClick?.();
  }, [disabled, loading, onClick]);

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    secondary: 'bg-gradient-to-r from-gray-700 to-gray-800 text-white',
    neural: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white',
    holographic: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white'
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`
        relative overflow-hidden font-semibold rounded-xl
        ${sizeClasses[size]}
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-4 focus:ring-blue-300/50
      `}
      variants={magnetic ? premiumAnimations.magneticField : premiumAnimations.liquidMorph}
      initial="initial"
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : "tap"}
      custom={mousePosition}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onClick={handleClick}
      disabled={disabled}
    >
      {/* Holographic shimmer effect */}
      {variant === 'holographic' && (
        <motion.div
          className="absolute inset-0"
          variants={premiumAnimations.holographicShimmer}
          initial="initial"
          animate="animate"
        />
      )}

      {/* Neural pulse effect */}
      {variant === 'neural' && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          variants={premiumAnimations.neuralPulse}
          initial="initial"
          animate="animate"
        />
      )}

      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}

      {/* Particle explosion */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y
            }}
            variants={premiumAnimations.particleExplosion}
            initial="initial"
            animate="animate"
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Advanced Card Component with Tilt Effect
export const PremiumCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  tiltIntensity?: number;
  glowEffect?: boolean;
  parallaxContent?: boolean;
}> = ({ 
  children, 
  className = '', 
  tiltIntensity = 0.1,
  glowEffect = false,
  parallaxContent = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateXValue = (e.clientY - centerY) * tiltIntensity;
    const rotateYValue = (centerX - e.clientX) * tiltIntensity;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  }, [tiltIntensity]);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80
        backdrop-blur-xl border border-gray-700/50 rounded-2xl
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX,
        rotateY,
        scale: isHovered ? 1.02 : 1,
        boxShadow: isHovered 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
          : '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect */}
      {glowEffect && isHovered && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Content with parallax effect */}
      <motion.div
        style={{
          transform: parallaxContent 
            ? `translateZ(${isHovered ? '20px' : '0px'})` 
            : 'none'
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Floating AI Assistant with Advanced Interactions
export const FloatingAIAssistant: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>;
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
}> = ({ isOpen, onToggle, messages, onSendMessage, isTyping }) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(() => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, onSendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
      >
        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute bottom-16 right-0 w-80 h-96 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden"
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(59, 130, 246, 0.7)',
                          '0 0 0 8px rgba(59, 130, 246, 0)',
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🤖
                    </motion.div>
                    <div>
                      <h3 className="text-white font-semibold">AI Ассистент</h3>
                      <p className="text-gray-400 text-xs">
                        {isTyping ? 'Печатает...' : 'Онлайн'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto max-h-64">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    className={`mb-3 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={`
                        inline-block p-3 rounded-lg max-w-xs
                        ${message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                        }
                      `}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    className="text-left mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="inline-block p-3 bg-gray-700 rounded-lg">
                      <motion.div
                        className="flex space-x-1"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-700/50">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Задайте вопрос..."
                    className="flex-1 p-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                  <PremiumButton
                    size="sm"
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                  >
                    📤
                  </PremiumButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <PremiumButton
          variant="neural"
          size="lg"
          onClick={onToggle}
          magnetic
        >
          {isOpen ? '✕' : '🤖'}
        </PremiumButton>
      </motion.div>
    </AnimatePresence>
  );
};

// Animated Statistics Counter
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}> = ({ value, duration = 2, prefix = '', suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value, duration]);

  return (
    <span ref={countRef}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const PremiumUISystemComponents = {
  PremiumButton,
  PremiumCard,
  FloatingAIAssistant,
  AnimatedCounter
};

export default PremiumUISystemComponents;
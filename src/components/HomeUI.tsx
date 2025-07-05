/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';

const NUM_PARTICLES = 8;

function getRandomPositions() {
  return Array.from({ length: NUM_PARTICLES }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
  }));
}

const HomeUI = () => {
  const controls = useAnimation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoaded, setIsLoaded] = useState(false);
  // Use fixed positions for SSR, randomize on client
  const [positions, setPositions] = useState(() =>
    Array.from({ length: NUM_PARTICLES }, (_, i) => ({
      left: (i + 1) * 10,
      top: (i + 1) * 10,
    }))
  );

  useEffect(() => {
    setIsLoaded(true);
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as any }
    });
    setPositions(getRandomPositions());
  }, [controls]);

  const svgContent = `
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="carBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#e0e0e0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#c0c0c0;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#9333ea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="70%" style="stop-color:#d0d0d0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#a0a0a0;stop-opacity:1" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <circle cx="256" cy="256" r="240" fill="none" stroke="#9333ea" stroke-width="8" opacity="0.3"/>
      <circle cx="256" cy="256" r="220" fill="none" stroke="#9333ea" stroke-width="2" opacity="0.5"/>
      
      <g transform="translate(256, 256)">
        <path d="M-120 -20 L-100 -60 L-40 -80 L40 -80 L100 -60 L120 -20 L120 40 L100 60 L-100 60 L-120 40 Z" 
              fill="url(#carBodyGradient)" 
              stroke="#9333ea" 
              stroke-width="3"
              filter="url(#glow)"/>
        
        <path d="M-80 -20 L-60 -50 L-20 -60 L20 -60 L60 -50 L80 -20 L80 0 L-80 0 Z" 
              fill="url(#carBodyGradient)" 
              stroke="#9333ea" 
              stroke-width="2"/>
        
        <path d="M-70 -15 L-50 -40 L-15 -50 L15 -50 L50 -40 L70 -15 L70 -5 L-70 -5 Z" 
              fill="#ffffff" 
              opacity="0.8"/>
        
        <rect x="-70" y="-15" width="30" height="25" fill="#ffffff" opacity="0.6"/>
        <rect x="40" y="-15" width="30" height="25" fill="#ffffff" opacity="0.6"/>
        
        <circle cx="-110" cy="-10" r="8" fill="#ffffff" opacity="0.9"/>
        <circle cx="-110" cy="10" r="8" fill="#ffffff" opacity="0.9"/>
        
        <circle cx="110" cy="-10" r="6" fill="url(#accentGradient)"/>
        <circle cx="110" cy="10" r="6" fill="url(#accentGradient)"/>
        
        <circle cx="-70" cy="45" r="18" fill="url(#wheelGradient)" stroke="#9333ea" stroke-width="2"/>
        <circle cx="-70" cy="45" r="12" fill="#ffffff" opacity="0.8"/>
        <circle cx="-70" cy="45" r="6" fill="#a0a0a0"/>
        
        <circle cx="70" cy="45" r="18" fill="url(#wheelGradient)" stroke="#9333ea" stroke-width="2"/>
        <circle cx="70" cy="45" r="12" fill="#ffffff" opacity="0.8"/>
        <circle cx="70" cy="45" r="6" fill="#a0a0a0"/>
        
        <line x1="-100" y1="20" x2="100" y2="20" stroke="url(#accentGradient)" stroke-width="3" opacity="0.8"/>
        <line x1="-80" y1="30" x2="80" y2="30" stroke="#9333ea" stroke-width="1" opacity="0.6"/>
        
        <rect x="-100" y="-15" width="8" height="30" fill="#a0a0a0"/>
        <rect x="-98" y="-10" width="4" height="4" fill="#ffffff"/>
        <rect x="-98" y="-2" width="4" height="4" fill="#ffffff"/>
        <rect x="-98" y="6" width="4" height="4" fill="#ffffff"/>
        
        <circle cx="0" cy="-30" r="15" fill="none" stroke="#9333ea" stroke-width="2"/>
        <path d="M-8 -35 L0 -25 L8 -35 M-8 -25 L8 -25" stroke="#9333ea" stroke-width="2" fill="none"/>
      </g>
      
      <g transform="translate(256, 256)">
        <path d="M-200 -100 L-160 -80" stroke="#9333ea" stroke-width="2" opacity="0.4"/>
        <path d="M-200 -80 L-160 -60" stroke="#9333ea" stroke-width="2" opacity="0.4"/>
        <path d="M-200 -60 L-160 -40" stroke="#9333ea" stroke-width="2" opacity="0.4"/>
        
        <path d="M200 -100 L160 -80" stroke="#9333ea" stroke-width="2" opacity="0.4"/>
        <path d="M200 -80 L160 -60" stroke="#9333ea" stroke-width="2" opacity="0.4"/>
        <path d="M200 -60 L160 -40" stroke="#9333ea" stroke-width="2" opacity="0.4"/>
        
        <circle cx="-180" cy="-180" r="3" fill="url(#accentGradient)"/>
        <circle cx="180" cy="-180" r="3" fill="url(#accentGradient)"/>
        <circle cx="-180" cy="180" r="3" fill="url(#accentGradient)"/>
        <circle cx="180" cy="180" r="3" fill="url(#accentGradient)"/>
      </g>
      
      <text x="256" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#9333ea" opacity="0.8">DRIVE</text>
      <text x="256" y="445" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#9333ea" opacity="0.6">MANAGEMENT</text>
    </svg>
  `;

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as any,
        staggerChildren: 0.2
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as any
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Animated SVG Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 0.15, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" as any }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div 
            className="w-96 h-96 sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px]"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-20 text-center max-w-4xl mx-auto">
          {/* DrivePro Animated Logo */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={logoVariants}
            className="mb-8"
          >
            <div className="relative">
              {/* Glow Effect Behind Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.3, scale: 1.2 }}
                transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-3xl"
              />
              
              {/* Main Logo Container */}
              <div className="relative flex items-center justify-center">
                {/* Drive Text */}
                <motion.div className="flex items-baseline">
                  {['D', 'r', 'i', 'v', 'e'].map((letter, index) => (
                    <motion.span
                      key={index}
                      variants={letterVariants}
                      className="text-5xl sm:text-6xl lg:text-8xl font-bold text-gray-800 inline-block"
                      style={{ 
                        textShadow: '0 0 20px rgba(147, 51, 234, 0.5)',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Pro Text with Special Styling */}
                <motion.div 
                  initial={{ opacity: 0, x: -20, rotateY: 90 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" as any }}
                  className="ml-2 relative"
                >
                  <motion.span
                    className="text-5xl sm:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent inline-block"
                    style={{ 
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      textShadow: '0 0 30px rgba(147, 51, 234, 0.5)'
                    }}
                  >
                    Pro
                  </motion.span>
                </motion.div>
              </div>

              {/* Animated Particles Around Logo */}
              <div className="absolute inset-0 pointer-events-none">
                {positions.map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-purple-400 rounded-full"
                    style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                    animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Streamline your driving school operations with our comprehensive management software. 
            <span className="text-purple-600 font-semibold"> Schedule lessons, track progress, and grow your business</span> effortlessly.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2, duration: 0.8, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <Link href="/auth/sign-up">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="relative group bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-lg sm:text-xl font-semibold py-4 px-8 sm:px-12 rounded-full transition-all duration-300 shadow-2xl"
                type="button"
              >
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Button Content */}
                <div className="relative flex items-center space-x-3">
                  <span>Get Started Free</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.div>
                </div>
              </motion.button>
            </Link>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            {['No Credit Card Required', 'Setup in Minutes', '24/7 Support'].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.8 + index * 0.2, duration: 0.5 }}
                className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-2 text-sm text-gray-700 shadow-lg"
              >
                {feature}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-8 h-8 bg-purple-500/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-40 right-20 w-6 h-6 bg-pink-500/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-40 left-20 w-4 h-4 bg-purple-500/30 rounded-full blur-sm"
        />
      </div>
    </div>
  );
};

export default HomeUI;
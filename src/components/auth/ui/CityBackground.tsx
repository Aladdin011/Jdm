import React from 'react';
import { motion } from 'framer-motion';

interface CityBackgroundProps {
  className?: string;
}

export const CityBackground: React.FC<CityBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Animated Gradient Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-slate-400 via-teal-500 to-cyan-300"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* SVG Cityscape */}
      <motion.svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYEnd slice"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Water Reflection */}
        <defs>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(56, 178, 172, 0.3)" />
            <stop offset="50%" stopColor="rgba(34, 211, 238, 0.2)" />
            <stop offset="100%" stopColor="rgba(165, 243, 252, 0.1)" />
          </linearGradient>
          
          <linearGradient id="cityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
        </defs>
        
        {/* Water Surface */}
        <rect x="0" y="640" width="720" height="640" fill="url(#waterGradient)" />
        
        {/* Bridge */}
        <g transform="translate(50, 580)">
          {/* Bridge Deck */}
          <rect x="0" y="40" width="200" height="8" fill="#374151" />
          
          {/* Bridge Towers */}
          <rect x="20" y="0" width="6" height="50" fill="#4b5563" />
          <rect x="174" y="0" width="6" height="50" fill="#4b5563" />
          
          {/* Bridge Cables */}
          <path d="M23 10 L50 40 L80 40 L110 40 L140 40 L170 40 L177 10" 
                stroke="#6b7280" strokeWidth="1" fill="none" />
          <path d="M23 20 L60 40 L120 40 L177 20" 
                stroke="#6b7280" strokeWidth="1" fill="none" />
        </g>
        
        {/* City Skyline */}
        <g fill="url(#cityGradient)">
          {/* Background Buildings */}
          <rect x="400" y="400" width="40" height="180" />
          <rect x="450" y="420" width="35" height="160" />
          <rect x="490" y="380" width="45" height="200" />
          <rect x="540" y="410" width="30" height="170" />
          <rect x="575" y="390" width="38" height="190" />
          <rect x="620" y="430" width="32" height="150" />
          <rect x="660" y="400" width="40" height="180" />
          
          {/* Foreground Buildings */}
          <rect x="350" y="350" width="50" height="230" />
          <rect x="410" y="320" width="45" height="260" />
          <rect x="465" y="340" width="40" height="240" />
          <rect x="515" y="310" width="55" height="270" />
          <rect x="580" y="330" width="42" height="250" />
          <rect x="630" y="300" width="48" height="280" />
          
          {/* Tall Central Buildings */}
          <rect x="480" y="250" width="35" height="330" />
          <rect x="520" y="220" width="40" height="360" />
          <rect x="565" y="240" width="38" height="340" />
        </g>
        
        {/* Building Windows */}
        <motion.g 
          fill="#fbbf24" 
          opacity="0.8"
          animate={{
            opacity: [0.8, 1, 0.6, 1, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Scattered window lights */}
          <rect x="405" y="410" width="3" height="4" />
          <rect x="415" y="430" width="3" height="4" />
          <rect x="425" y="450" width="3" height="4" />
          <rect x="455" y="440" width="3" height="4" />
          <rect x="465" y="460" width="3" height="4" />
          <rect x="495" y="400" width="3" height="4" />
          <rect x="505" y="420" width="3" height="4" />
          <rect x="525" y="330" width="3" height="4" />
          <rect x="535" y="350" width="3" height="4" />
          <rect x="545" y="370" width="3" height="4" />
          <rect x="585" y="340" width="3" height="4" />
          <rect x="595" y="360" width="3" height="4" />
          <rect x="635" y="320" width="3" height="4" />
          <rect x="645" y="340" width="3" height="4" />
          <rect x="485" y="270" width="3" height="4" />
          <rect x="525" y="240" width="3" height="4" />
          <rect x="570" y="260" width="3" height="4" />
        </motion.g>
        
        {/* Flying Bird */}
        <motion.g 
          transform="translate(300, 200)" 
          fill="#374151"
          animate={{
            x: [0, 100, 200, 300, 400],
            y: [0, -10, 5, -15, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path d="M0 0 Q-5 -2 -8 0 Q-5 2 0 0 Q5 -2 8 0 Q5 2 0 0" />
        </motion.g>
        
        {/* Reflection in Water */}
        <g transform="translate(0, 1280) scale(1, -0.6)" opacity="0.3" fill="#1f2937">
          {/* Reflected city (simplified) */}
          <rect x="350" y="350" width="50" height="230" />
          <rect x="410" y="320" width="45" height="260" />
          <rect x="465" y="340" width="40" height="240" />
          <rect x="515" y="310" width="55" height="270" />
          <rect x="580" y="330" width="42" height="250" />
          <rect x="630" y="300" width="48" height="280" />
          <rect x="480" y="250" width="35" height="330" />
          <rect x="520" y="220" width="40" height="360" />
          <rect x="565" y="240" width="38" height="340" />
        </g>
      </motion.svg>
    </div>
  );
};
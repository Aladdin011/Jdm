import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Sparkles,
  Play,
  ChevronRight,
  ArrowRight,
  Building2,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";

// Enhanced animated counter with smooth easing
const AnimatedCounter = ({ 
  value, 
  suffix = "", 
  prefix = "",
  duration = 2.5 
}: { 
  value: number; 
  suffix?: string; 
  prefix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Smooth easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return (
    <div ref={ref} className="text-2xl lg:text-3xl font-bold text-white font-mono">
      {prefix}{count}{suffix}
    </div>
  );
};

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -100, -20],
            x: [-10, 10, -10],
            opacity: [0, 1, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const PremiumHero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Scroll animation for pulling next section
  const nextSectionY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const nextSectionOpacity = useTransform(scrollYProgress, [0.5, 1], [0, 1]);

  // Container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.8
      }
    }
  };

  const glassVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      backdropFilter: "blur(0px)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      backdropFilter: "blur(24px)",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 1.2
      }
    }
  };

  return (
    <>
      <motion.section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden"
        style={{ y, opacity, scale }}
      >
        {/* Background Image - BLACK VISION */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2Fb9e926f9dca9498f8a0f99f9f9792da7%2F8c631f6cbd504f8caa73f8290d09cd3c?format=webp&width=800')`,
              filter: "brightness(0.9) contrast(1.1)"
            }}
          />
        </div>

        {/* Dark overlay for content readability */}
        <div className="absolute inset-0 bg-black/20 z-10" />

        {/* Content Container - Top Left Positioning */}
        <div className="relative z-20 min-h-screen flex items-start pt-32 pl-8 lg:pl-16">
          <div className="w-full max-w-md">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* BLACK VISION - Main Title */}
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-wider hero-title">
                  BLACK <span className="text-gray-300 font-light">VISION</span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.div variants={itemVariants}>
                <p className="text-sm text-gray-300 italic font-light tracking-wide hero-subtitle">
                  Advanced darkness
                </p>
              </motion.div>

              {/* Decorative Plus */}
              <motion.div variants={itemVariants}>
                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-gray-400"></div>
                  <div className="w-0.5 h-6 bg-gray-400 absolute"></div>
                </div>
              </motion.div>

              {/* Main Description */}
              <motion.div variants={itemVariants} className="space-y-2">
                <p className="text-xs text-gray-300 uppercase tracking-widest leading-relaxed">
                  LET GO OF THE LIGHT<br />
                  GIVE INTO<br />
                  THE DARK SIDE
                </p>
              </motion.div>

              {/* Decorative Wave */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-0.5 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-0.5 bg-gray-400 rounded-full"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 right-8 text-white/60 text-xs writing-vertical-rl scroll-indicator"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SCROLL
          </motion.span>
        </motion.div>
      </motion.section>

      {/* Next Section Preview (pulled by scroll) */}
      <motion.div
        className="relative z-30"
        style={{ y: nextSectionY, opacity: nextSectionOpacity }}
      >
        <div className="h-20 bg-white"></div>
      </motion.div>
    </>
  );
};

export default PremiumHero;

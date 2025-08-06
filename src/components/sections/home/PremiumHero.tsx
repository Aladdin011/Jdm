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
      <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">
        {prefix}{count}{suffix}
      </span>
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
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2Fb9e926f9dca9498f8a0f99f9f9792da7%2F8f98d79878704821ac687723d7e03126?format=webp&width=800')`,
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
              {/* Company Badge */}
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-400/30 bg-orange-500/15 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-orange-200 text-xs font-medium tracking-wide">
                    Since 2007
                  </span>
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tight hero-title leading-tight">
                  Building{" "}
                  <span className="bg-gradient-to-r from-orange-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                    Tomorrow's
                  </span>
                  <br />
                  Cities
                </h1>
              </motion.div>

              {/* Glassmorphism Container for Subtitle and CTA */}
              <motion.div
                variants={glassVariants}
                className="relative group"
              >
                {/* Premium Glass Card */}
                <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5 rounded-2xl" />

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 space-y-5">
                    {/* Enhanced Subtitle */}
                    <motion.div variants={itemVariants}>
                      <div className="space-y-3">
                        <p className="text-lg text-white/90 font-light leading-relaxed tracking-wide">
                          Intelligent construction solutions for{" "}
                          <span className="bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent font-medium">
                            Africa's urban transformation
                          </span>
                        </p>

                        {/* Decorative line */}
                        <div className="flex items-center gap-2">
                          <div className="h-px bg-gradient-to-r from-orange-400 to-amber-400 flex-1" />
                          <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" />
                          <div className="h-px bg-gradient-to-r from-amber-400 to-orange-400 flex-1" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Premium CTA Buttons */}
                    <motion.div variants={itemVariants}>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                          className="group/btn relative px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 overflow-hidden"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Button shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />

                          <div className="relative flex items-center justify-center gap-2">
                            <span className="font-semibold">Get Started</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </div>
                        </motion.button>

                        <motion.button
                          className="group/btn relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 overflow-hidden"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Button glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />

                          <div className="relative flex items-center justify-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-400/30">
                              <Play className="w-2.5 h-2.5 text-white ml-0.5" />
                            </div>
                            <span className="font-semibold">View Projects</span>
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-orange-400/20 to-transparent rounded-2xl" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-amber-400/20 to-transparent rounded-2xl" />
                </div>
              </motion.div>

              {/* Premium Stats Card */}
              <motion.div variants={itemVariants}>
                <div className="p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center group">
                      <div className="p-2 rounded-lg bg-orange-500/10 mb-2 transition-all duration-300 group-hover:bg-orange-500/20">
                        <AnimatedCounter value={500} suffix="+" />
                      </div>
                      <div className="text-white/70 text-xs font-medium uppercase tracking-wider">
                        Projects
                      </div>
                    </div>
                    <div className="text-center group">
                      <div className="p-2 rounded-lg bg-amber-500/10 mb-2 transition-all duration-300 group-hover:bg-amber-500/20">
                        <AnimatedCounter value={15} suffix="+" />
                      </div>
                      <div className="text-white/70 text-xs font-medium uppercase tracking-wider">
                        Years
                      </div>
                    </div>
                    <div className="text-center group">
                      <div className="p-2 rounded-lg bg-orange-500/10 mb-2 transition-all duration-300 group-hover:bg-orange-500/20">
                        <AnimatedCounter value={50} prefix="$" suffix="M+" />
                      </div>
                      <div className="text-white/70 text-xs font-medium uppercase tracking-wider">
                        Value
                      </div>
                    </div>
                  </div>
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

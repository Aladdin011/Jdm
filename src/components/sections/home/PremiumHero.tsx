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
    <div ref={ref} className="text-4xl lg:text-5xl font-bold text-white font-mono">
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

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
    <section 
      ref={heroRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.3)" }}
        >
          <source
            src="https://cdn.builder.io/o/assets%2Fb9e926f9dca9498f8a0f99f9f9792da7%2Fd8ab210f1b32410085018c6afc0bd529?alt=media&token=d73e85ba-7d92-4810-b477-7e16b8873fb0&apiKey=b9e926f9dca9498f8a0f99f9f9792da7"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Gradient Overlay with Bright Blue Tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-cyan-900/90 z-10" />
      
      {/* Additional Blue Mesh Gradient */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-cyan-400/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-blue-700/40" />
      </div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Content Container */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left side - Minimal decorative elements */}
            <div className="lg:col-span-4 hidden lg:block">
              <motion.div
                style={{ y, opacity }}
                className="space-y-8"
              >
                {/* Floating Tech Cards */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="relative"
                >
                  <div className="glass-card p-4 rounded-2xl border border-blue-400/30 bg-blue-500/10 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white/90 text-sm font-semibold">Smart Construction</div>
                        <div className="text-blue-300/70 text-xs">AI-Powered Solutions</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2, duration: 1 }}
                  className="ml-8"
                >
                  <div className="glass-card p-4 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white/90 text-sm font-semibold">Growth Analytics</div>
                        <div className="text-cyan-300/70 text-xs">Real-time Insights</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right side - Main content with glassmorphism */}
            <div className="lg:col-span-8 flex justify-end">
              <motion.div
                variants={glassVariants}
                initial="hidden"
                animate="visible"
                className="glass-hero-card p-8 lg:p-12 rounded-3xl border border-blue-400/30 bg-blue-500/10 backdrop-blur-2xl max-w-2xl w-full"
                style={{
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)",
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                }}
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  {/* Badge */}
                  <motion.div variants={itemVariants}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-400/40 bg-blue-500/20 backdrop-blur-sm">
                      <Sparkles className="w-4 h-4 text-blue-300" />
                      <span className="text-blue-100 text-sm font-medium">
                        Building Africa's Future Since 2007
                      </span>
                    </div>
                  </motion.div>

                  {/* Main Heading */}
                  <motion.div variants={itemVariants} className="space-y-4">
                    <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                      Building{" "}
                      <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                        Tomorrow's
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                        Cities
                      </span>
                    </h1>
                    
                    <p className="text-xl text-blue-100/90 leading-relaxed max-w-lg">
                      Revolutionizing construction through intelligent digital solutions and sustainable innovation for Africa's urban transformation.
                    </p>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div variants={itemVariants}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.button
                        className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2">
                          <span>Start Building</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.button>

                      <motion.button
                        className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold text-lg border border-blue-400/40 hover:bg-white/20 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center">
                            <Play className="w-3 h-3 text-white ml-0.5" />
                          </div>
                          <span>Watch Demo</span>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Stats */}
                  <motion.div variants={itemVariants}>
                    <div className="grid grid-cols-3 gap-6 pt-8 border-t border-blue-400/20">
                      <div className="text-center">
                        <AnimatedCounter value={500} suffix="+" />
                        <div className="text-blue-200/80 text-sm font-medium mt-1">
                          Projects Completed
                        </div>
                      </div>
                      <div className="text-center">
                        <AnimatedCounter value={15} suffix="+" />
                        <div className="text-blue-200/80 text-sm font-medium mt-1">
                          Years Experience
                        </div>
                      </div>
                      <div className="text-center">
                        <AnimatedCounter value={50} prefix="$" suffix="M+" />
                        <div className="text-blue-200/80 text-sm font-medium mt-1">
                          Investment Value
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Achievement Badges */}
                  <motion.div variants={itemVariants}>
                    <div className="flex flex-wrap gap-3 pt-6">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-500/20 border border-blue-400/30">
                        <Award className="w-4 h-4 text-blue-300" />
                        <span className="text-blue-100 text-sm">ISO Certified</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30">
                        <Users className="w-4 h-4 text-cyan-300" />
                        <span className="text-blue-100 text-sm">1000+ Clients</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-950 to-transparent z-15" />
    </section>
  );
};

export default PremiumHero;

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Building2,
  Users,
  Award,
  TrendingUp,
  MapPin,
  Zap,
  Construction,
  Clock,
} from "lucide-react";

// Enhanced animated counter with smooth easing
const AnimatedCounter = ({
  value,
  suffix = "",
  prefix = "",
  duration = 2.5,
  isVisible = false,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  isVisible?: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

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
  }, [isVisible, value, duration]);

  return (
    <span className="font-mono font-bold text-[var(--accent-light)]">
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

// Floating shapes component
const FloatingShapes = () => {
  const shapes = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-[var(--neutral-light)]/5 to-[var(--accent-light)]/5"
          style={{
            width: [300, 200, 150, 100][i],
            height: [300, 200, 150, 100][i],
            top: ["10%", "70%", "30%", "50%"][i],
            left: ["10%", "80%", "70%", "20%"][i],
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20 + i * 2,
            repeat: Infinity,
            delay: i * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// 3D Building Model Component
const BuildingModel = () => {
  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Building Structure */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        {/* Floor 1 */}
        <motion.div
          className="absolute bottom-0 left-1/4 w-32 h-20 bg-gradient-to-t from-[var(--secondary-dark)] to-[var(--accent-warm)] rounded-lg"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />

        {/* Floor 2 */}
        <motion.div
          className="absolute bottom-16 left-1/3 w-28 h-16 bg-gradient-to-t from-[var(--accent-warm)] to-[var(--accent-light)] rounded-lg"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        />

        {/* Floor 3 */}
        <motion.div
          className="absolute bottom-28 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-gradient-to-t from-[var(--accent-light)] to-[var(--neutral-light)] rounded-lg"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        />

        {/* Construction Crane */}
        <motion.div
          className="absolute top-8 right-8 w-2 h-32 bg-[var(--accent-light)] origin-bottom"
          initial={{ rotate: -45, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <div className="absolute -top-1 -left-6 w-14 h-1 bg-[var(--accent-light)]" />
        </motion.div>
      </motion.div>

      {/* Floating Info Cards */}
      <motion.div
        className="absolute top-12 -left-8 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[var(--accent-light)]" />
          <div>
            <div className="text-xs font-medium text-white">
              Real-time Updates
            </div>
            <div className="text-xs text-white/70">Live monitoring</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-32 -right-8 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 2.3 }}
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--accent-light)]" />
          <div>
            <div className="text-xs font-medium text-white">Remote Teams</div>
            <div className="text-xs text-white/70">Global reach</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.6 }}
      >
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[var(--accent-light)]" />
          <div>
            <div className="text-xs font-medium text-white">
              Quality Assured
            </div>
            <div className="text-xs text-white/70">Verified professionals</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const PremiumHero = () => {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const [statsInView, setStatsInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const statsRef = useRef(null);
  const statsIsInView = useInView(statsRef, { threshold: 0.5, once: true });

  useEffect(() => {
    if (statsIsInView) {
      setStatsInView(true);
    }
  }, [statsIsInView]);

  // Container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.8,
      },
    },
  };

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[var(--primary-dark)] via-[var(--secondary-dark)] to-[var(--accent-warm)]"
      style={{ y, opacity, scale }}
    >
      {/* Enhanced Background with Glassmorphism Layers */}
      <div className="absolute inset-0">
        {/* Primary gradient overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(212,201,199,0.15) 0%, transparent 60%),
              radial-gradient(circle at 80% 20%, rgba(170,116,82,0.12) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(124,88,65,0.1) 0%, transparent 40%),
              linear-gradient(135deg, transparent 0%, rgba(45,56,62,0.15) 50%, transparent 100%)
            `,
          }}
        />

        {/* Glassmorphism floating panels */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(170,116,82,0.3)] rotate-12 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/3 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-[0_4px_16px_0_rgba(212,201,199,0.4)] -rotate-6 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 bg-white/4 backdrop-blur-xl rounded-3xl border border-white/15 shadow-[0_6px_24px_0_rgba(124,88,65,0.35)] rotate-45 animate-pulse delay-2000"></div>

        {/* Ambient light effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-[var(--accent-light)]/10 to-transparent blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-radial from-[var(--accent-warm)]/8 to-transparent blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Shapes */}
      <FloatingShapes />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-white"
            >
              {/* Hero Badge - Enhanced Glassmorphism */}
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(170,116,82,0.37)] mb-8 hover:bg-white/10 transition-all duration-300">
                  <div className="relative">
                    <div className="w-3 h-3 bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent-warm)] rounded-full shadow-lg"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-[var(--accent-light)] rounded-full animate-ping opacity-60"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-[var(--accent-light)] rounded-full animate-pulse"></div>
                  </div>
                  <Construction className="w-6 h-6 text-[var(--accent-light)] drop-shadow-lg" />
                  <span className="text-sm font-semibold text-[var(--accent-light)] tracking-wide">
                    Leading African Construction Excellence
                  </span>
                  <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                  <span className="text-xs text-white/70 font-medium">
                    Since 2015
                  </span>
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.div variants={itemVariants}>
                <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
                  <span className="block">Building Africa's</span>
                  <span className="block bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent-warm)] bg-clip-text text-transparent">
                    Future Cities
                  </span>
                  <span className="block">One Project at a Time</span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants}>
                <p className="text-xl text-[var(--neutral-light)] leading-relaxed mb-8 max-w-2xl">
                  Connect with skilled construction professionals across Nigeria
                  through our revolutionary remote platform. Quality
                  craftsmanship meets digital innovation to transform how we
                  build modern Africa.
                </p>
              </motion.div>

              {/* Interactive Stats */}
              <motion.div
                ref={statsRef}
                variants={itemVariants}
                className="grid grid-cols-3 gap-6 mb-10"
              >
                {[
                  {
                    icon: TrendingUp,
                    value: 500,
                    suffix: "+",
                    label: "Projects Completed",
                  },
                  {
                    icon: Users,
                    value: 1200,
                    suffix: "+",
                    label: "Skilled Workers",
                  },
                  {
                    icon: MapPin,
                    value: 50,
                    suffix: "+",
                    label: "Cities Served",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(45,56,62,0.4)] hover:shadow-[0_16px_64px_0_rgba(170,116,82,0.3)] hover:bg-white/10 transition-all duration-500 cursor-pointer"
                    whileHover={{ scale: 1.08, y: -8 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-light)]/20 to-[var(--accent-warm)]/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                      <stat.icon className="w-7 h-7 text-[var(--accent-light)] drop-shadow-lg" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-black mb-2 bg-gradient-to-r from-white to-[var(--neutral-light)] bg-clip-text text-transparent">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        isVisible={statsInView}
                        duration={2.5}
                      />
                    </div>
                    <div className="text-sm text-[var(--neutral-light)] font-medium tracking-wide">
                      {stat.label}
                    </div>
                    <div className="mt-3 w-8 h-0.5 bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent-warm)] mx-auto rounded-full"></div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Advanced CTA Section */}
              <motion.div variants={itemVariants}>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <motion.button
                    onClick={() => navigate("/register")}
                    className="group relative px-10 py-5 bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent-warm)] text-white rounded-3xl font-bold overflow-hidden shadow-[0_16px_32px_0_rgba(170,116,82,0.4)] hover:shadow-[0_20px_40px_0_rgba(170,116,82,0.6)]"
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl" />
                    <div className="relative flex items-center justify-center gap-3">
                      <span className="text-lg">Join Our Platform</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 drop-shadow-lg" />
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => navigate("/projects")}
                    className="group px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/30 text-white rounded-3xl font-bold hover:bg-white/15 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] hover:shadow-[0_16px_64px_0_rgba(255,255,255,0.2)] transition-all duration-500"
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-2xl bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent-warm)] flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 text-white ml-0.5 drop-shadow-sm" />
                      </div>
                      <span className="text-lg">Watch Demo</span>
                    </div>
                  </motion.button>
                </div>
              </motion.div>

              {/* Trust Indicators - Enhanced */}
              <motion.div variants={itemVariants}>
                <div className="text-center sm:text-left">
                  <span className="text-sm text-[var(--neutral-light)] mb-6 block font-medium tracking-wide">
                    Trusted by leading companies across Africa
                  </span>
                  <div className="flex items-center gap-4 flex-wrap">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-24 h-12 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_4px_16px_0_rgba(255,255,255,0.1)] hover:bg-white/10 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        <div className="w-16 h-6 bg-gradient-to-r from-white/20 to-white/40 rounded-lg flex items-center justify-center">
                          <div className="w-12 h-3 bg-white/30 rounded backdrop-blur-sm" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-[var(--neutral-mid)]">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Verified partnerships • Active since 2015</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <BuildingModel />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Enhanced Glassmorphism */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-3 p-4 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
          <div className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm shadow-inner">
            <motion.div
              className="w-1.5 h-4 bg-gradient-to-b from-[var(--accent-light)] to-[var(--accent-warm)] rounded-full mt-2 shadow-lg"
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <span className="text-xs font-semibold tracking-wider">
            Scroll to explore
          </span>
          <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default PremiumHero;

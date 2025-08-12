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
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(212,201,199,0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(170,116,82,0.1) 0%, transparent 50%),
              linear-gradient(135deg, transparent 0%, rgba(45,56,62,0.1) 50%, transparent 100%)
            `,
          }}
        />
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
              {/* Hero Badge */}
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-[var(--accent-light)]/30 mb-8">
                  <div className="relative">
                    <div className="w-2 h-2 bg-[var(--accent-light)] rounded-full"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-[var(--accent-light)] rounded-full animate-ping"></div>
                  </div>
                  <Construction className="w-5 h-5 text-[var(--accent-light)]" />
                  <span className="text-sm font-medium text-[var(--accent-light)]">
                    Leading African Construction
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
                    className="text-center p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05, y: -4 }}
                  >
                    <stat.icon className="w-6 h-6 text-[var(--accent-light)] mx-auto mb-2" />
                    <div className="text-2xl lg:text-3xl font-bold mb-1">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        isVisible={statsInView}
                        duration={2.5}
                      />
                    </div>
                    <div className="text-sm text-[var(--neutral-light)]">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Advanced CTA Section */}
              <motion.div variants={itemVariants}>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <motion.button
                    onClick={() => navigate("/register")}
                    className="group relative px-8 py-4 bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent-warm)] text-white rounded-2xl font-semibold overflow-hidden"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    <div className="relative flex items-center justify-center gap-2">
                      <span>Join Our Platform</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => navigate("/projects")}
                    className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent-warm)] flex items-center justify-center">
                        <Play className="w-3 h-3 text-white ml-0.5" />
                      </div>
                      <span>Watch Demo</span>
                    </div>
                  </motion.button>
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div variants={itemVariants}>
                <div className="text-center sm:text-left">
                  <span className="text-sm text-[var(--neutral-mid)] mb-4 block">
                    Trusted by leading companies
                  </span>
                  <div className="flex items-center gap-6 opacity-60">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-20 h-8 bg-white/10 rounded-lg flex items-center justify-center"
                      >
                        <div className="w-12 h-4 bg-white/20 rounded" />
                      </div>
                    ))}
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

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className="text-xs font-medium">Scroll to explore</span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default PremiumHero;

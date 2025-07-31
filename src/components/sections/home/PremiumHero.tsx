import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronRight, Play, ArrowDown, Sparkles, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { useAdvancedAnimations } from '@/lib/advancedAnimations';

// Animated background particles
const FloatingParticle = ({ delay, duration, x, y }: { delay: number; duration: number; x: number; y: number }) => (
  <motion.div
    className="absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-20"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.6, 0.2],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Stats counter component
const StatCounter = ({ value, label, suffix = "", prefix = "" }: { 
  value: number; 
  label: string; 
  suffix?: string; 
  prefix?: string; 
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const timer = setInterval(() => {
        setCount(prev => {
          if (prev >= value) {
            clearInterval(timer);
            return value;
          }
          return prev + Math.ceil(value / 50);
        });
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-mono">
        {prefix}{count}{suffix}
      </div>
      <div className="text-neutral-300 text-sm font-medium">{label}</div>
    </motion.div>
  );
};

// Platform preview mockup
const PlatformPreview = () => (
  <motion.div
    className="relative w-full max-w-md mx-auto"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 1.2 }}
  >
    <div className="glass rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="h-2 bg-white/30 rounded mb-1"></div>
            <div className="h-2 bg-white/20 rounded w-3/4"></div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="h-2 bg-white/30 rounded mb-1"></div>
            <div className="h-2 bg-white/20 rounded w-2/3"></div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="h-2 bg-white/30 rounded mb-1"></div>
            <div className="h-2 bg-white/20 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Floating elements */}
    <motion.div
      className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <Sparkles className="w-4 h-4 text-white" />
    </motion.div>
    
    <motion.div
      className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.div>
);

export default function PremiumHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const animations = useAdvancedAnimations();
  const { personalization, trackUserInteraction } = useAppStore();
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handlePrimaryClick = () => {
    trackUserInteraction('hero-primary-cta');
    navigate('/projects');
  };

  const handleVideoClick = () => {
    trackUserInteraction('hero-video-cta');
    setIsVideoModalOpen(true);
  };

  const scrollToNext = () => {
    trackUserInteraction('hero-scroll-indicator');
    const nextSection = document.getElementById('services');
    if (nextSection) {
      animations.smoothScroll(nextSection.offsetTop - 100);
    }
  };

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden hero-background">
      {/* Gradient Mesh Background */}
      <div className="gradient-mesh" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <FloatingParticle key={particle.id} {...particle} />
        ))}
      </div>

      {/* Interactive Mouse Effect */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(124, 88, 65, 0.1), transparent 40%)`,
        }}
      />

      {/* Main Content */}
      <div className="container-fluid relative z-10">
        <motion.div
          className="min-h-screen flex items-center"
          style={{ y, opacity, scale }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Premium Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-white/90 text-sm font-medium">
                  Building Africa's Future Since 2007
                </span>
              </motion.div>

              {/* Hero Title */}
              <div className="space-y-4">
                <motion.h1
                  className="text-hero"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Building Africa's
                  <br />
                  <span className="gradient-text">Future Cities</span>
                </motion.h1>

                <motion.p
                  className="text-body-lg text-neutral-300 max-w-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Connect skilled construction professionals with clients through our 
                  intelligent remote platform. Modern construction management redefined 
                  for the digital age.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 items-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <button
                  onClick={handlePrimaryClick}
                  className="btn-primary-premium gpu-accelerated group"
                >
                  <span>Start Building</span>
                  <ChevronRight className="btn-icon" />
                </button>

                <button
                  onClick={handleVideoClick}
                  className="btn-secondary-premium group"
                >
                  <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>Watch Demo</span>
                </button>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <StatCounter value={500} label="Projects Completed" suffix="+" />
                <StatCounter value={15} label="Years Experience" suffix="+" />
                <StatCounter value={50} label="Investment Value" suffix="M+" prefix="$" />
              </motion.div>
            </motion.div>

            {/* Right Content - Platform Preview */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <PlatformPreview />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={scrollToNext}
      >
        <motion.div
          className="flex flex-col items-center group"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-white/60 text-sm mb-3 group-hover:text-white/80 transition-colors">
            Discover Our Services
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent mb-2" />
          <motion.div
            className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center group-hover:border-white/60 transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            <ArrowDown className="w-4 h-4 text-white/60 group-hover:text-white/80 transition-colors" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsVideoModalOpen(false)}
        >
          <motion.div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video content would go here */}
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-60" />
                <p className="text-lg opacity-80">Demo Video Coming Soon</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

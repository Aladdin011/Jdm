import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, Play, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { useAdvancedAnimations, easingCurves } from '@/lib/advancedAnimations';
import { ParticleCanvas } from '@/components/3d/ParticleSystem';

interface SmartCTAProps {
  variants: string[];
  trackingId: string;
  personalizedText?: string;
  className?: string;
}

function SmartCTA({ variants, trackingId, personalizedText, className }: SmartCTAProps) {
  const navigate = useNavigate();
  const { personalization, trackUserInteraction } = useAppStore();
  const [currentVariant, setCurrentVariant] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // A/B test different CTAs based on user behavior
  useEffect(() => {
    const { userType, timeOfDay, deviceType } = personalization;
    
    // Smart variant selection
    if (userType === 'enterprise') {
      setCurrentVariant(1); // "Schedule Consultation"
    } else if (timeOfDay === 'evening' || deviceType === 'mobile') {
      setCurrentVariant(0); // "Explore Projects"
    } else {
      setCurrentVariant(Math.floor(Math.random() * variants.length));
    }
  }, [personalization, variants.length]);

  const handleClick = () => {
    trackUserInteraction(`${trackingId}-${currentVariant}`);
    
    if (currentVariant === 0) {
      navigate('/projects');
    } else {
      navigate('/contact');
    }
  };

  const ctaText = personalizedText || variants[currentVariant] || 'Explore Projects';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
    >
      <Button
        onClick={handleClick}
        className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-6 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold group"
      >
        <motion.span
          className="relative z-10 flex items-center gap-2"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {ctaText}
          <motion.div
            animate={{ x: isHovered ? 5 : 0, rotate: isHovered ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight size={20} />
          </motion.div>
        </motion.span>
        
        {/* Animated background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '0%' : '-100%' }}
          transition={{ duration: 0.3 }}
        />
      </Button>
    </motion.div>
  );
}

function ProgressiveTextReveal({ text, className, delay = 0 }: { 
  text: string; 
  className?: string; 
  delay?: number; 
}) {
  const [visibleChars, setVisibleChars] = useState(0);
  const { reducedMotion } = useAppStore();

  useEffect(() => {
    if (reducedMotion) {
      setVisibleChars(text.length);
      return;
    }

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev >= text.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, reducedMotion]);

  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: index < visibleChars ? 1 : 0,
            y: index < visibleChars ? 0 : 20
          }}
          transition={{
            duration: 0.3,
            delay: index * 0.02,
            ease: easingCurves.gentle,
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

function StatsAnimation() {
  const stats = [
    { value: '500+', label: 'Projects Completed' },
    { value: '15+', label: 'Years Experience' },
    { value: '50M+', label: 'Investment Value' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2 }}
      className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.2 + index * 0.1 }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
          <div className="text-sm text-white/80">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function EnhancedHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const animations = useAdvancedAnimations();
  const { personalization, setCurrentSection, trackUserInteraction } = useAppStore();
  
  const [currentPhase, setCurrentPhase] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Progressive reveal phases
  useEffect(() => {
    const phases = [
      { delay: 500, action: () => setCurrentPhase(1) },
      { delay: 1500, action: () => setCurrentPhase(2) },
      { delay: 2500, action: () => setCurrentPhase(3) },
    ];

    const timers = phases.map(({ delay, action }) => 
      setTimeout(action, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    setCurrentSection('hero');
  }, [setCurrentSection]);

  const scrollToNextSection = () => {
    trackUserInteraction('hero-scroll-down');
    const nextSection = document.getElementById('about');
    if (nextSection) {
      animations.smoothScroll(nextSection.offsetTop);
    }
  };

  const handleVideoPlay = () => {
    trackUserInteraction('hero-video-play');
    // Implement video modal or navigation
  };

  // Personalized content
  const getPersonalizedGreeting = () => {
    const { timeOfDay, userType } = personalization;
    
    if (userType === 'enterprise') {
      return "Transforming Africa's Infrastructure";
    }
    
    switch (timeOfDay) {
      case 'morning':
        return "Building Africa's Future Cities";
      case 'afternoon':
        return "Innovative Construction Solutions";
      case 'evening':
        return "Sustainable Urban Development";
      default:
        return "Building Africa's Future Cities";
    }
  };

  const ctaVariants = ['Explore Our Projects', 'Schedule Consultation', 'Request Quote'];

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Interactive Canvas Background */}
      <ParticleCanvas />
      
      {/* Enhanced Background with Multiple Layers */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 via-transparent to-red-900/20 z-20" />

        {/* Background image with enhanced effects */}
        <motion.div
          animate={{
            scale: [1, 1.05],
            translateX: [0, -5],
            filter: ['brightness(0.7)', 'brightness(0.8)'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2Fa99cd57b1b98496ca25fa02ed32b5108')",
          }}
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center text-white container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center max-w-6xl"
        >
          {/* Company Badge */}
          <AnimatePresence>
            {currentPhase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6"
              >
                <Sparkles size={16} className="text-orange-400" />
                <span className="text-sm font-medium">JD Marc Limited - Since 2007</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Heading with Progressive Reveal */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <ProgressiveTextReveal
              text={getPersonalizedGreeting()}
              className="bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent"
              delay={300}
            />
          </motion.h1>

          {/* Enhanced Description */}
          <AnimatePresence>
            {currentPhase >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-lg md:text-xl lg:text-2xl mb-12 max-w-4xl mx-auto"
              >
                <ProgressiveTextReveal
                  text="Delivering innovative infrastructure projects across Nigeria and beyond with offices in Abuja, London, and New York. We create smarter, greener, and more resilient urban solutions for Africa's growing cities."
                  className="text-white/90 leading-relaxed"
                  delay={0}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <AnimatePresence>
            {currentPhase >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8"
              >
                <SmartCTA
                  variants={ctaVariants}
                  trackingId="hero-primary-cta"
                  personalizedText={personalization.userType === 'enterprise' ? 'Schedule Consultation' : undefined}
                />
                
                <motion.button
                  onClick={handleVideoPlay}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <Play size={20} />
                  <span>Watch Our Story</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated Stats */}
          <StatsAnimation />
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: currentPhase >= 3 ? 1 : 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToNextSection}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center group"
          >
            <motion.span
              className="text-white/60 text-sm mb-3 group-hover:text-white/80 transition-colors"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              Discover Our Impact
            </motion.span>
            <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent mb-2" />
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown
                size={24}
                className="text-white/70 group-hover:text-orange-400 transition-colors"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

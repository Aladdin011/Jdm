import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PremiumLayout from "@/components/layout/PremiumLayout";
import PremiumNavigation from "@/components/layout/PremiumNavigation";
import PremiumHero from "@/components/sections/home/PremiumHero";
import PremiumServices from "@/components/sections/home/PremiumServices";
import PlatformHub from "@/components/sections/home/PlatformHub";
import PremiumAbout from "@/components/sections/home/PremiumAbout";
import PremiumProjects from "@/components/sections/home/PremiumProjects";
import PremiumTestimonials from "@/components/sections/home/PremiumTestimonials";
import CallToActionSection from "@/components/sections/home/CallToActionSection";
import BlogPreview from "@/components/sections/home/BlogPreview";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { useAppStore, usePerformanceMonitoring } from "@/stores/appStore";
import { usePersonalization, useLeadScoring } from "@/lib/personalization";
import { useAdvancedAnimations } from "@/lib/advancedAnimations";
import { Construction, Zap, Building2 } from "lucide-react";

// Enhanced page transition variants with construction theme
const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.05,
    transition: {
      duration: 0.5,
      ease: "easeIn",
    },
  },
};

// Premium staggered reveal for sections
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Enhanced loading animation component
const PremiumLoadingScreen = () => (
  <motion.div 
    className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    style={{
      background: "linear-gradient(135deg, #051822 0%, #2D383E 50%, #7C5841 100%)"
    }}
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8 }}
  >
    {/* Background Pattern */}
    <div 
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(212,201,199,0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(170,116,82,0.2) 0%, transparent 50%)
        `
      }}
    />

    {/* Floating Elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: i % 2 === 0 
              ? "radial-gradient(circle, rgba(170,116,82,0.1) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(212,201,199,0.1) 0%, transparent 70%)",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>

    {/* Loading Content */}
    <div className="relative z-10 text-center">
      {/* Animated Logo */}
      <motion.div
        className="w-24 h-24 mx-auto mb-8 relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#AA7452] to-[#7C5841] flex items-center justify-center shadow-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Construction className="w-12 h-12 text-white" />
        </motion.div>
        
        {/* Orbiting elements */}
        {[0, 120, 240].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-[#D4C9C7] rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
            }}
            animate={{
              rotate: [angle, angle + 360],
              x: [30, 30],
              y: [-2, -2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Company Name */}
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl md:text-5xl font-black text-white mb-4"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        JD Marc <span className="text-[#AA7452]">Limited</span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-[#D4C9C7] text-xl font-medium mb-8"
      >
        Building Africa's Future Infrastructure
      </motion.p>

      {/* Progress Bar */}
      <motion.div
        className="w-64 h-1 bg-[#2D383E] rounded-full mx-auto overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-[#AA7452] to-[#7C5841] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Loading Text */}
      <motion.p
        className="text-[#969A9E] text-sm mt-4 font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Preparing your experience...
      </motion.p>
    </div>
  </motion.div>
);

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();

  // Enhanced state management with construction focus - with error handling
  const {
    setMousePosition: setStoreMousePosition,
    setScrollProgress,
    trackUserInteraction,
    updateUserActivity,
  } = useAppStore();

  // Advanced features - with try/catch error handling
  let personalization, adaptContent, calculateScore, animations;
  try {
    const personalizationHook = usePersonalization();
    personalization = personalizationHook.personalization;
    adaptContent = personalizationHook.adaptContent;

    const leadScoringHook = useLeadScoring();
    calculateScore = leadScoringHook.calculateScore;

    animations = useAdvancedAnimations();
  } catch (error) {
    console.warn('Advanced features failed to initialize:', error);
    // Provide fallbacks
    personalization = null;
    adaptContent = () => {};
    calculateScore = () => 0;
    animations = null;
  }

  // Performance monitoring - with error handling
  try {
    usePerformanceMonitoring();
  } catch (error) {
    console.warn('Performance monitoring failed to initialize:', error);
  }

  // Enhanced parallax effects
  const heroY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 800], [1, 1.1]);

  // Apply construction-themed CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Construction color system
    root.style.setProperty('--primary-dark', '#051822');
    root.style.setProperty('--secondary-dark', '#2D383E');
    root.style.setProperty('--accent-warm', '#7C5841');
    root.style.setProperty('--accent-light', '#AA7452');
    root.style.setProperty('--neutral-mid', '#969A9E');
    root.style.setProperty('--neutral-light', '#D4C9C7');
    root.style.setProperty('--construction-white', '#FFFFFF');
    
    // Enhanced gradients
    root.style.setProperty('--hero-gradient', 'linear-gradient(135deg, #051822 0%, #2D383E 50%, #7C5841 100%)');
    root.style.setProperty('--card-gradient', 'linear-gradient(145deg, #D4C9C7 0%, rgba(212,201,199,0.8) 100%)');
    root.style.setProperty('--accent-gradient', 'linear-gradient(90deg, #AA7452 0%, #7C5841 100%)');
    
    // Premium shadows
    root.style.setProperty('--shadow-soft', '0 8px 32px rgba(5, 24, 34, 0.12)');
    root.style.setProperty('--shadow-medium', '0 16px 64px rgba(5, 24, 34, 0.16)');
    root.style.setProperty('--shadow-strong', '0 24px 80px rgba(5, 24, 34, 0.24)');
  }, []);

  // Enhanced mouse tracking with performance optimization
  useEffect(() => {
    let rafId: number;
    
    const updateMousePosition = (e: MouseEvent) => {
      rafId = requestAnimationFrame(() => {
        const position = { x: e.clientX, y: e.clientY };
        setMousePosition(position);
        setStoreMousePosition(position);
      });
    };

    const handleUserActivity = () => {
      updateUserActivity();
    };

    const handleScroll = () => {
      const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setScrollProgress(progress);
      trackUserInteraction("scroll");
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Enhanced loading simulation with construction theme
    const startTime = performance.now();
    const timer = setTimeout(() => {
      const loadTime = performance.now() - startTime;
      setIsLoading(false);
      trackUserInteraction("page-loaded");

      // Performance analytics
      if (loadTime > 3000) {
        trackUserInteraction("slow-page-load");
      }
    }, 2000); // Increased for better animation showcase

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [setStoreMousePosition, setScrollProgress, trackUserInteraction, updateUserActivity]);

  // Enhanced loading screen
  if (isLoading) {
    return <PremiumLoadingScreen />;
  }

  return (
    <>
      <CustomCursor position={mousePosition} />
      <PremiumNavigation />
      <PremiumLayout hideNavigation>
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative overflow-hidden"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            {/* Enhanced Premium Hero Section */}
            <motion.section
              id="hero"
              variants={sectionVariants}
              className="relative"
              style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            >
              <PremiumHero />
            </motion.section>

            {/* Enhanced Premium Services */}
            <motion.section
              id="services"
              variants={sectionVariants}
              className="relative"
            >
              <PremiumServices />
            </motion.section>

            {/* Enhanced Platform Hub */}
            <motion.section
              id="platform"
              variants={sectionVariants}
              className="relative"
            >
              <PlatformHub />
            </motion.section>

            {/* Enhanced About Section */}
            <motion.section
              id="about"
              variants={sectionVariants}
              className="relative"
            >
              <PremiumAbout />
            </motion.section>

            {/* Enhanced Projects Showcase */}
            <motion.section
              id="projects"
              variants={sectionVariants}
              className="relative"
            >
              <PremiumProjects />
            </motion.section>

            {/* Enhanced Testimonials */}
            <motion.section
              id="testimonials"
              variants={sectionVariants}
              className="relative"
            >
              <PremiumTestimonials />
            </motion.section>

            {/* Enhanced Blog Preview */}
            <motion.section
              id="blog"
              variants={sectionVariants}
              className="relative py-32 bg-gradient-to-b from-white via-[#D4C9C7]/10 to-gray-50/50"
            >
              <BlogPreview />
            </motion.section>

            {/* Enhanced Call to Action */}
            <motion.section
              id="contact"
              variants={sectionVariants}
              className="relative py-32"
              style={{
                background: "linear-gradient(135deg, #051822 0%, #2D383E 50%, #7C5841 100%)"
              }}
            >
              <CallToActionSection />
            </motion.section>
          </motion.div>
        </motion.div>
      </PremiumLayout>
    </>
  );
}

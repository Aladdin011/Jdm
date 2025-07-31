import { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import Layout from "@/components/layout/Layout";
import EnhancedHero from "@/components/sections/home/EnhancedHero";
import AboutSection from "@/components/sections/home/AboutSection";
import ProjectsShowcase from "@/components/sections/home/ProjectsShowcase";
import CoreServices from "@/components/sections/home/CoreServices";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import CallToActionSection from "@/components/sections/home/CallToActionSection";
import BlogPreview from "@/components/sections/home/BlogPreview";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { IntelligentNavbar } from "@/components/layout/IntelligentNavbar";
import { useAppStore, usePerformanceMonitoring } from "@/stores/appStore";
import { usePersonalization, useLeadScoring } from "@/lib/personalization";
import { useAdvancedAnimations } from "@/lib/advancedAnimations";

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

// Staggered reveal for sections
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScroll();

  // Parallax effect for hero background
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  // Mouse tracking for custom cursor
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    // Simulate page load
    const timer = setTimeout(() => setIsLoading(false), 1000);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      clearTimeout(timer);
    };
  }, []);

  // Loading animation
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full border-4 border-orange-200 border-t-orange-500 rounded-full" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-slate-800 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            JD Marc Limited
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Building Africa's Future
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <CustomCursor position={mousePosition} />
      <Layout hideDefaultHeader>
        <IntelligentNavbar />
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            {/* Hero Section */}
            <motion.section
              id="hero"
              variants={sectionVariants}
              className="relative min-h-screen overflow-hidden"
              style={{ y: heroY, opacity: heroOpacity }}
            >
              <ModernHero />
            </motion.section>

            {/* About Section with Animated Stats */}
            <motion.section
              id="about"
              variants={sectionVariants}
              className="relative py-20 bg-gradient-to-b from-white to-amber-50"
            >
              <AboutSection />
            </motion.section>

            {/* Projects Showcase */}
            <motion.section
              id="projects"
              variants={sectionVariants}
              className="relative py-20 bg-slate-50"
            >
              <ProjectsShowcase />
            </motion.section>

            {/* Core Services */}
            <motion.section
              id="services"
              variants={sectionVariants}
              className="relative py-20 bg-gradient-to-b from-white to-orange-50"
            >
              <CoreServices />
            </motion.section>

            {/* Testimonials */}
            <motion.section
              id="testimonials"
              variants={sectionVariants}
              className="relative py-20 bg-slate-800"
            >
              <TestimonialsSection />
            </motion.section>

            {/* Blog Preview */}
            <motion.section
              id="blog"
              variants={sectionVariants}
              className="relative py-20 bg-white"
            >
              <BlogPreview />
            </motion.section>

            {/* Call to Action */}
            <motion.section
              id="contact"
              variants={sectionVariants}
              className="relative py-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500"
            >
              <CallToActionSection />
            </motion.section>
          </motion.div>
        </motion.div>
      </Layout>
    </>
  );
}

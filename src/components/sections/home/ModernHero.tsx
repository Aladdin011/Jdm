import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Play, ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Floating particles component
const FloatingParticles = () => {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; delay: number }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, -100, -20],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Modern architectural background with the provided image
const ArchitecturalBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main architectural background image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F3ea4e8ddcd314db6b491a8835cfb72ec?format=webp&width=800')`,
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Enhanced gradient overlays for better text readability and brand colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-slate-800/70 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent z-20" />

      {/* Subtle brand color accent overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-transparent to-red-600/20 z-15" />

      {/* Enhanced floating particles for depth */}
      <FloatingParticles />

      {/* Geometric overlay to enhance the architectural theme */}
      <div className="absolute inset-0 z-5">
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%),
              linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.05) 50%, transparent 51%)
            `,
            backgroundSize: "60px 60px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "60px 60px"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
};

export default function ModernHero() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 250]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const scrollToNext = () => {
    const nextSection = document.getElementById("about");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <ArchitecturalBackground />
      </motion.div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 container mx-auto px-4 text-center"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span
            className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/30 shadow-lg"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            🏢 Leading Pan-African Construction & Infrastructure Company
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Building Africa's
          <br />
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
            Future Cities
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
          style={{
            fontFamily: "'Inter', sans-serif",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          From innovative infrastructure to sustainable solar solutions, we're
          transforming Africa's landscape with excellence, expertise, and
          unwavering commitment to quality.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
        >
          <Button
            asChild
            size="lg"
            className="group bg-gradient-to-r from-arch-orange to-arch-rust hover:from-arch-orange/90 hover:to-arch-rust/90 text-white border-0 px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-arch-orange/25 transition-all duration-300 cursor-button"
          >
            <Link to="/projects">
              <span>Explore Our Projects</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>

          <Button
            onClick={() => setIsVideoPlaying(true)}
            variant="outline"
            size="lg"
            className="group bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-full cursor-button"
          >
            <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            <span>Watch Our Story</span>
          </Button>
        </motion.div>

        {/* Quick contact buttons */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10 cursor-button"
          >
            <a href="tel:+234-803-706-5497">
              <Phone className="mr-2 h-4 w-4" />
              Call Us Now
            </a>
          </Button>
          <div className="w-px h-6 bg-white/30" />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10 cursor-button"
          >
            <a href="mailto:info@jdmarcng.com">
              <Mail className="mr-2 h-4 w-4" />
              Email Us
            </a>
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.button
            onClick={scrollToNext}
            className="flex flex-col items-center text-white/70 hover:text-white transition-colors duration-300 cursor-button"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm font-medium mb-2">Scroll to explore</span>
            <ChevronDown className="h-6 w-6" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Video modal */}
      {isVideoPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsVideoPlaying(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors duration-300"
            >
              ✕
            </button>
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Company video would play here</p>
                <p className="text-sm opacity-70 mt-2">
                  Showcasing our projects and company culture
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

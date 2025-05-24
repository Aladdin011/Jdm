import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("services-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Preload the hero image
  useEffect(() => {
    const img = new Image();
    img.src = "/images/hero.jpg";
  }, []);

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Enhanced Background with Gradient Overlay */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/50 z-10" />

        {/* Background image with slow ken burns effect */}
        <motion.div
          animate={{
            scale: [1, 1.05],
            translateX: [0, -5],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: "url('/images/hero.jpg')",
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-white container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl"
        >
          {/* Updated heading with staggered animation */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Innovating Infrastructure
            <br />
            <motion.span
              className="text-[#F7931E]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              for a Global Tomorrow
            </motion.span>
          </motion.h1>

          {/* New subheading */}
          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Shaping smart cities and modern landscapes with engineering
            precision and purpose.
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Button className="bg-accent hover:bg-accent/90 text-white py-6 px-8 rounded-md text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Request a Quote
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToNextSection}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center"
          >
            <motion.span
              className="text-white/60 text-sm mb-2"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Explore
            </motion.span>
            <ChevronDown
              size={32}
              className="text-white/70 hover:text-white transition-colors"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

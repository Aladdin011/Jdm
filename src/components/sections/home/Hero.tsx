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
      {/* Parallax Background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: "url('/images/hero.jpg')",
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-white container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Engineering the Future: <br />
            <span className="text-[#F7931E]">
              Building Next-Gen Urban Solutions
            </span>
          </h1>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-accent hover:bg-accent/90 text-white py-6 px-8 rounded-md text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Request a Quote
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
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
          >
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

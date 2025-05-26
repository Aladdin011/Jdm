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

  // Parallax effect for background
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("services-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Background with Parallax Effect */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        {/* Dark Blue Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{ backgroundColor: "rgba(20, 46, 84, 0.8)" }}
        />

        {/* Background Image using Builder.io URL */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2Fa99cd57b1b98496ca25fa02ed32b5108')",
          }}
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Main Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
            style={{ color: "#EAE6DF" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Engineering the Future:
          </motion.h1>

          {/* Subheading */}
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-10 md:mb-12 leading-tight"
            style={{ color: "#A7967E" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Building Next-Gen Urban Solutions
          </motion.h2>

          {/* Call-to-Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Button
              className="text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 rounded-lg shadow-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-opacity-50"
              style={{
                backgroundColor: "#A7967E",
                color: "#142E54",
                borderRadius: "12px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C2CCC5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#A7967E";
              }}
              onClick={() => {
                // Add your quote request logic here
                console.log("Request a quote clicked");
              }}
            >
              Request a Quote
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 sm:bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToNextSection}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center"
          >
            <motion.span
              className="text-sm mb-2 font-medium"
              style={{ color: "#EAE6DF" }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              Scroll to explore
            </motion.span>
            <ChevronDown
              size={28}
              className="transition-colors duration-300"
              style={{ color: "#A7967E" }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Accessibility Enhancements */}
      <div className="sr-only">
        <h1>
          JD Marc Constructions - Engineering the Future: Building Next-Gen
          Urban Solutions
        </h1>
        <p>
          Premium construction and engineering services. Request a quote to get
          started.
        </p>
      </div>
    </div>
  );
}

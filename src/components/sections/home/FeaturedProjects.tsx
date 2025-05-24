import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

const featuredProjects = projects.filter((project) => project.featured);

export default function FeaturedProjects() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startAutoRotation = () => {
    intervalRef.current = window.setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
    }, 5000);
  };

  const stopAutoRotation = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoRotation();

    return () => {
      stopAutoRotation();
    };
  }, []);

  const handlePrev = () => {
    stopAutoRotation();
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? featuredProjects.length - 1 : prev - 1,
    );
    startAutoRotation();
  };

  const handleNext = () => {
    stopAutoRotation();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
    startAutoRotation();
  };

  const currentProject = featuredProjects[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore some of our most notable projects, showcasing our expertise
            and commitment to excellence in construction.
          </p>
        </AnimatedSection>

        <div className="relative">
          {/* Carousel */}
          <div className="relative overflow-hidden rounded-xl shadow-2xl">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="relative w-full aspect-[16/9] md:aspect-[21/9]"
                onMouseEnter={stopAutoRotation}
                onMouseLeave={startAutoRotation}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${currentProject.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    {currentProject.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-block bg-accent/90 text-white px-3 py-1 text-sm font-medium rounded">
                      {currentProject.category}
                    </span>
                    <span className="inline-block bg-white/20 text-white px-3 py-1 text-sm font-medium rounded">
                      {currentProject.location}
                    </span>
                    <span className="inline-block bg-white/20 text-white px-3 py-1 text-sm font-medium rounded">
                      {currentProject.year}
                    </span>
                  </div>
                  <p className="text-white/80 mb-6 max-w-3xl">
                    {currentProject.description.slice(0, 150)}...
                  </p>
                  <Button
                    asChild
                    className="bg-accent hover:bg-accent/90 text-white self-start"
                  >
                    <Link to={`/projects`}>View Details</Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className={cn(
                "absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10",
                "bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center",
                "text-white backdrop-blur-sm transition-all",
              )}
              aria-label="Previous project"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className={cn(
                "absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10",
                "bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center",
                "text-white backdrop-blur-sm transition-all",
              )}
              aria-label="Next project"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {featuredProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  stopAutoRotation();
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                  startAutoRotation();
                }}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  currentIndex === index
                    ? "bg-accent w-6"
                    : "bg-gray-300 dark:bg-gray-600",
                )}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-white"
          >
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

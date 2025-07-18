import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Dr. Amina Kano",
    position: "Director of Infrastructure",
    company: "Lagos State Government",
    content:
      "JD Marc Limited delivered our hospital construction project three months ahead of schedule without compromising quality. Their attention to detail and project management expertise is truly exceptional.",
    rating: 5,
    avatar:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23f59e0b'/><text x='50' y='55' text-anchor='middle' dy='.3em' fill='white' font-size='30' font-family='Arial'>AK</text></svg>",
    projectType: "Healthcare Infrastructure",
    location: "Lagos, Nigeria",
  },
  {
    id: 2,
    name: "Chief Emmanuel Okafor",
    position: "CEO",
    company: "Okafor Industries Ltd",
    content:
      "The solar installation for our manufacturing facility has reduced our energy costs by 60%. JD Marc's team was professional, efficient, and delivered exactly what they promised.",
    rating: 5,
    avatar:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23ef4444'/><text x='50' y='55' text-anchor='middle' dy='.3em' fill='white' font-size='30' font-family='Arial'>EO</text></svg>",
    projectType: "Solar Energy Solution",
    location: "Onitsha, Nigeria",
  },
  {
    id: 3,
    name: "Mrs. Sarah Adebayo",
    position: "Project Manager",
    company: "Federal Road Maintenance Agency",
    content:
      "Working with JD Marc on our highway extension project was a game-changer. Their engineering expertise and commitment to safety standards exceeded our expectations.",
    rating: 5,
    avatar:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2306b6d4'/><text x='50' y='55' text-anchor='middle' dy='.3em' fill='white' font-size='30' font-family='Arial'>SA</text></svg>",
    projectType: "Highway Infrastructure",
    location: "Abuja, Nigeria",
  },
  {
    id: 4,
    name: "Dr. Kwame Asante",
    position: "Vice Chancellor",
    company: "University of Ghana",
    content:
      "The construction of our new engineering faculty building showcases JD Marc's ability to deliver world-class educational infrastructure. Outstanding work from concept to completion.",
    rating: 5,
    avatar:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2384cc16'/><text x='50' y='55' text-anchor='middle' dy='.3em' fill='white' font-size='30' font-family='Arial'>KA</text></svg>",
    projectType: "Educational Infrastructure",
    location: "Accra, Ghana",
  },
  {
    id: 5,
    name: "Mr. Ibrahim Hassan",
    position: "Managing Director",
    company: "Hassan Properties",
    content:
      "JD Marc transformed our residential development vision into reality. Their innovative approach to sustainable construction sets them apart in the industry.",
    rating: 5,
    avatar:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%238b5cf6'/><text x='50' y='55' text-anchor='middle' dy='.3em' fill='white' font-size='30' font-family='Arial'>IH</text></svg>",
    projectType: "Residential Development",
    location: "Kano, Nigeria",
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-5 w-5 ${
            index < rating
              ? "text-yellow-400 fill-current"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

const TestimonialCard = ({
  testimonial,
  isActive,
}: {
  testimonial: (typeof testimonials)[0];
  isActive: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isActive ? 1 : 0.6, scale: isActive ? 1 : 0.9 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 max-w-4xl mx-auto"
    >
      {/* Quote icon */}
      <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
        <Quote className="h-6 w-6 text-white" />
      </div>

      <div className="space-y-6">
        {/* Rating */}
        <div className="flex items-center justify-center">
          <StarRating rating={testimonial.rating} />
        </div>

        {/* Content */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 leading-relaxed text-center italic"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          "{testimonial.content}"
        </motion.blockquote>

        {/* Author info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 pt-6 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center space-x-4">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-16 h-16 rounded-full shadow-lg cursor-image"
            />
            <div className="text-center md:text-left">
              <h4
                className="text-lg font-bold text-slate-800 dark:text-white"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {testimonial.name}
              </h4>
              <p
                className="text-sm text-slate-600 dark:text-slate-400"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {testimonial.position}
              </p>
              <p
                className="text-sm font-medium text-orange-600 dark:text-orange-400"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {testimonial.company}
              </p>
            </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-slate-200 dark:bg-slate-700" />

          <div className="text-center md:text-left">
            <p
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {testimonial.projectType}
            </p>
            <p
              className="text-sm text-slate-500 dark:text-slate-400"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              📍 {testimonial.location}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="py-20 bg-slate-800 dark:bg-slate-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500" />
        <div
          className={
            'absolute inset-0 bg-[url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><circle cx="30" cy="30" r="1" fill="white" opacity="0.5"/></svg>\')] bg-repeat'
          }
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <span
              className="inline-block px-4 py-2 bg-orange-100/10 text-orange-300 rounded-full text-sm font-medium mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Client Testimonials
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What Our Clients Say About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              Our Excellence
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Don't just take our word for it. Hear from the leaders and
            organizations who have trusted us to bring their visions to life
            across Africa.
          </motion.p>
        </motion.div>

        {/* Testimonial slider */}
        <motion.div
          variants={itemVariants}
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main testimonial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <TestimonialCard
                testimonial={testimonials[currentIndex]}
                isActive={true}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation controls */}
          <div className="flex items-center justify-center space-x-8">
            <Button
              onClick={prevTestimonial}
              variant="outline"
              size="icon"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 rounded-full w-12 h-12 cursor-button"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Dots indicator */}
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 cursor-button ${
                    index === currentIndex
                      ? "bg-orange-400 w-8"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextTestimonial}
              variant="outline"
              size="icon"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 rounded-full w-12 h-12 cursor-button"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="mt-8 flex justify-center">
            <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-400 to-red-400"
                initial={{ width: "0%" }}
                animate={{ width: isAutoPlaying ? "100%" : "0%" }}
                transition={{ duration: 6, ease: "linear", repeat: Infinity }}
                key={currentIndex}
              />
            </div>
          </div>
        </motion.div>

        {/* Client logos */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 pt-16 border-t border-white/10"
        >
          <p
            className="text-center text-white/60 mb-8 text-lg"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Trusted by leading organizations across Africa
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 opacity-60">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-20 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
              >
                <div className="text-white/40 text-sm font-medium">
                  Client Logo {index + 1}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

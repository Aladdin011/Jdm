import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Award,
  Building2,
  Users,
  TrendingUp,
  CheckCircle,
  Heart,
  Timer,
  DollarSign,
} from "lucide-react";

interface Testimonial {
  id: number;
  type: "client" | "worker" | "collaboration";
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  quote: string;
  project?: {
    name: string;
    image: string;
    stats: { label: string; value: string }[];
  };
  achievements?: {
    projects: number;
    value: string;
    rating: number;
  };
  partnership?: {
    projects: number;
    results: { icon: React.ReactNode; text: string }[];
  };
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    type: "client",
    name: "Adunni Olatunde",
    role: "Property Developer",
    company: "Olatunde Developments",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b765?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    quote:
      "JD Marc's platform revolutionized how we manage our construction projects. We connected with skilled professionals across Lagos and completed our 20-unit residential complex 3 months ahead of schedule. The remote collaboration tools made communication seamless.",
    project: {
      name: "Luxury Residential Complex",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
      stats: [
        { label: "Units", value: "20" },
        { label: "Budget", value: "₦500M" },
        { label: "Location", value: "Lagos" },
      ],
    },
  },
  {
    id: 2,
    type: "worker",
    name: "Emeka Okwu",
    role: "Senior Construction Engineer",
    company: "15+ Years Experience",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    quote:
      "The platform opened up opportunities I never had before. I've worked on projects across three states without leaving my home base in Abuja. The quality of clients and projects has been exceptional, and the payment system gives me complete confidence.",
    achievements: {
      projects: 25,
      value: "₦50M",
      rating: 4.9,
    },
  },
  {
    id: 3,
    type: "collaboration",
    name: "Successful Partnership",
    role: "Bimpe Adeyemi & Tunde Bakare",
    company: "Client & Contractor",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    quote:
      "What started as a single project connection has become a long-term partnership. The platform's matching system paired us perfectly - Tunde's expertise in sustainable construction was exactly what our eco-friendly resort project needed.",
    partnership: {
      projects: 5,
      results: [
        {
          icon: <Building2 className="w-4 h-4" />,
          text: "5 Projects Completed",
        },
        {
          icon: <Heart className="w-4 h-4" />,
          text: "100% Sustainable Materials",
        },
        { icon: <Timer className="w-4 h-4" />, text: "20% Faster Delivery" },
        { icon: <DollarSign className="w-4 h-4" />, text: "15% Cost Savings" },
      ],
    },
  },
];

const TestimonialCard = ({
  testimonial,
  isActive,
}: {
  testimonial: Testimonial;
  isActive: boolean;
}) => {
  return (
    <motion.div
      className={`w-full flex-shrink-0 p-8 ${isActive ? "scale-100" : "scale-95"}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isActive ? 1 : 0.7, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-4xl mx-auto">
        {/* Card Header */}
        <div
          className={`p-8 bg-gradient-to-br ${
            testimonial.type === "client"
              ? "from-blue-50 to-cyan-50"
              : testimonial.type === "worker"
                ? "from-green-50 to-emerald-50"
                : "from-purple-50 to-pink-50"
          }`}
        >
          <div className="flex items-start gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg ${
                  testimonial.type === "client"
                    ? "bg-blue-500"
                    : testimonial.type === "worker"
                      ? "bg-green-500"
                      : "bg-purple-500"
                }`}
              >
                {testimonial.type === "client" ? (
                  <Building2 className="w-4 h-4" />
                ) : testimonial.type === "worker" ? (
                  <Users className="w-4 h-4" />
                ) : (
                  <Award className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {testimonial.name}
              </h3>
              <p className="text-lg text-gray-700 mb-1">{testimonial.role}</p>
              <p className="text-gray-500 mb-4">{testimonial.company}</p>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {testimonial.rating}.0
                </span>
              </div>
            </div>

            {/* Type Badge */}
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                testimonial.type === "client"
                  ? "bg-blue-100 text-blue-700"
                  : testimonial.type === "worker"
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-purple-700"
              }`}
            >
              {testimonial.type === "client"
                ? "Client Story"
                : testimonial.type === "worker"
                  ? "Worker Success"
                  : "Partnership"}
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="p-8">
          <div className="relative">
            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#AA7452]/20" />
            <blockquote className="text-xl text-gray-700 leading-relaxed pl-6 italic">
              "{testimonial.quote}"
            </blockquote>
          </div>
        </div>

        {/* Dynamic Content Based on Type */}
        <div className="px-8 pb-8">
          {testimonial.type === "client" && testimonial.project && (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Project Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">
                    {testimonial.project.name}
                  </h5>
                  <div className="grid grid-cols-3 gap-3">
                    {testimonial.project.stats.map((stat, index) => (
                      <div
                        key={index}
                        className="text-center p-3 bg-white rounded-lg"
                      >
                        <div className="text-lg font-bold text-[#AA7452]">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-600">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={testimonial.project.image}
                    alt={testimonial.project.name}
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {testimonial.type === "worker" && testimonial.achievements && (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Achievement Overview
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-[#AA7452] mb-1">
                    {testimonial.achievements.projects}
                  </div>
                  <div className="text-sm text-gray-600">
                    Projects Completed
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-[#AA7452] mb-1">
                    {testimonial.achievements.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Project Value
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-[#AA7452] mb-1">
                    {testimonial.achievements.rating}
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>
          )}

          {testimonial.type === "collaboration" && testimonial.partnership && (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Partnership Results
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {testimonial.partnership.results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg"
                  >
                    <div className="w-8 h-8 bg-[#AA7452]/10 rounded-lg flex items-center justify-center text-[#AA7452]">
                      {result.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {result.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function PremiumTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Auto-advance testimonials
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-gradient-to-r from-[#AA7452]/5 to-[#7C5841]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#AA7452]/10 border border-[#AA7452]/20 rounded-full text-[#AA7452] font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Award className="w-5 h-5" />
            <span>Success Stories</span>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Transforming Dreams into
            <br />
            <span className="bg-gradient-to-r from-[#AA7452] to-[#7C5841] bg-clip-text text-transparent">
              Reality
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Real stories from clients and workers who've experienced the power
            of our platform to deliver exceptional construction projects.
          </motion.p>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative">
          {/* Main Slider */}
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            <motion.div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                width: `${testimonials.length * 100}%`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  isActive={index === currentIndex}
                />
              ))}
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {/* Previous Button */}
            <motion.button
              onClick={goToPrev}
              className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-[#AA7452] hover:border-[#AA7452] transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#AA7452] w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            {/* Next Button */}
            <motion.button
              onClick={goToNext}
              className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-[#AA7452] hover:border-[#AA7452] transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Trust Metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            {
              icon: CheckCircle,
              number: "98.5%",
              label: "Project Success Rate",
            },
            { icon: Star, number: "4.9/5", label: "Average Rating" },
            { icon: TrendingUp, number: "24/7", label: "Platform Support" },
          ].map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={metric.label}
                className="text-center p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#AA7452]/30 hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className="w-16 h-16 bg-[#AA7452]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-[#AA7452]" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {metric.number}
                </div>
                <div className="text-gray-600">{metric.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

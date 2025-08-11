import React, { useState, useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Star,
  Quote,
  Play,
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  Award,
  MapPin,
  Calendar,
  Video,
  MessageSquare,
  Heart,
  TrendingUp,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Dr. Amina Ibrahim",
    role: "Managing Director",
    company: "Lagos Development Authority",
    location: "Lagos, Nigeria",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&q=80",
    rating: 5,
    project: "Lagos Smart City Complex",
    testimonial: "JD Marc Limited exceeded all our expectations. Their innovative approach to smart city development and attention to sustainability has set a new standard for urban planning in Nigeria. The project was delivered on time and within budget.",
    videoThumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80",
    hasVideo: true,
    metrics: {
      projectValue: "$45M",
      timeline: "24 months",
      satisfaction: "98%",
    },
    tags: ["Smart Cities", "Sustainability", "Innovation"],
  },
  {
    id: 2,
    name: "Chief Williams Okafor",
    role: "Chairman",
    company: "Okafor Holdings Ltd",
    location: "Abuja, Nigeria",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    rating: 5,
    project: "Abuja Financial District",
    testimonial: "Working with JD Marc was a game-changer for our business expansion. Their expertise in commercial construction and understanding of modern business needs resulted in a world-class facility that attracts top-tier tenants.",
    videoThumbnail: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&q=80",
    hasVideo: true,
    metrics: {
      projectValue: "$32M",
      timeline: "18 months",
      satisfaction: "96%",
    },
    tags: ["Commercial", "Business", "Quality"],
  },
  {
    id: 3,
    name: "Mrs. Sarah Adebayo",
    role: "Community Leader",
    company: "Kano Residents Association",
    location: "Kano, Nigeria",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    rating: 5,
    project: "Kano Residential Estate",
    testimonial: "The residential estate built by JD Marc has transformed our community. The quality of construction, modern amenities, and focus on family-friendly design has created a wonderful place to call home.",
    videoThumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80",
    hasVideo: false,
    metrics: {
      projectValue: "$28M",
      timeline: "20 months",
      satisfaction: "99%",
    },
    tags: ["Residential", "Community", "Family"],
  },
  {
    id: 4,
    name: "Engr. Femi Ogundipe",
    role: "State Commissioner",
    company: "Cross River State Government",
    location: "Cross River, Nigeria",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7c6b6?w=150&q=80",
    rating: 5,
    project: "Cross River Eco-Tourism Center",
    testimonial: "JD Marc's commitment to environmental sustainability in the eco-tourism center project showcased their ability to balance development with conservation. Their innovative green building techniques are remarkable.",
    videoThumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
    hasVideo: true,
    metrics: {
      projectValue: "$21M",
      timeline: "15 months",
      satisfaction: "97%",
    },
    tags: ["Eco-Tourism", "Sustainability", "Government"],
  },
];

const TestimonialCard = ({ testimonial, isActive }: { testimonial: any; isActive: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isActive ? 1 : 0.7, scale: isActive ? 1 : 0.95 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Content Side */}
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-100"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-arch-charcoal">{testimonial.name}</h4>
                  <p className="text-arch-orange font-medium">{testimonial.role}</p>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="relative mb-6">
              <Quote className="w-12 h-12 text-arch-orange/20 absolute -top-2 -left-2" />
              <p className="text-lg text-gray-700 leading-relaxed pl-8 relative z-10">
                {testimonial.testimonial}
              </p>
            </div>

            {/* Project Info */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-arch-orange" />
                <span className="font-semibold text-arch-charcoal">Project:</span>
                <span className="text-gray-700">{testimonial.project}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-arch-orange" />
                <span className="text-gray-600">{testimonial.location}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Object.entries(testimonial.metrics).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-arch-orange">{value}</div>
                  <div className="text-xs text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {testimonial.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-arch-orange/10 text-arch-orange rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Media Side */}
          <div className="relative h-64 lg:h-full">
            <img
              src={testimonial.videoThumbnail}
              alt={`${testimonial.project} project`}
              className="w-full h-full object-cover"
            />
            
            {/* Video Overlay */}
            {testimonial.hasVideo && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <motion.button
                  className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-arch-orange hover:scale-110 transition-transform duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 ml-1" />
                </motion.button>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-arch-charcoal/10 to-transparent" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function PremiumTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance testimonials
  React.useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial();
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y }}
          className="absolute top-20 -left-40 w-80 h-80 bg-gradient-to-r from-arch-orange/5 to-arch-rust/5 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y.get() * -0.5 }}
          className="absolute bottom-20 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 bg-arch-orange/10 border border-arch-orange/20 rounded-full text-arch-orange font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Client Success Stories</span>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-arch-charcoal mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Trusted by Leaders
            <br />
            <span className="bg-gradient-to-r from-arch-orange to-arch-rust bg-clip-text text-transparent">
              Across Africa
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Hear from the visionary leaders and organizations who have partnered
            with us to transform their infrastructure and build sustainable
            communities across the African continent.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[
              { number: "500+", label: "Happy Clients", icon: Users },
              { number: "98%", label: "Satisfaction Rate", icon: Heart },
              { number: "50+", label: "5-Star Reviews", icon: Star },
              { number: "15+", label: "Countries Served", icon: MapPin },
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                    <IconComponent className="w-6 h-6 text-arch-orange mx-auto mb-2" />
                    <div className="text-2xl font-bold text-arch-charcoal">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Testimonial Display */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <TestimonialCard
              key={currentTestimonial}
              testimonial={testimonials[currentTestimonial]}
              isActive={true}
            />
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <motion.button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:border-arch-orange hover:text-arch-orange transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-arch-orange w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:border-arch-orange hover:text-arch-orange transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-arch-charcoal mb-4">
            Ready to Join Our Success Stories?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Partner with JD Marc Limited and become part of Africa's
            infrastructure transformation story.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-8 py-4 bg-arch-orange text-white rounded-xl font-semibold hover:bg-arch-rust transition-colors duration-300 flex items-center gap-2 justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Your Project</span>
              <Building2 className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-arch-orange hover:text-arch-orange transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Testimonials
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

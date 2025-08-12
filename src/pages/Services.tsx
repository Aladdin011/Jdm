import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { services } from "@/data/services";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { 
  CheckCircle, 
  ArrowRight, 
  Building2, 
  Zap, 
  Clock, 
  Shield,
  Users,
  Target,
  Award,
  TrendingUp,
  Settings,
  Sparkles,
  Construction,
  Home,
  Briefcase,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Floating background elements
const FloatingElement = ({ 
  className, 
  delay = 0, 
  duration = 20 
}: { 
  className: string; 
  delay?: number; 
  duration?: number; 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
    animate={{ 
      opacity: [0.05, 0.15, 0.05], 
      scale: [0.8, 1.2, 0.8], 
      rotate: [0, 180, 360],
      x: [0, 50, -50, 0],
      y: [0, -30, 30, 0] 
    }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
    className={cn("absolute rounded-full", className)}
  />
);

// Enhanced service card component
const ServiceCard = ({ 
  service, 
  index 
}: { 
  service: any; 
  index: number; 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2, type: "spring", bounce: 0.3 }}
      viewport={{ once: true }}
      className="mb-32 last:mb-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-16 items-center`}>
        {/* Enhanced Image Section */}
        <motion.div 
          className="w-full lg:w-1/2"
          whileHover={{ scale: 1.02, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#AA7452]/20 to-[#7C5841]/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-[#051822]/10 to-[#2D383E]/10 rounded-full blur-2xl" />
            
            <div className="relative aspect-[4/3] overflow-hidden">
              <motion.img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  filter: isHovered ? "brightness(1.1)" : "brightness(1)"
                }}
                transition={{ duration: 0.7 }}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#051822]/60 via-transparent to-transparent" />
              
              {/* Floating badge */}
              <motion.div 
                className="absolute top-6 right-6 bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white px-6 py-3 rounded-full font-bold shadow-xl"
                animate={{ y: isHovered ? -5 : 0 }}
                transition={{ duration: 0.3 }}
              >
                Premium Service
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Content Section */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Service header */}
            <div className="flex items-center gap-6 mb-8">
              <motion.div 
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#AA7452]/20 to-[#7C5841]/20 text-[#AA7452] flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <service.icon size={32} />
              </motion.div>
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-[#051822] mb-2">
                  {service.title}
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-[#AA7452] to-[#7C5841] rounded-full" />
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {service.fullDescription}
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {service.features.map((feature: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#AA7452]/5 to-[#7C5841]/5 rounded-xl border border-[#AA7452]/10"
                >
                  <CheckCircle className="text-[#AA7452] mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white hover:shadow-lg hover:shadow-[#AA7452]/30 transition-all duration-300 px-8 py-6 text-lg font-bold rounded-2xl"
                >
                  <Link to="/contact" className="flex items-center gap-2">
                    Request Service
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="border-2 border-[#AA7452] text-[#AA7452] hover:bg-[#AA7452] hover:text-white px-8 py-6 text-lg font-bold rounded-2xl transition-all duration-300"
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Process step component
const ProcessStep = ({ 
  step, 
  title, 
  description, 
  icon: Icon, 
  index 
}: { 
  step: string; 
  title: string; 
  description: string; 
  icon: any; 
  index: number; 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay: index * 0.15, type: "spring", bounce: 0.4 }}
    viewport={{ once: true }}
    className="group"
  >
    <motion.div 
      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-[#AA7452]/30 h-full relative overflow-hidden"
      whileHover={{ y: -10, scale: 1.02 }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#AA7452]/5 to-transparent rounded-full blur-xl" />
      
      {/* Step number */}
      <div className="text-6xl font-black text-[#AA7452]/20 mb-6 relative z-10">
        {step}
      </div>
      
      {/* Icon */}
      <motion.div 
        className="w-16 h-16 bg-gradient-to-br from-[#AA7452]/20 to-[#7C5841]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <Icon className="w-8 h-8 text-[#AA7452]" />
      </motion.div>
      
      {/* Content */}
      <h3 className="text-xl font-black text-[#051822] mb-4 group-hover:text-[#AA7452] transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  </motion.div>
);

export default function Services() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Apply construction color system
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-dark', '#051822');
    root.style.setProperty('--secondary-dark', '#2D383E');
    root.style.setProperty('--accent-warm', '#7C5841');
    root.style.setProperty('--accent-light', '#AA7452');
    root.style.setProperty('--neutral-mid', '#969A9E');
    root.style.setProperty('--neutral-light', '#D4C9C7');
  }, []);

  const processSteps = [
    {
      step: "01",
      title: "Discovery & Consultation",
      description: "We begin by understanding your vision, requirements, and goals through comprehensive consultation and site analysis.",
      icon: Users
    },
    {
      step: "02",
      title: "Strategic Planning & Design",
      description: "Our experts develop detailed architectural plans and engineering designs tailored to your specific needs and budget.",
      icon: Target
    },
    {
      step: "03",
      title: "Premium Construction",
      description: "We execute the project with precision using premium materials, skilled craftsmanship, and cutting-edge construction technology.",
      icon: Construction
    },
    {
      step: "04",
      title: "Quality Assurance & Handover",
      description: "After thorough quality checks and inspections, we deliver your project on time, within budget, and to specification.",
      icon: Award
    }
  ];

  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          y: heroY,
          opacity: heroOpacity,
          background: "linear-gradient(135deg, #051822 0%, #2D383E 50%, #7C5841 100%)"
        }}
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
          <FloatingElement 
            className="top-20 left-20 w-48 h-48 bg-gradient-to-r from-[#D4C9C7]/5 to-[#AA7452]/3 blur-3xl" 
            delay={0}
            duration={25}
          />
          <FloatingElement 
            className="top-40 right-32 w-40 h-40 bg-gradient-to-r from-[#AA7452]/10 to-[#7C5841]/5 blur-2xl" 
            delay={8}
            duration={30}
          />
          <FloatingElement 
            className="bottom-32 left-40 w-44 h-44 bg-gradient-to-r from-white/5 to-[#D4C9C7]/5 blur-3xl" 
            delay={15}
            duration={35}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.4 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#AA7452]/20 to-[#7C5841]/10 backdrop-blur-xl border border-[#AA7452]/30 rounded-full text-[#D4C9C7] font-semibold mb-8 shadow-2xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Building2 className="w-6 h-6 text-[#AA7452]" />
              </motion.div>
              <span className="text-lg">Comprehensive Construction Solutions</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-none tracking-tight"
            >
              <span className="block">Premium</span>
              <motion.span 
                className="block bg-gradient-to-r from-[#AA7452] via-[#7C5841] to-[#D4C9C7] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Construction Services
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-xl md:text-2xl text-[#D4C9C7] mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Comprehensive construction solutions tailored to your specific needs, 
              delivered with <span className="text-[#AA7452] font-semibold">expertise</span>, 
              <span className="text-[#D4C9C7] font-semibold"> quality</span>, and 
              attention to detail across Africa and beyond.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              {[
                { number: "500+", label: "Projects Delivered" },
                { number: "15+", label: "Years Experience" },
                { number: "50+", label: "Cities Served" }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + (i * 0.1) }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-black text-[#AA7452] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-[#D4C9C7] text-sm font-medium tracking-wide uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Services Overview */}
      <section className="py-32 bg-gradient-to-b from-white via-[#D4C9C7]/5 to-gray-50/50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#AA7452]/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-40 -right-40 w-96 h-96 bg-gradient-to-l from-[#7C5841]/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#AA7452]/10 to-[#7C5841]/10 rounded-full text-[#7C5841] font-semibold mb-8"
            >
              <Sparkles className="w-5 h-5" />
              <span>What We Offer</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-[#051822] mb-8 leading-tight">
              Excellence in Every <span className="text-[#AA7452]">Project</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From concept to completion, we provide a full range of construction services 
              across residential, commercial, and infrastructure sectors with unmatched quality.
            </p>
          </motion.div>

          {/* Enhanced Service Cards */}
          <div className="max-w-7xl mx-auto">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Process Section */}
      <section className="py-32 bg-gradient-to-b from-gray-50/50 via-white to-[#D4C9C7]/5 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#051822]/10 to-[#2D383E]/10 rounded-full text-[#051822] font-semibold mb-8"
            >
              <Settings className="w-5 h-5" />
              <span>Our Process</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-[#051822] mb-8 leading-tight">
              Proven <span className="text-[#AA7452]">Methodology</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We follow a systematic approach to ensure every project is completed 
              to the highest standards of quality, on time, and within budget.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {processSteps.map((step, index) => (
              <ProcessStep key={step.step} {...step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section 
        className="py-32 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #051822 0%, #2D383E 50%, #7C5841 100%)"
        }}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-[#AA7452]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-l from-[#D4C9C7]/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
              Ready to Start Your <span className="text-[#AA7452]">Dream Project</span>?
            </h2>
            <p className="text-xl text-[#D4C9C7] mb-12 max-w-3xl mx-auto leading-relaxed">
              Contact us today to discuss your construction needs and discover how 
              JD Marc can transform your vision into reality with our premium services.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white hover:shadow-xl hover:shadow-[#AA7452]/30 transition-all duration-300 px-12 py-6 text-xl font-bold rounded-2xl"
                >
                  <Link to="/contact" className="flex items-center gap-3">
                    Get Started Today
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-[#D4C9C7] text-[#D4C9C7] hover:bg-[#D4C9C7] hover:text-[#051822] px-12 py-6 text-xl font-bold rounded-2xl transition-all duration-300"
                >
                  <Link to="/projects">
                    View Our Work
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

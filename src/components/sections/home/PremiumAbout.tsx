import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  Award, 
  Calendar, 
  Users, 
  MapPin, 
  Target, 
  Lightbulb,
  Zap,
  Building2,
  Globe2,
  CheckCircle,
  ArrowRight,
  Play,
  TrendingUp
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

// Company stats data
const companyStats = [
  { 
    value: "15+", 
    label: "Years of Excellence", 
    icon: <Calendar className="w-6 h-6" />,
    description: "Since 2007",
    color: "from-blue-500 to-blue-600"
  },
  { 
    value: "500+", 
    label: "Projects Completed", 
    icon: <Building2 className="w-6 h-6" />,
    description: "Across Africa",
    color: "from-green-500 to-green-600"
  },
  { 
    value: "50M+", 
    label: "Investment Value", 
    icon: <TrendingUp className="w-6 h-6" />,
    description: "USD Total",
    color: "from-purple-500 to-purple-600"
  },
  { 
    value: "98%", 
    label: "Client Satisfaction", 
    icon: <Award className="w-6 h-6" />,
    description: "Success Rate",
    color: "from-orange-500 to-red-500"
  }
];

// Core values data
const coreValues = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Excellence",
    description: "We deliver world-class construction projects that exceed expectations and set new industry standards.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Innovation",
    description: "Pioneering smart construction technologies and sustainable building practices for Africa's future.",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Collaboration",
    description: "Building strong partnerships with clients, communities, and stakeholders across all our projects.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Globe2 className="w-8 h-8" />,
    title: "Sustainability",
    description: "Committed to environmentally responsible construction that preserves Africa's natural heritage.",
    color: "from-purple-500 to-pink-500"
  }
];

// Achievements data
const achievements = [
  "First Nigerian construction company to implement IoT-enabled project management",
  "ISO 9001:2015 certified for quality management systems",
  "Winner of Africa Construction Excellence Award 2023",
  "Carbon-neutral construction practices since 2020",
  "Remote workforce platform serving 10+ African countries",
  "LEED Gold certification for 15+ completed projects"
];

// Animated counter component
const AnimatedCounter = ({ value, duration = 2000 }: { value: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  
  // Extract number from value string
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');

  React.useEffect(() => {
    if (isInView && numericValue) {
      const startTime = Date.now();
      const endTime = startTime + duration;
      
      const updateCounter = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(numericValue * easeOutCubic);
        
        setCount(currentValue);
        
        if (now < endTime) {
          requestAnimationFrame(updateCounter);
        }
      };
      
      requestAnimationFrame(updateCounter);
    }
  }, [isInView, numericValue, duration]);

  return (
    <div ref={ref} className="font-bold text-4xl md:text-5xl">
      {count}{suffix}
    </div>
  );
};

// Individual stat card component
const StatCard = ({ stat, index }: { stat: typeof companyStats[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative p-8 bg-white rounded-2xl shadow-lg border border-gray-100 group cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
    >
      {/* Background gradient on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0`}
        animate={{ opacity: isHovered ? 0.05 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Icon */}
      <motion.div
        className={`w-16 h-16 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-6`}
        animate={{ 
          rotate: isHovered ? 360 : 0,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.6 }}
      >
        {stat.icon}
      </motion.div>

      {/* Value */}
      <div className="text-gray-800 mb-2">
        <AnimatedCounter value={stat.value} />
      </div>

      {/* Label */}
      <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
        {stat.label}
      </h4>

      {/* Description */}
      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
        {stat.description}
      </p>

      {/* Hover arrow */}
      <motion.div
        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{ x: isHovered ? 0 : 10 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </motion.div>
    </motion.div>
  );
};

// Values card component
const ValueCard = ({ value, index }: { value: typeof coreValues[0]; index: number }) => (
  <motion.div
    className="group p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
  >
    {/* Icon */}
    <motion.div
      className={`w-16 h-16 rounded-xl bg-gradient-to-r ${value.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
    >
      {value.icon}
    </motion.div>

    {/* Content */}
    <h4 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors">
      {value.title}
    </h4>
    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
      {value.description}
    </p>
  </motion.div>
);

// Company overview component
const CompanyOverview = () => {
  const { trackUserInteraction } = useAppStore();

  const handleWatchStory = () => {
    trackUserInteraction('about-watch-story');
  };

  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* Left Content */}
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div>
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Building2 className="w-4 h-4" />
            About JD Marc Limited
          </motion.div>

          <h2 className="text-heading-xl mb-6">
            Building Africa's
            <br />
            <span className="gradient-text">Infrastructure Legacy</span>
          </h2>

          <p className="text-body-lg text-gray-600 leading-relaxed mb-8">
            Since 2007, JD Marc Limited has been at the forefront of Africa's construction revolution. 
            With offices in Abuja, London, and New York, we combine international expertise with 
            deep local knowledge to deliver world-class infrastructure projects that transform communities.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Our Mission
            </h4>
            <p className="text-blue-700 leading-relaxed">
              To transform Africa's urban landscape through innovative construction and infrastructure 
              solutions that are sustainable, intelligent, and community-focused.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Our Vision
            </h4>
            <p className="text-green-700 leading-relaxed">
              To be Africa's leading construction company, pioneering smart cities and sustainable 
              development that enhances quality of life for millions across the continent.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="btn-primary-premium">
            <span>Our Story</span>
            <ArrowRight className="btn-icon" />
          </button>
          <button 
            onClick={handleWatchStory}
            className="btn-secondary-premium"
          >
            <Play className="w-5 h-5" />
            <span>Watch Story</span>
          </button>
        </div>
      </motion.div>

      {/* Right Content - Achievements */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Key Achievements</h3>
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ x: 8 }}
            >
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700 leading-relaxed">{achievement}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default function PremiumAbout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"
        style={{ y }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-orange-200/20 to-red-200/20 rounded-full blur-3xl"
        style={{ y: y.get() * -0.5 }}
      />

      <div className="container-fluid relative z-10">
        {/* Company Overview */}
        <CompanyOverview />

        {/* Stats Section */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h3 className="text-heading-lg mb-4">Our Impact in Numbers</h3>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              Measurable results that demonstrate our commitment to excellence 
              and innovation in African construction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Core Values */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h3 className="text-heading-lg mb-4">Our Core Values</h3>
            <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide every project, partnership, and 
              innovation in our journey to build Africa's future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Global Presence */}
        <motion.div
          className="mt-24 text-center p-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Globe2 className="w-16 h-16 mx-auto mb-6 text-orange-400" />
          <h3 className="text-3xl font-bold mb-4">Global Reach, Local Impact</h3>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
            Operating from three continents with deep African roots, we bring international 
            standards and global best practices to every local project, creating lasting 
            value for communities across Africa.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>Abuja, Nigeria</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>London, United Kingdom</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>New York, United States</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

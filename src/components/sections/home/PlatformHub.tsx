import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Smartphone, 
  Users, 
  MapPin, 
  Clock, 
  DollarSign, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Globe,
  BarChart3,
  MessageSquare,
  Star,
  Sparkles,
  Monitor,
  Layers,
  Activity
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

// Platform features data
const platformFeatures = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Skilled Professional Network",
    description: "Access verified construction professionals across Nigeria",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Real-time Project Tracking",
    description: "Monitor progress with GPS-enabled location tracking",
    color: "from-green-400 to-emerald-400"
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Secure Payment Gateway",
    description: "Automated payments with milestone-based releases",
    color: "from-yellow-400 to-orange-400"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Quality Assurance",
    description: "Built-in quality control and verification systems",
    color: "from-purple-400 to-pink-400"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Timeline Optimization",
    description: "AI-powered scheduling for maximum efficiency",
    color: "from-red-400 to-rose-400"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Performance Analytics",
    description: "Detailed insights and project performance metrics",
    color: "from-indigo-400 to-blue-400"
  }
];

// Platform stats
const platformStats = [
  { value: "10,000+", label: "Active Professionals", icon: <Users className="w-6 h-6" />, color: "from-blue-400 to-cyan-400" },
  { value: "500+", label: "Completed Projects", icon: <CheckCircle className="w-6 h-6" />, color: "from-green-400 to-emerald-400" },
  { value: "98%", label: "Client Satisfaction", icon: <Star className="w-6 h-6" />, color: "from-yellow-400 to-orange-400" },
  { value: "24/7", label: "Platform Support", icon: <MessageSquare className="w-6 h-6" />, color: "from-purple-400 to-pink-400" }
];

// Glass Feature Card Component
const GlassFeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      className="group relative cursor-pointer"
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
        
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
        
        {/* Floating icon background */}
        <motion.div
          className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-xl`}
          animate={isHovered ? { scale: 1.2, rotate: 180 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.6 }}
        />

        <div className="relative z-10 space-y-4">
          {/* Icon */}
          <motion.div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 text-white shadow-lg backdrop-blur-sm`}
            whileHover={{ 
              scale: 1.1, 
              rotate: 10,
              boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)"
            }}
            transition={{ duration: 0.4 }}
          >
            {feature.icon}
          </motion.div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white group-hover:text-orange-200 transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-white/70 group-hover:text-white/85 transition-colors duration-300 leading-relaxed">
              {feature.description}
            </p>
          </div>

          {/* Learn more link */}
          <motion.div
            className="flex items-center gap-2 text-orange-300 hover:text-orange-200 font-medium pt-2"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-sm">Explore Feature</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Glass shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
        />
      </div>
    </motion.div>
  );
};

// Glass Stats Card Component
const GlassStatsCard = ({ stat, index }: { stat: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true });

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="relative p-6 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 hover:border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 text-center group overflow-hidden">
        
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-xl`} />
        
        <div className="relative z-10 space-y-3">
          {/* Icon */}
          <motion.div
            className={`w-12 h-12 mx-auto rounded-lg bg-gradient-to-br ${stat.color} p-2.5 text-white shadow-lg`}
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {stat.icon}
          </motion.div>

          {/* Value */}
          <div className="text-3xl font-bold text-white group-hover:text-orange-200 transition-colors duration-300">
            {stat.value}
          </div>

          {/* Label */}
          <div className="text-white/70 group-hover:text-white/85 transition-colors duration-300 font-medium">
            {stat.label}
          </div>
        </div>

        {/* Hover glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-xl blur-xl`} />
      </div>
    </motion.div>
  );
};

// Interactive Platform Showcase
const PlatformShowcase = () => {
  const [activeView, setActiveView] = useState(0);
  const views = [
    { name: "Dashboard", icon: <Monitor className="w-5 h-5" /> },
    { name: "Projects", icon: <Layers className="w-5 h-5" /> },
    { name: "Analytics", icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <div className="relative">
      {/* Glass container */}
      <div className="relative p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 p-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            {views.map((view, index) => (
              <motion.button
                key={view.name}
                onClick={() => setActiveView(index)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  activeView === index
                    ? 'bg-orange-500/20 text-orange-200 border border-orange-400/30'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {view.icon}
                <span>{view.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Platform Preview */}
          <motion.div
            className="relative h-80 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 overflow-hidden"
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Simulated content based on active view */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{views[activeView].name} Overview</h3>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              
              {/* Dynamic content grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-16 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                  >
                    <div className="h-2 bg-orange-400/50 rounded mb-2" />
                    <div className="h-2 bg-white/30 rounded w-2/3" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 animate-bounce" />
            <div className="absolute bottom-6 left-6 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-30 animate-pulse" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default function PlatformHub() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      id="platform" 
      ref={sectionRef} 
      className="relative py-32 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-32 left-10 w-80 h-80 bg-gradient-to-r from-orange-500/15 to-amber-500/15 rounded-full blur-3xl"
        style={{ y }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-32 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        style={{ y: y.get() * -0.8 }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, -150, -30],
              x: [-15, 15, -15],
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          style={{ opacity }}
          className="text-center mb-20"
        >
          {/* Glass Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 backdrop-blur-xl border border-blue-400/20 text-blue-300 rounded-full text-sm font-medium mb-8 shadow-lg"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Globe className="w-4 h-4" />
            Digital Platform
          </motion.div>

          {/* Main Title */}
          <motion.h2
            className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Revolutionary
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Construction Platform
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Connect with skilled professionals, manage projects efficiently, and transform 
            the way construction works across Africa with our intelligent digital platform.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {platformStats.map((stat, index) => (
            <GlassStatsCard key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>

        {/* Platform Showcase */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <PlatformShowcase />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {platformFeatures.map((feature, index) => (
            <GlassFeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Glass CTA Container */}
          <div className="relative inline-block p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Construction Business?
              </h3>
              <p className="text-white/80 max-w-2xl mx-auto">
                Join thousands of professionals already using our platform to deliver exceptional results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-xl font-semibold shadow-2xl hover:shadow-blue-500/30 backdrop-blur-sm border border-blue-300/30 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <span>Join Platform</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </motion.button>
                
                <motion.button
                  className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl font-semibold hover:bg-white/15 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    <span>Watch Demo</span>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

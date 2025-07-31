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
  Star
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

// Platform features data
const platformFeatures = [
  {
    icon: <Users className="w-5 h-5" />,
    title: "Skilled Professional Network",
    description: "Access verified construction professionals across Nigeria"
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Real-time Project Tracking",
    description: "Monitor progress with GPS-enabled location tracking"
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    title: "Secure Payment Gateway",
    description: "Automated payments with milestone-based releases"
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Quality Assurance",
    description: "Built-in quality control and verification systems"
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Timeline Optimization",
    description: "AI-powered scheduling for maximum efficiency"
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Performance Analytics",
    description: "Detailed insights and project performance metrics"
  }
];

// Platform stats
const platformStats = [
  { value: "10,000+", label: "Active Professionals", icon: <Users className="w-6 h-6" /> },
  { value: "500+", label: "Completed Projects", icon: <CheckCircle className="w-6 h-6" /> },
  { value: "98%", label: "Client Satisfaction", icon: <Star className="w-6 h-6" /> },
  { value: "24/7", label: "Platform Support", icon: <MessageSquare className="w-6 h-6" /> }
];

// Interactive mobile mockup component
const MobileMockup = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Dashboard", "Projects", "Professionals", "Messages"];

  const mockScreens = [
    // Dashboard Screen
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Project Dashboard</h3>
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-xs text-blue-500">Active Projects</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-600">85%</div>
          <div className="text-xs text-green-500">Completion Rate</div>
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded"></div>
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>,
    // Projects Screen
    <div className="space-y-4 p-4">
      <h3 className="font-semibold text-gray-800">Current Projects</h3>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white border border-gray-200 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="h-3 bg-gray-300 rounded w-24"></div>
            <div className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">Active</div>
          </div>
          <div className="space-y-1">
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>Progress: {60 + i * 10}%</span>
            <span>Due: {i + 2} days</span>
          </div>
        </div>
      ))}
    </div>,
    // Professionals Screen
    <div className="space-y-4 p-4">
      <h3 className="font-semibold text-gray-800">Find Professionals</h3>
      <div className="flex gap-2">
        {["All", "Architects", "Engineers", "Contractors"].map(cat => (
          <div key={cat} className="px-2 py-1 bg-gray-100 text-xs rounded">{cat}</div>
        ))}
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-300 rounded mb-1 w-20"></div>
            <div className="h-2 bg-gray-200 rounded w-16"></div>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          <button className="px-3 py-1 bg-orange-500 text-white text-xs rounded">Hire</button>
        </div>
      ))}
    </div>,
    // Messages Screen
    <div className="space-y-4 p-4">
      <h3 className="font-semibold text-gray-800">Messages</h3>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-300 rounded w-20"></div>
              <div className="text-xs text-gray-400">2h</div>
            </div>
            <div className="h-2 bg-gray-200 rounded mt-1"></div>
          </div>
          {i <= 2 && <div className="w-2 h-2 bg-red-400 rounded-full"></div>}
        </div>
      ))}
    </div>
  ];

  return (
    <motion.div
      className="relative mx-auto"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Phone Frame */}
      <div className="relative w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2">
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
            <div className="text-sm font-semibold">9:41</div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-gray-400 rounded-sm">
                <div className="w-3 h-1 bg-green-500 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === index
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Screen Content */}
          <motion.div
            key={activeTab}
            className="h-full overflow-y-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {mockScreens[activeTab]}
          </motion.div>
        </div>

        {/* Floating Action Button */}
        <motion.div
          className="absolute bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <Globe className="w-4 h-4 text-white" />
      </motion.div>

      <motion.div
        className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Zap className="w-3 h-3 text-white" />
      </motion.div>
    </motion.div>
  );
};

// Feature list component
const FeatureList = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-6">
      {platformFeatures.map((feature, index) => (
        <motion.div
          key={feature.title}
          className="flex items-start gap-4 group"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <motion.div
            className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            {feature.icon}
          </motion.div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
              {feature.title}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ x: 5 }}
          >
            <ArrowRight className="w-5 h-5 text-orange-500" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

// Stats grid component
const StatsGrid = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
    {platformStats.map((stat, index) => (
      <motion.div
        key={stat.label}
        className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      >
        <motion.div
          className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white mx-auto mb-4"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          {stat.icon}
        </motion.div>
        <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
        <div className="text-sm text-gray-600">{stat.label}</div>
      </motion.div>
    ))}
  </div>
);

export default function PlatformHub() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const { trackUserInteraction } = useAppStore();

  const handleJoinPlatform = () => {
    trackUserInteraction('platform-join-cta');
  };

  const handleWatchDemo = () => {
    trackUserInteraction('platform-demo-cta');
  };

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-orange-200/30 to-red-200/30 rounded-full blur-3xl"
        style={{ y }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
        style={{ y: y.get() * -0.5 }}
      />

      <div className="container-fluid relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Smartphone className="w-4 h-4" />
            Platform Connection Hub
          </motion.div>

          <h2 className="text-heading-xl mb-6">
            Connect. Build. Deliver.
            <br />
            <span className="gradient-text">All in One Platform</span>
          </h2>

          <p className="text-body-lg max-w-3xl mx-auto">
            Our revolutionary platform seamlessly connects skilled construction 
            professionals with clients across Nigeria, enabling remote project 
            management and real-time collaboration.
          </p>
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="split-layout items-center">
          {/* Left Content */}
          <motion.div
            className="content-side space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-heading-lg mb-6">
                Remote Workforce Platform
              </h3>
              <p className="text-body-lg text-gray-600 mb-8 leading-relaxed">
                Seamlessly connect workers and clients across Nigeria with our 
                intelligent platform that ensures quality, transparency, and 
                efficient project delivery from anywhere.
              </p>
            </div>

            <FeatureList />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                className="btn-primary-premium"
                onClick={handleJoinPlatform}
              >
                <span>Join Platform</span>
                <ArrowRight className="btn-icon" />
              </button>
              <button 
                className="btn-secondary-premium"
                onClick={handleWatchDemo}
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </motion.div>

          {/* Right Content - Interactive Mockup */}
          <motion.div
            className="visual-side flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <MobileMockup />
          </motion.div>
        </div>

        {/* Platform Stats */}
        <StatsGrid />

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20 p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Construction Business?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of professionals already using our platform to deliver 
            exceptional construction projects across Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary-premium">
              <span>Get Started Free</span>
              <ArrowRight className="btn-icon" />
            </button>
            <button className="btn-ghost border border-white/20 text-white hover:bg-white/10">
              <span>Schedule Demo</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

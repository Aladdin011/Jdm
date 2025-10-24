import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
  Activity,
  Brain,
  Wifi,
  Cpu,
} from "lucide-react";

// Platform features data
const platformFeatures = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Smart Matching Algorithm",
    description:
      "AI-powered system connects the right professionals with perfect projects",
    color: "from-blue-400 to-cyan-400",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Real-time Communication",
    description:
      "Instant messaging, video calls, and project updates keep everyone connected",
    color: "from-green-400 to-emerald-400",
  },
  {
    icon: <Monitor className="w-6 h-6" />,
    title: "Project Management Suite",
    description:
      "Comprehensive tools for planning, tracking, and delivering projects on time",
    color: "from-purple-400 to-pink-400",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Quality Assurance",
    description: "Built-in quality control and verification systems",
    color: "from-orange-400 to-red-400",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Secure Payment Gateway",
    description: "Automated payments with milestone-based releases",
    color: "from-yellow-400 to-orange-400",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Performance Analytics",
    description: "Detailed insights and project performance metrics",
    color: "from-indigo-400 to-blue-400",
  },
];

// Platform stats
const platformStats = [
  {
    value: "1,200+",
    label: "Active Users",
    icon: <Users className="w-6 h-6" />,
    color: "from-blue-400 to-cyan-400",
  },
  {
    value: "500+",
    label: "Projects",
    icon: <CheckCircle className="w-6 h-6" />,
    color: "from-green-400 to-emerald-400",
  },
  {
    value: "₦2B+",
    label: "Project Value",
    icon: <DollarSign className="w-6 h-6" />,
    color: "from-yellow-400 to-orange-400",
  },
  {
    value: "98%",
    label: "Success Rate",
    icon: <Star className="w-6 h-6" />,
    color: "from-purple-400 to-pink-400",
  },
];

// Network Animation Component
const NetworkAnimation = () => {
  const nodes = [
    { id: 1, x: 15, y: 20, delay: 0 },
    { id: 2, x: 80, y: 60, delay: 1 },
    { id: 3, x: 60, y: 30, delay: 2 },
    { id: 4, x: 20, y: 70, delay: 1.5 },
  ];

  const connections = [
    { from: nodes[0], to: nodes[1], delay: 0.5 },
    { from: nodes[1], to: nodes[2], delay: 1.5 },
    { from: nodes[2], to: nodes[3], delay: 2.5 },
    { from: nodes[3], to: nodes[0], delay: 3.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Network Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute w-3 h-3 bg-[#AA7452] rounded-full"
          style={{
            top: `${node.y}%`,
            left: `${node.x}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: node.delay,
          }}
        >
          <div className="absolute inset-0 bg-[#AA7452] rounded-full animate-ping opacity-30" />
        </motion.div>
      ))}

      {/* Network Connections */}
      {connections.map((connection, index) => {
        const deltaX = connection.to.x - connection.from.x;
        const deltaY = connection.to.y - connection.from.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        return (
          <motion.div
            key={index}
            className="absolute h-0.5 bg-gradient-to-r from-[#AA7452] via-[#7C5841] to-transparent origin-left"
            style={{
              top: `${connection.from.y}%`,
              left: `${connection.from.x}%`,
              width: `${distance * 0.8}%`,
              transform: `rotate(${angle}deg)`,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: connection.delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

// Glass Feature Card Component
const GlassFeatureCard = ({
  feature,
  index,
}: {
  feature: any;
  index: number;
}) => {
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
      <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 shadow-2xl hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
        />

        {/* Floating icon background */}
        <motion.div
          className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-xl`}
          animate={
            isHovered ? { scale: 1.2, rotate: 180 } : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.6 }}
        />

        <div className="relative z-10 space-y-4">
          {/* Icon */}
          <motion.div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 text-white shadow-lg backdrop-blur-sm`}
            whileHover={{
              scale: 1.1,
              rotate: 10,
              boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)",
            }}
            transition={{ duration: 0.4 }}
          >
            {feature.icon}
          </motion.div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white group-hover:text-[#D4C9C7] transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-white/70 group-hover:text-white/85 transition-colors duration-300 leading-relaxed">
              {feature.description}
            </p>
          </div>

          {/* Learn more link */}
          <motion.div
            className="flex items-center gap-2 text-[#AA7452] hover:text-[#D4C9C7] font-medium pt-2"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-sm">Explore Feature</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Glass shine effect */}
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </div>
    </motion.div>
  );
};

// Interactive Platform Demo
const PlatformDemo = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    {
      name: "Workers",
      icon: <Users className="w-5 h-5" />,
      color: "from-blue-400 to-cyan-400",
    },
    {
      name: "Clients",
      icon: <Monitor className="w-5 h-5" />,
      color: "from-green-400 to-emerald-400",
    },
    {
      name: "Platform",
      icon: <Activity className="w-5 h-5" />,
      color: "from-purple-400 to-pink-400",
    },
  ];

  const mockData = {
    workers: {
      title: "Worker Dashboard",
      projects: [
        {
          name: "Commercial Plaza - Lagos",
          budget: "₦5,000,000",
          status: "Available",
        },
        {
          name: "Residential Complex - Abuja",
          budget: "₦8,500,000",
          status: "Available",
        },
      ],
    },
    clients: {
      title: "Client Dashboard",
      projects: [
        { name: "Office Building Renovation", progress: 65, team: 8 },
        { name: "Warehouse Construction", progress: 30, team: 12 },
      ],
    },
    platform: {
      title: "Platform Analytics",
      metrics: [
        { label: "Active Projects", value: "1,245" },
        { label: "Connected Users", value: "3,567" },
        { label: "Success Rate", value: "98.5%" },
      ],
    },
  };

  return (
    <div className="relative">
      {/* Glass container */}
      <div className="relative p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#AA7452]/10 to-[#7C5841]/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 p-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.name}
                onClick={() => setActiveTab(index)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === index
                    ? "bg-[#AA7452]/20 text-[#D4C9C7] border border-[#AA7452]/30"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Platform Preview */}
          <motion.div
            className="relative h-80 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 overflow-hidden"
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {activeTab === 0
                  ? mockData.workers.title
                  : activeTab === 1
                    ? mockData.clients.title
                    : mockData.platform.title}
              </h3>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>

            {/* Dynamic content based on active tab */}
            <div className="space-y-4">
              {activeTab === 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-white/80">
                    Available Projects
                  </h4>
                  {mockData.workers.projects.map((project, i) => (
                    <motion.div
                      key={i}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div>
                        <div className="text-white font-medium">
                          {project.name}
                        </div>
                        <div className="text-[#AA7452] text-sm">
                          {project.budget}
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-[#AA7452] text-white text-sm rounded">
                        Apply
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 1 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-white/80">
                    Active Projects
                  </h4>
                  {mockData.clients.projects.map((project, i) => (
                    <motion.div
                      key={i}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-white font-medium">
                          {project.name}
                        </div>
                        <div className="text-sm text-white/70">
                          {project.team} team members
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-[#AA7452] h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-white/70 mt-1">
                        {project.progress}% Complete
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 2 && (
                <div className="grid grid-cols-3 gap-4">
                  {mockData.platform.metrics.map((metric, i) => (
                    <motion.div
                      key={i}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="text-2xl font-bold text-[#AA7452] mb-1">
                        {metric.value}
                      </div>
                      <div className="text-xs text-white/70">
                        {metric.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Floating indicators */}
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
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      id="platform"
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-gradient-to-br from-[#051822] via-[#2D383E] to-[#7C5841]"
    >
      {/* Network Animation Background */}
      <NetworkAnimation />

      {/* Animated background elements */}
      <motion.div
        className="absolute top-32 left-10 w-80 h-80 bg-gradient-to-r from-[#AA7452]/15 to-[#7C5841]/15 rounded-full blur-3xl"
        style={{ y }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-32 right-10 w-96 h-96 bg-gradient-to-r from-[#2D383E]/10 to-[#051822]/10 rounded-full blur-3xl"
        style={{ y: y.get() * -0.8 }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Platform Overview */}
          <motion.div style={{ opacity }} className="text-white">
            {/* Glass Badge */}
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#AA7452]/10 backdrop-blur-xl border border-[#AA7452]/20 text-[#D4C9C7] rounded-full text-sm font-medium mb-8 shadow-lg"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Cpu className="w-4 h-4" />
              Revolutionary Platform
            </motion.div>

            {/* Main Title */}
            <motion.h2
              className="text-5xl lg:text-6xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Connect. Collaborate.
              <br />
              <span className="bg-gradient-to-r from-[#AA7452] to-[#D4C9C7] bg-clip-text text-transparent">
                Build Together.
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-xl text-white/80 mb-10 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Our innovative platform bridges the gap between skilled
              construction professionals and clients across Nigeria. Experience
              seamless remote collaboration that transforms how construction
              projects are managed.
            </motion.p>

            {/* Platform Features */}
            <motion.div
              className="space-y-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {platformFeatures.slice(0, 3).map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ x: 8 }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-2.5 text-white flex-shrink-0`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-white/70 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Platform CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white rounded-xl font-semibold shadow-2xl hover:shadow-[#AA7452]/30 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <span>Explore Platform</span>
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
            </motion.div>

            {/* Mini Stats */}
            <motion.div
              className="flex gap-8 mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              viewport={{ once: true }}
            >
              {platformStats.slice(0, 2).map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-[#AA7452]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side: Interactive Platform Demo */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <PlatformDemo />
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {platformFeatures.map((feature, index) => (
            <GlassFeatureCard
              key={feature.title}
              feature={feature}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

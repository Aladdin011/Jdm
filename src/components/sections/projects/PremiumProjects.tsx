import { useState, useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Award,
  ArrowRight,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  Grid3X3,
  List,
  Search,
  Star,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Home,
  Shield,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Wifi,
  Battery,
  User,
  MoreHorizontal,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

// Smart Home Security System Data
const smartHomeProjects = [
  {
    id: 1,
    title: "Smart Home Security Hub",
    category: "security-systems",
    location: "Lagos, Nigeria",
    value: "$2.8M",
    duration: "12 months",
    status: "completed",
    completion: 100,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    description:
      "Advanced smart home security system with AI-powered monitoring, automated access control, and real-time surveillance capabilities.",
    features: [
      "AI Monitoring",
      "Smart Locks",
      "24/7 Surveillance",
      "Mobile Control",
    ],
    stats: {
      cameras: "8 Active",
      sensors: "24 Online",
      uptime: "99.9%",
      response: "< 2sec",
    },
    security: {
      cameras: [
        { name: "Front Door", status: "active", signal: 95 },
        { name: "Backyard", status: "active", signal: 87 },
        { name: "Living Room", status: "active", signal: 92 },
        { name: "Garage", status: "inactive", signal: 78 },
      ],
      locks: [
        { name: "Main Entrance", status: "secured", battery: 95 },
        { name: "Back Door", status: "secured", battery: 82 },
      ],
      members: [
        {
          name: "John",
          status: "home",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
        },
        {
          name: "Sarah",
          status: "away",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
        },
        {
          name: "Mike",
          status: "home",
          avatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
        },
      ],
    },
    isLive: true,
    rating: 4.9,
  },
  {
    id: 2,
    title: "Residential Complex Security",
    category: "residential-security",
    location: "Abuja, Nigeria",
    value: "$1.5M",
    duration: "8 months",
    status: "in-progress",
    completion: 75,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    description:
      "Comprehensive security solution for residential complex with perimeter monitoring and visitor management system.",
    features: [
      "Perimeter Security",
      "Visitor Management",
      "Access Control",
      "Emergency Response",
    ],
    stats: {
      units: "120 Protected",
      guards: "6 Active",
      incidents: "0 Today",
      satisfaction: "98%",
    },
    isLive: true,
    rating: 4.7,
  },
  {
    id: 3,
    title: "Commercial Building Security",
    category: "commercial-security",
    location: "Port Harcourt, Nigeria",
    value: "$3.2M",
    duration: "15 months",
    status: "completed",
    completion: 100,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    description:
      "Enterprise-grade security system for commercial building with biometric access and integrated fire safety.",
    features: [
      "Biometric Access",
      "Fire Integration",
      "Threat Detection",
      "Analytics Dashboard",
    ],
    stats: {
      employees: "500+ Protected",
      floors: "15 Monitored",
      alerts: "Real-time",
      compliance: "100%",
    },
    isLive: false,
    rating: 4.8,
  },
];

const SecurityCameraCard = ({ camera, isActive, onClick }: any) => {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300",
        isActive ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50",
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-100">
        <Camera className="w-4 h-4 text-gray-600 absolute inset-0 m-auto" />
        {camera.status === "active" && (
          <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 text-sm">{camera.name}</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Wifi className="w-3 h-3" />
          <span>{camera.signal}%</span>
        </div>
      </div>
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          camera.status === "active" ? "bg-green-500" : "bg-gray-300",
        )}
      />
    </motion.div>
  );
};

const SmartHomeControls = ({ activeProject, onProjectChange }: any) => {
  const [activeCamera, setActiveCamera] = useState(0);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Security Control
        </h3>
        <motion.button
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <Settings className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Camera Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Cameras</h4>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">
              {activeProject?.security?.cameras?.filter(
                (c: any) => c.status === "active",
              ).length || 3}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          {(activeProject?.security?.cameras || []).map(
            (camera: any, index: number) => (
              <SecurityCameraCard
                key={index}
                camera={camera}
                isActive={activeCamera === index}
                onClick={() => setActiveCamera(index)}
              />
            ),
          )}
        </div>
      </div>

      {/* Lock Status */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Access Control</h4>
          <span className="text-sm text-gray-500">All Secured</span>
        </div>
        <div className="space-y-3">
          {(activeProject?.security?.locks || []).map(
            (lock: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">{lock.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">{lock.battery}%</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Members */}
      <div className="border-t border-gray-100 pt-6 mt-6">
        <h4 className="font-medium text-gray-900 mb-4">Active Members</h4>
        <div className="flex items-center gap-2">
          {(activeProject?.security?.members || []).map(
            (member: any, index: number) => (
              <div key={index} className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
                    member.status === "home" ? "bg-green-500" : "bg-gray-400",
                  )}
                />
              </div>
            ),
          )}
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
            +2
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SmartHomeDisplay = ({ activeProject }: any) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Home Security</h2>
              <p className="text-sm text-gray-500">{activeProject?.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-400" />
              <Settings className="w-4 h-4 text-gray-400" />
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Display */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeProject?.id}
            src={activeProject?.image}
            alt={activeProject?.title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>

        {/* Security Overlay */}
        <div className="absolute inset-0 bg-black/20">
          {/* Security Indicators */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-900">
              All Systems Active
            </span>
          </div>

          {/* Live Indicators */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <Camera className="w-6 h-6" />
          </div>
          <div className="absolute top-20 right-20 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <Shield className="w-6 h-6" />
          </div>

          {/* Status Panel */}
          <motion.div
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 min-w-[200px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="text-sm font-semibold text-gray-900 mb-3">
              System Status
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Cameras
                </span>
                <span className="font-medium">
                  {activeProject?.stats?.cameras || "8 Active"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Locks
                </span>
                <span className="font-medium">2 Secured</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  Uptime
                </span>
                <span className="font-medium">
                  {activeProject?.stats?.uptime || "99.9%"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Project Info Overlay */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-white">
              <motion.h3
                className="text-2xl font-bold mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {activeProject?.title}
              </motion.h3>
              <motion.div
                className="flex items-center gap-4 text-sm"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {activeProject?.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  {activeProject?.rating}
                </span>
                {activeProject?.isLive && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Live
                  </span>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Project Details */}
      <div className="p-6">
        <motion.div
          className="space-y-4"
          key={activeProject?.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gray-600 leading-relaxed">
            {activeProject?.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {(activeProject?.features || []).map(
              (feature: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg font-medium"
                >
                  {feature}
                </span>
              ),
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {activeProject?.value}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {activeProject?.duration}
              </span>
            </div>

            <motion.button
              className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const SmartHomeStats = ({ activeProject }: any) => {
  const stats = [
    {
      label: "Security Level",
      value: "100%",
      color: "text-green-500",
      bgColor: "bg-green-500",
      icon: Shield,
    },
    {
      label: "Response Time",
      value: activeProject?.stats?.response || "< 2sec",
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      icon: Activity,
    },
    {
      label: "System Uptime",
      value: activeProject?.stats?.uptime || "99.9%",
      color: "text-purple-500",
      bgColor: "bg-purple-500",
      icon: TrendingUp,
    },
    {
      label: "Satisfaction",
      value: activeProject?.stats?.satisfaction || "98%",
      color: "text-green-500",
      bgColor: "bg-green-500",
      icon: CheckCircle,
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Smart Analytics</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-500">Real-time</span>
        </div>
      </div>

      <div className="space-y-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className={cn("w-4 h-4", stat.color)} />
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
                <span className={cn("font-semibold", stat.color)}>
                  {stat.value}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <motion.div
                  className={cn("h-2 rounded-full", stat.bgColor)}
                  initial={{ width: "0%" }}
                  animate={{ width: "95%" }}
                  transition={{ duration: 1.5, delay: 0.8 + index * 0.2 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Live Activity */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          Live Activity
        </h4>
        <div className="space-y-3">
          {[
            {
              time: "2min ago",
              action: "Security system armed",
              type: "system",
            },
            {
              time: "1hr ago",
              action: "Motion detected - Front door",
              type: "motion",
            },
            {
              time: "3hr ago",
              action: "Access granted - Main entrance",
              type: "access",
            },
          ].map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
            >
              <div className="text-xs text-gray-500 w-16">{activity.time}</div>
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  activity.type === "system"
                    ? "bg-green-500"
                    : activity.type === "motion"
                      ? "bg-yellow-500"
                      : "bg-blue-500",
                )}
              />
              <div className="text-sm text-gray-700 flex-1">
                {activity.action}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function PremiumProjects() {
  const [activeProject, setActiveProject] = useState(smartHomeProjects[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Auto-rotate projects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % smartHomeProjects.length);
      setActiveProject(
        smartHomeProjects[(currentIndex + 1) % smartHomeProjects.length],
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gray-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"
        style={{ y }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl"
        style={{ y: y.get() * -0.5 }}
      />

      <div className="container mx-auto px-6 relative z-10">
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
            <Shield className="w-4 h-4" />
            Smart Security Systems
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Intelligent Security
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Management Platform
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience our advanced security monitoring and automation system
            with real-time threat detection, smart access control, and
            comprehensive home protection capabilities.
          </p>
        </motion.div>

        {/* Smart Security Dashboard Interface */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Left Panel - Security Controls */}
          <div className="lg:col-span-3">
            <SmartHomeControls
              activeProject={activeProject}
              onProjectChange={setActiveProject}
            />
          </div>

          {/* Center - Main Security Display */}
          <div className="lg:col-span-6">
            <SmartHomeDisplay activeProject={activeProject} />
          </div>

          {/* Right Panel - Security Stats */}
          <div className="lg:col-span-3">
            <SmartHomeStats activeProject={activeProject} />
          </div>
        </motion.div>

        {/* Project Navigation */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {smartHomeProjects.map((_, index) => (
            <motion.button
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-blue-500 w-8"
                  : "bg-gray-300 w-2 hover:bg-gray-400",
              )}
              onClick={() => {
                setCurrentIndex(index);
                setActiveProject(smartHomeProjects[index]);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
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
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Experience Smart Security Management
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the future of home and business security with our intelligent
            monitoring system and automated protection capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2 justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Smart Security</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Projects
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Layout from "@/components/layout/Layout";
import { projects, projectCategories } from "@/data/projects";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  Grid3X3,
  List,
  Search,
  Filter,
  MoreHorizontal,
  Star,
  ArrowUpRight,
  Home,
  Shield,
  Camera,
  Lock,
  Activity,
  Clock,
  CheckCircle2,
  User,
  Zap,
  Eye,
  EyeOff,
  Bell,
  Wifi,
  Battery,
  AlertTriangle,
} from "lucide-react";

// Smart Home Security System Data
const smartHomeData = {
  main: {
    title: "Smart Home Security Systems",
    subtitle: "Advanced home automation and security monitoring",
    status: "All Systems Active",
    image: "https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F5fa4b5d3f7804229bfda526299de2f7e?format=webp&width=800",
  },
  cameras: [
    {
      id: 1,
      name: "Camera 1",
      location: "Front Door",
      status: "active",
      time: "12 pm - 6 pm",
      thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
      isRecording: true,
      signal: 95,
    },
    {
      id: 2,
      name: "Camera 2",
      location: "Backyard",
      status: "active",
      time: "12 pm - 6 pm",
      thumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80",
      isRecording: true,
      signal: 87,
    },
    {
      id: 3,
      name: "Camera 3",
      location: "Living Room",
      status: "inactive",
      time: "12 pm - 6 pm",
      thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
      isRecording: false,
      signal: 92,
    },
  ],
  locks: [
    {
      id: 1,
      name: "Front Door Lock",
      status: "locked",
      battery: 60,
      lastAccess: "2 hours ago",
      location: "Main Entrance",
    },
    {
      id: 2,
      name: "Backyard Lock",
      status: "locked",
      battery: 45,
      lastAccess: "5 hours ago", 
      location: "Garden Gate",
    },
  ],
  members: [
    { id: 1, name: "John", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", status: "online" },
    { id: 2, name: "Sarah", avatar: "https://images.unsplash.com/photo-1494790108755-2616b7c7ad4c?w=100&q=80", status: "away" },
    { id: 3, name: "Mike", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80", status: "home" },
    { id: 4, name: "+3", avatar: "", status: "more" },
  ],
  flows: [
    { id: 1, name: "1 Flow", color: "bg-green-500", active: true },
    { id: 2, name: "2 Flow", color: "bg-blue-500", active: false },
    { id: 3, name: "Garage", color: "bg-gray-500", active: false },
  ],
  activity: [
    { time: "07:00", event: "Home - Back Door was Closed", type: "door" },
    { time: "08:00", event: "Home - Back Door was Opened", type: "door" },
  ],
  calendar: {
    currentDay: 17,
    days: [11, 12, 13, 14, 15, 16, 17],
    currentMonth: "Current Month",
  },
};

const CameraCard = ({ camera, isActive, onClick }: any) => {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300",
        isActive ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={camera.thumbnail}
          alt={camera.name}
          className="w-full h-full object-cover"
        />
        {camera.isRecording && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 text-sm">{camera.name}</h4>
        <p className="text-xs text-gray-500">{camera.time}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          camera.status === "active" ? "bg-green-500" : "bg-gray-300"
        )} />
        <div className="flex items-center gap-1">
          <Wifi className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">{camera.signal}%</span>
        </div>
      </div>
    </motion.div>
  );
};

const LockCard = ({ lock }: any) => {
  return (
    <motion.div
      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900 text-sm">{lock.name}</span>
        </div>
        <div className={cn(
          "w-3 h-3 rounded-full",
          lock.status === "locked" ? "bg-green-500" : "bg-red-500"
        )} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Battery</span>
          <span className="font-medium">{lock.battery}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div 
            className="h-1.5 bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${lock.battery}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">Last: {lock.lastAccess}</p>
      </div>
    </motion.div>
  );
};

const MemberAvatar = ({ member, index }: any) => {
  if (member.status === "more") {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
        +3
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={member.avatar}
        alt={member.name}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className={cn(
        "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
        member.status === "online" ? "bg-green-500" : 
        member.status === "home" ? "bg-blue-500" : "bg-gray-400"
      )} />
    </div>
  );
};

const SmartHomeControls = ({ activeCamera, onCameraChange }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Cameras</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">{smartHomeData.cameras.filter(c => c.status === 'active').length}</span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {smartHomeData.cameras.map((camera, index) => (
          <CameraCard
            key={camera.id}
            camera={camera}
            isActive={activeCamera?.id === camera.id}
            onClick={() => onCameraChange(camera)}
          />
        ))}
      </div>

      {/* Locks Section */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Locks</h4>
          <span className="text-sm text-gray-500">2</span>
        </div>
        <div className="space-y-3">
          {smartHomeData.locks.map((lock) => (
            <LockCard key={lock.id} lock={lock} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SmartHomeDisplay = ({ activeCamera }: any) => {
  const [currentFlow, setCurrentFlow] = useState(0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Home</h2>
              <p className="text-sm text-gray-500">401 Magnetic Drive Unit 2</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Connect 8...</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-400" />
              <Settings className="w-4 h-4 text-gray-400" />
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">SW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Section */}
          <div className="col-span-4 space-y-4">
            {/* Flow Controls */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Home</h3>
              <div className="flex items-center gap-2 mb-4">
                {smartHomeData.flows.map((flow, index) => (
                  <button
                    key={flow.id}
                    onClick={() => setCurrentFlow(index)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      currentFlow === index 
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {flow.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Backyard Section */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Backyard</h4>
              <div className="text-sm text-gray-600">Smart Home Security Systems</div>
              
              {/* Members */}
              <div>
                <div className="text-sm text-gray-600 mb-2">Members</div>
                <div className="flex items-center gap-2">
                  {smartHomeData.members.map((member, index) => (
                    <MemberAvatar key={member.id} member={member} index={index} />
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div>
                <div className="text-sm text-gray-600 mb-2">Activity</div>
                <div className="space-y-2">
                  {smartHomeData.activity.map((activity, index) => (
                    <div key={index} className="text-xs text-gray-500">
                      <span className="font-medium">{activity.time}</span> {activity.event}
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Calendar</span>
                  <span className="text-xs text-gray-500">{smartHomeData.calendar.currentMonth}</span>
                </div>
                <div className="flex items-center gap-1">
                  {smartHomeData.calendar.days.map((day) => (
                    <div
                      key={day}
                      className={cn(
                        "w-6 h-6 rounded text-xs flex items-center justify-center",
                        day === smartHomeData.calendar.currentDay
                          ? "bg-blue-500 text-white"
                          : "text-gray-600"
                      )}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center - House Visualization */}
          <div className="col-span-8">
            <div className="relative aspect-video bg-gray-50 rounded-xl overflow-hidden">
              <img
                src={smartHomeData.main.image}
                alt="Smart Home"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/10">
                {/* Camera indicators */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="absolute top-20 right-20 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white">
                  <Lock className="w-6 h-6" />
                </div>

                {/* Status Panel */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">System Status</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>All systems active</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>3 cameras online</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span>2 locks secured</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SmartHomeStats = ({ activeCamera }: any) => {
  const stats = [
    {
      label: "Security Level",
      value: "100%",
      color: "text-green-500",
      bgColor: "bg-green-500",
      icon: Shield,
    },
    {
      label: "Camera Status",
      value: "3/3 Online",
      color: "text-blue-500", 
      bgColor: "bg-blue-500",
      icon: Camera,
    },
    {
      label: "Lock Status",
      value: "2/2 Secured",
      color: "text-purple-500",
      bgColor: "bg-purple-500", 
      icon: Lock,
    },
    {
      label: "System Health",
      value: "Excellent",
      color: "text-green-500",
      bgColor: "bg-green-500",
      icon: Activity,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Smart Home Security Systems</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-500">Live</span>
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
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                  transition={{ duration: 1.5, delay: 0.5 + index * 0.2 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          Recent Activity
        </h4>
        <div className="space-y-3">
          {[
            { time: "2min ago", action: "Front door unlocked", type: "unlock" },
            { time: "1hr ago", action: "Motion detected backyard", type: "motion" },
            { time: "3hr ago", action: "Security system armed", type: "system" },
          ].map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <div className="text-xs text-gray-500 w-16">{activity.time}</div>
              <div className={cn(
                "w-2 h-2 rounded-full",
                activity.type === "unlock" ? "bg-yellow-500" :
                activity.type === "motion" ? "bg-red-500" : "bg-green-500"
              )} />
              <div className="text-sm text-gray-700 flex-1">{activity.action}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeCamera, setActiveCamera] = useState(smartHomeData.cameras[0]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter(
          (project) => project.category.toLowerCase() === selectedCategory,
        );

  return (
    <Layout>
      <div ref={containerRef} className="min-h-screen bg-gray-50">
        {/* Header */}
        <motion.div
          className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-md bg-white/80"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1
                  className="text-2xl font-bold text-gray-900"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Smart Home Security Systems
                </motion.h1>
                <motion.p
                  className="text-gray-600 mt-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Advanced security monitoring and home automation
                </motion.p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search devices..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      viewMode === "grid"
                        ? "bg-white shadow-sm"
                        : "hover:bg-gray-200",
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      viewMode === "list"
                        ? "bg-white shadow-sm"
                        : "hover:bg-gray-200",
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Smart Home Dashboard */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Panel - Smart Home Controls */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <SmartHomeControls
                activeCamera={activeCamera}
                onCameraChange={setActiveCamera}
              />
            </motion.div>

            {/* Center - Main Smart Home Display */}
            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <SmartHomeDisplay activeCamera={activeCamera} />
            </motion.div>

            {/* Right Panel - Smart Home Stats */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <SmartHomeStats activeCamera={activeCamera} />
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

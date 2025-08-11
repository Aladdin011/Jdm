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
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

// Featured projects with enhanced data
const featuredProjects = [
  {
    id: 1,
    title: "Lagos Smart City Complex",
    category: "smart-cities",
    location: "Lagos, Nigeria",
    value: "$45M",
    duration: "24 months",
    status: "completed",
    completion: 100,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    description: "Revolutionary smart city development with IoT integration, sustainable energy systems, and intelligent traffic management.",
    features: ["IoT Integration", "Smart Grid", "Green Building", "Traffic AI"],
    stats: {
      area: "2.5M sq ft",
      residents: "15,000+",
      satisfaction: "98%",
      energy: "40% reduction",
    },
    awards: ["LEED Platinum", "Smart City Award 2023"],
    timeline: "2021-2023",
    rating: 4.9,
    isLive: true,
  },
  {
    id: 2,
    title: "Abuja Financial District",
    category: "commercial",
    location: "Abuja, Nigeria",
    value: "$32M",
    duration: "18 months",
    status: "in-progress",
    completion: 75,
    image: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&q=80",
    description: "Modern financial hub featuring state-of-the-art office towers, conference centers, and integrated business facilities.",
    features: ["High-tech Security", "Conference Centers", "Parking Solutions", "Retail Spaces"],
    stats: {
      area: "1.8M sq ft",
      offices: "200+",
      jobs: "5,000+",
      rating: "5-Star",
    },
    awards: ["Architecture Excellence"],
    timeline: "2022-2024",
    rating: 4.7,
    isLive: true,
  },
  {
    id: 3,
    title: "Kano Residential Estate",
    category: "residential",
    location: "Kano, Nigeria",
    value: "$28M",
    duration: "20 months",
    status: "completed",
    completion: 100,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    description: "Sustainable residential community with modern amenities, green spaces, and smart home technologies.",
    features: ["Smart Homes", "Green Spaces", "Security Systems", "Community Centers"],
    stats: {
      units: "500",
      families: "2,000+",
      green: "30%",
      amenities: "15+",
    },
    awards: ["Sustainable Development Award"],
    timeline: "2020-2022",
    rating: 4.8,
    isLive: false,
  },
];

const ProjectDisplayCard = ({ project, isActive, onActivate }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={cn(
        "group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer transition-all duration-500",
        isActive ? "ring-2 ring-blue-500 shadow-2xl scale-105" : "hover:shadow-xl hover:scale-102"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onActivate}
      whileHover={{ y: -4 }}
      layout
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            transition: { duration: 0.6 }
          }}
        />
        
        {/* Live indicator */}
        {project.isLive && (
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-gray-700">Live</span>
            </div>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
            project.status === "completed" 
              ? "bg-green-500/90 text-white" 
              : "bg-blue-500/90 text-white"
          )}>
            {project.status === "completed" ? "Completed" : "In Progress"}
          </div>
        </div>

        {/* Hover controls */}
        <motion.div
          className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5 ml-0.5" />
          </motion.button>
          <motion.button
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Maximize2 className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Progress bar for in-progress projects */}
        {project.status === "in-progress" && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white text-xs mb-2">
              <span>Progress</span>
              <span>{project.completion}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <motion.div
                className="h-1.5 bg-blue-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${project.completion}%` }}
                transition={{ duration: 2, delay: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
              {project.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {project.location}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                {project.rating}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {project.features.slice(0, 3).map((feature: string, i: number) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium"
              >
                {feature}
              </span>
            ))}
            {project.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{project.features.length - 3} more
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
              <DollarSign className="w-4 h-4" />
              {project.value}
            </div>
            <motion.div
              className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <span>View Project</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"
          layoutId="activeIndicator"
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

const ProjectControls = ({ activeProject, onProjectChange }: any) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Project Controls</h3>
        <motion.button 
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <Settings className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300",
              activeProject?.id === project.id 
                ? "bg-blue-50 border border-blue-200" 
                : "hover:bg-gray-50"
            )}
            onClick={() => onProjectChange(project)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{project.title}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{project.location}</span>
                {project.isLive && (
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-600">Live</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                activeProject?.id === project.id ? "bg-green-500" : "bg-gray-300"
              )} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-100">
        <motion.button
          className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <motion.button
          className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-5 h-5 ml-0.5" />
        </motion.button>
        <motion.button
          className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const ProjectStats = ({ activeProject }: any) => {
  const stats = [
    { label: "Completion", value: `${activeProject?.completion || 100}%`, color: "text-green-500", bgColor: "bg-green-500" },
    { label: "Timeline", value: activeProject?.duration || "24 months", color: "text-blue-500", bgColor: "bg-blue-500" },
    { label: "Investment", value: activeProject?.value || "$45M", color: "text-purple-500", bgColor: "bg-purple-500" },
    { label: "Rating", value: `${activeProject?.rating || 4.9}★`, color: "text-yellow-500", bgColor: "bg-yellow-500" },
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
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{stat.label}</span>
              <span className={cn("font-semibold", stat.color)}>{stat.value}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <motion.div
                className={cn("h-2 rounded-full", stat.bgColor)}
                initial={{ width: "0%" }}
                animate={{ 
                  width: stat.label === "Completion" 
                    ? `${activeProject?.completion || 100}%` 
                    : "85%" 
                }}
                transition={{ duration: 1.5, delay: 0.8 + index * 0.2 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Activity */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-500" />
          Live Activity
        </h4>
        <div className="space-y-3">
          {[
            { time: "2min ago", action: "Progress updated", type: "update" },
            { time: "1hr ago", action: "Quality check passed", type: "success" },
            { time: "3hr ago", action: "New milestone reached", type: "milestone" },
          ].map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
            >
              <div className="text-xs text-gray-500 w-16">{activity.time}</div>
              <div className={cn(
                "w-2 h-2 rounded-full",
                activity.type === "success" ? "bg-green-500" :
                activity.type === "milestone" ? "bg-purple-500" : "bg-blue-500"
              )} />
              <div className="text-sm text-gray-700 flex-1">{activity.action}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function PremiumProjects() {
  const [activeProject, setActiveProject] = useState(featuredProjects[0]);
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
      setCurrentIndex((prev) => (prev + 1) % featuredProjects.length);
      setActiveProject(featuredProjects[(currentIndex + 1) % featuredProjects.length]);
    }, 5000);

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
            <Building2 className="w-4 h-4" />
            Smart Projects Dashboard
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Intelligent Project
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Management System
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience our advanced project monitoring and control system with real-time analytics, 
            smart automation, and comprehensive oversight of all construction activities.
          </p>
        </motion.div>

        {/* Smart Dashboard Interface */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Left Panel - Project Controls */}
          <div className="lg:col-span-3">
            <ProjectControls
              activeProject={activeProject}
              onProjectChange={setActiveProject}
            />
          </div>

          {/* Center - Main Project Display */}
          <div className="lg:col-span-6">
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeProject.id}
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6 }}
                  />
                </AnimatePresence>
                
                {/* Project Info Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="p-8 text-white w-full">
                    <motion.h3 
                      className="text-2xl font-bold mb-2"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      {activeProject.title}
                    </motion.h3>
                    <motion.div 
                      className="flex items-center gap-4 text-sm"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                    >
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {activeProject.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        {activeProject.rating}
                      </span>
                      {activeProject.isLive && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                          Live
                        </span>
                      )}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Navigation Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {featuredProjects.map((_, index) => (
                    <motion.button
                      key={index}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        index === currentIndex ? "bg-white w-8" : "bg-white/50 w-2"
                      )}
                      onClick={() => {
                        setCurrentIndex(index);
                        setActiveProject(featuredProjects[index]);
                      }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-6">
                <motion.div
                  className="space-y-4"
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-gray-600 leading-relaxed">
                    {activeProject.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {activeProject.features.map((feature: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {activeProject.timeline}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-green-600">
                        <DollarSign className="w-4 h-4" />
                        {activeProject.value}
                      </span>
                    </div>
                    
                    <motion.button
                      className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Panel - Project Stats */}
          <div className="lg:col-span-3">
            <ProjectStats activeProject={activeProject} />
          </div>
        </motion.div>

        {/* Project Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Featured Projects</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our portfolio of successful smart construction projects with real-time monitoring and control systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <ProjectDisplayCard
                key={project.id}
                project={project}
                isActive={activeProject.id === project.id}
                onActivate={() => setActiveProject(project)}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Experience Smart Construction Management
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the future of construction with our intelligent project management system and real-time monitoring capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2 justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Smart Project</span>
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

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
} from "lucide-react";

interface ProjectCardProps {
  project: any;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const ProjectCard = ({
  project,
  index,
  isActive,
  onClick,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer transition-all duration-500",
        isActive ? "ring-2 ring-blue-500 shadow-2xl" : "hover:shadow-xl",
      )}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isActive ? 1.02 : 1,
        transition: { duration: 0.6, delay: index * 0.1 },
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
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
            transition: { duration: 0.6 },
          }}
        />

        {/* Overlay with controls */}
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

        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-gray-700">Active</span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white text-xs mb-2">
            <span>Progress</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5">
            <motion.div
              className="h-1.5 bg-green-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {project.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {project.location}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {project.year}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {project.description}
        </p>

        {/* Project stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <DollarSign className="w-4 h-4 text-green-500" />
            {project.value}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">4.9</span>
            </div>
            <motion.button
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Active project indicator */}
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

const ProjectControls = ({ activeProject, onProjectChange, projects }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Project Controls
        </h3>
        <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {projects.slice(0, 4).map((project: any, index: number) => (
          <motion.div
            key={project.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300",
              activeProject?.id === project.id
                ? "bg-blue-50 border border-blue-200"
                : "hover:bg-gray-50",
            )}
            onClick={() => onProjectChange(project)}
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
              <h4 className="font-medium text-gray-900 truncate">
                {project.title}
              </h4>
              <p className="text-sm text-gray-500">{project.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  activeProject?.id === project.id
                    ? "bg-green-500"
                    : "bg-gray-300",
                )}
              />
              {activeProject?.id === project.id && (
                <motion.div
                  className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Play className="w-3 h-3 text-white fill-current" />
                </motion.div>
              )}
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
    </div>
  );
};

const ProjectStats = ({ activeProject }: any) => {
  const stats = [
    { label: "Completion", value: "100%", color: "text-green-500" },
    {
      label: "Timeline",
      value: `${activeProject?.duration || "18 months"}`,
      color: "text-blue-500",
    },
    {
      label: "Budget",
      value: activeProject?.value || "₦5.2B",
      color: "text-purple-500",
    },
    { label: "Rating", value: "4.9★", color: "text-yellow-500" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Project Stats</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-500">Live</span>
        </div>
      </div>

      <div className="space-y-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{stat.label}</span>
              <span className={cn("font-semibold", stat.color)}>
                {stat.value}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <motion.div
                className={cn("h-2 rounded-full", {
                  "bg-green-500": stat.label === "Completion",
                  "bg-blue-500": stat.label === "Timeline",
                  "bg-purple-500": stat.label === "Budget",
                  "bg-yellow-500": stat.label === "Rating",
                })}
                initial={{ width: "0%" }}
                animate={{
                  width: stat.label === "Completion" ? "100%" : "75%",
                }}
                transition={{ duration: 1.5, delay: 0.5 + index * 0.2 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
        <div className="space-y-3">
          {[
            { time: "07:00", action: "Project Started", status: "completed" },
            {
              time: "08:00",
              action: "Foundation Complete",
              status: "completed",
            },
            { time: "09:30", action: "Structure Phase", status: "active" },
          ].map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="text-sm text-gray-500">{activity.time}</div>
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  activity.status === "completed"
                    ? "bg-green-500"
                    : "bg-blue-500",
                )}
              />
              <div className="text-sm text-gray-700">{activity.action}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeProject, setActiveProject] = useState(projects[0]);
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
                  Projects
                </motion.h1>
                <motion.p
                  className="text-gray-600 mt-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Smart project management and monitoring
                </motion.p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
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

            {/* Category Filters */}
            <motion.div
              className="flex items-center gap-3 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {projectCategories.map((category, index) => (
                <motion.button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    selectedCategory === category.value
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200",
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Panel - Project Controls */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ProjectControls
                activeProject={activeProject}
                onProjectChange={setActiveProject}
                projects={filteredProjects}
              />
            </motion.div>

            {/* Center - Main Project Display */}
            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  <img
                    src={activeProject?.image || projects[0]?.image}
                    alt={activeProject?.title || projects[0]?.title}
                    className="w-full h-full object-cover"
                  />

                  {/* 3D Project Visualization Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-black/20 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <motion.div
                      className="text-center text-white"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      <h2 className="text-3xl font-bold mb-2">
                        {activeProject?.title || projects[0]?.title}
                      </h2>
                      <p className="text-lg opacity-90">
                        {activeProject?.location || projects[0]?.location}
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* Project Navigation Dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {filteredProjects.slice(0, 5).map((_, index) => (
                      <motion.button
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          index === 0 ? "bg-white w-8" : "bg-white/50",
                        )}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {activeProject?.description || projects[0]?.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {activeProject?.year || projects[0]?.year}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {activeProject?.value || projects[0]?.value}
                        </span>
                      </div>

                      <motion.button
                        className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right Panel - Project Stats */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <ProjectStats activeProject={activeProject} />
            </motion.div>
          </div>

          {/* Project Grid */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                All Projects
              </h2>
              <div className="text-sm text-gray-500">
                Showing {filteredProjects.length} of {projects.length} projects
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4",
                )}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                style={{ y }}
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    isActive={activeProject?.id === project.id}
                    onClick={() => setActiveProject(project)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

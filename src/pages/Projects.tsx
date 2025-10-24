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
  Grid3X3,
  List,
  Search,
  Filter,
  Star,
  ArrowUpRight,
  Building2,
  Construction,
  Clock,
  CheckCircle2,
  Eye,
  Award,
  Zap,
  Settings,
  Target,
  Lightbulb,
  Sparkles,
  TrendingUp,
  MoreHorizontal,
  Play,
  X,
  Maximize2,
  Heart,
} from "lucide-react";

// Floating background elements
const FloatingElement = ({
  className,
  delay = 0,
  duration = 20,
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
      y: [0, -30, 30, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
    className={cn("absolute rounded-full", className)}
  />
);

// Enhanced project card component
const ProjectCard = ({
  project,
  index,
  viewMode,
  onView,
}: {
  project: any;
  index: number;
  viewMode: "grid" | "list";
  onView: (project: any) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex">
          {/* Image */}
          <div className="w-80 h-60 relative overflow-hidden">
            <motion.img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.1 : 1,
                filter: isHovered ? "brightness(1.1)" : "brightness(1)",
              }}
              transition={{ duration: 0.7 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#051822]/60" />

            {/* Project type badge */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white px-4 py-2 rounded-full text-sm font-bold">
              {project.category}
            </div>

            {/* View button */}
            <motion.button
              onClick={() => onView(project)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex-1 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-[#051822] mb-2 group-hover:text-[#AA7452] transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{project.location}</span>
                </div>
              </div>
              <motion.button
                onClick={() => setIsLiked(!isLiked)}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart
                  className={cn(
                    "w-5 h-5",
                    isLiked ? "text-red-500 fill-current" : "text-gray-400",
                  )}
                />
              </motion.button>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Project stats */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-black text-[#AA7452]">
                  {project.duration}
                </div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[#AA7452]">
                  {project.budget}
                </div>
                <div className="text-sm text-gray-600">Investment</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[#AA7452]">
                  {project.teamSize}
                </div>
                <div className="text-sm text-gray-600">Team Size</div>
              </div>
            </div>

            {/* Technologies/Features */}
            <div className="flex flex-wrap gap-2">
              {project.technologies
                ?.slice(0, 4)
                .map((tech: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gradient-to-r from-[#AA7452]/10 to-[#7C5841]/10 text-[#7C5841] text-xs font-medium rounded-full border border-[#AA7452]/20"
                  >
                    {tech}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        bounce: 0.3,
      }}
      viewport={{ once: true }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden h-full"
        whileHover={{ y: -10, scale: 1.02 }}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
              filter: isHovered ? "brightness(1.1)" : "brightness(1)",
            }}
            transition={{ duration: 0.7 }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#051822]/80 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white px-4 py-2 rounded-full text-sm font-bold">
              {project.category}
            </div>
            {project.featured && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold">
                Featured
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              onClick={() => setIsLiked(!isLiked)}
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  isLiked ? "text-red-400 fill-current" : "text-white",
                )}
              />
            </motion.button>
            <motion.button
              onClick={() => onView(project)}
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Bottom info overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-sm mb-2">
              <MapPin className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>{project.duration}</span>
            </div>
          </div>

          {/* Floating play button for video preview */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0.8 }}
            animate={{ scale: isHovered ? 1 : 0.8 }}
          >
            <motion.button
              onClick={() => onView(project)}
              className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-8 h-8 ml-1" />
            </motion.button>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-xl font-black text-[#051822] mb-3 group-hover:text-[#AA7452] transition-colors leading-tight">
            {project.title}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Project metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gradient-to-r from-[#AA7452]/5 to-[#7C5841]/5 rounded-xl">
              <div className="text-lg font-black text-[#AA7452]">
                {project.budget}
              </div>
              <div className="text-xs text-gray-600">Investment</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-r from-[#051822]/5 to-[#2D383E]/5 rounded-xl">
              <div className="text-lg font-black text-[#051822]">
                {project.teamSize}
              </div>
              <div className="text-xs text-gray-600">Team Size</div>
            </div>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1 mb-4">
            {project.technologies
              ?.slice(0, 3)
              .map((tech: string, i: number) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
                >
                  {tech}
                </span>
              ))}
            {project.technologies?.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* View project button */}
          <motion.button
            onClick={() => onView(project)}
            className="w-full bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-[#AA7452]/30 transition-all duration-300 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            View Project
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Project detail modal
const ProjectModal = ({
  project,
  isOpen,
  onClose,
}: {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 bg-white rounded-3xl z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.3 }}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-black text-[#051822]">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  {/* Image Gallery */}
                  <div className="relative bg-gray-100">
                    <img
                      src={project.images[currentImageIndex]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Image navigation */}
                    {project.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === 0 ? project.images.length - 1 : prev - 1,
                            )
                          }
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === project.images.length - 1 ? 0 : prev + 1,
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Image indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {project.images.map((_: any, index: number) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                index === currentImageIndex
                                  ? "bg-white"
                                  : "bg-white/50",
                              )}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="p-8">
                    {/* Project info */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white px-4 py-2 rounded-full text-sm font-bold">
                          {project.category}
                        </span>
                        {project.status === "completed" && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            Completed
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-6">
                        {project.description}
                      </p>

                      {/* Key metrics */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-gradient-to-r from-[#AA7452]/10 to-[#7C5841]/10 rounded-2xl">
                          <Calendar className="w-6 h-6 text-[#AA7452] mx-auto mb-2" />
                          <div className="text-lg font-black text-[#051822]">
                            {project.duration}
                          </div>
                          <div className="text-sm text-gray-600">Duration</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-r from-[#051822]/10 to-[#2D383E]/10 rounded-2xl">
                          <Users className="w-6 h-6 text-[#051822] mx-auto mb-2" />
                          <div className="text-lg font-black text-[#051822]">
                            {project.teamSize}
                          </div>
                          <div className="text-sm text-gray-600">Team Size</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-r from-[#7C5841]/10 to-[#AA7452]/10 rounded-2xl">
                          <DollarSign className="w-6 h-6 text-[#7C5841] mx-auto mb-2" />
                          <div className="text-lg font-black text-[#051822]">
                            {project.budget}
                          </div>
                          <div className="text-sm text-gray-600">
                            Investment
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-2xl">
                          <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                          <div className="text-lg font-black text-green-600">
                            100%
                          </div>
                          <div className="text-sm text-gray-600">Complete</div>
                        </div>
                      </div>

                      {/* Technologies used */}
                      <div className="mb-6">
                        <h4 className="font-bold text-[#051822] mb-3">
                          Technologies & Methods
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies?.map(
                            (tech: string, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-2 bg-gradient-to-r from-[#AA7452]/10 to-[#7C5841]/10 text-[#7C5841] text-sm font-medium rounded-xl border border-[#AA7452]/20"
                              >
                                {tech}
                              </span>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Features or highlights */}
                      {project.features && (
                        <div>
                          <h4 className="font-bold text-[#051822] mb-3">
                            Key Features
                          </h4>
                          <ul className="space-y-2">
                            {project.features.map(
                              (feature: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-5 h-5 text-[#AA7452] mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">
                                    {feature}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Apply construction color system
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-dark", "#051822");
    root.style.setProperty("--secondary-dark", "#2D383E");
    root.style.setProperty("--accent-warm", "#7C5841");
    root.style.setProperty("--accent-light", "#AA7452");
    root.style.setProperty("--neutral-mid", "#969A9E");
    root.style.setProperty("--neutral-light", "#D4C9C7");
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === "all" ||
      project.category.toLowerCase() === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div ref={containerRef} className="min-h-screen">
        {/* Enhanced Hero Section */}
        <motion.section
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{
            y: heroY,
            opacity: heroOpacity,
            background:
              "linear-gradient(135deg, #051822 0%, #2D383E 50%, #7C5841 100%)",
          }}
        >
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(212,201,199,0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(170,116,82,0.2) 0%, transparent 50%)
              `,
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
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  type: "spring",
                  bounce: 0.4,
                }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#AA7452]/20 to-[#7C5841]/10 backdrop-blur-xl border border-[#AA7452]/30 rounded-full text-[#D4C9C7] font-semibold mb-8 shadow-2xl"
              >
                <Construction className="w-6 h-6 text-[#AA7452]" />
                <span className="text-lg">Portfolio Showcase</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                  type: "spring",
                  bounce: 0.3,
                }}
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-none tracking-tight"
              >
                <span className="block">Our</span>
                <motion.span
                  className="block bg-gradient-to-r from-[#AA7452] via-[#7C5841] to-[#D4C9C7] bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Project Portfolio
                </motion.span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-xl md:text-2xl text-[#D4C9C7] mb-12 max-w-4xl mx-auto leading-relaxed font-light"
              >
                Explore our collection of{" "}
                <span className="text-[#AA7452] font-semibold">
                  premium construction projects
                </span>
                across Africa and beyond, showcasing innovation, quality, and
                <span className="text-[#D4C9C7] font-semibold">
                  {" "}
                  sustainable development
                </span>
                .
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="grid grid-cols-4 gap-8 max-w-3xl mx-auto"
              >
                {[
                  { number: `${projects.length}+`, label: "Projects" },
                  { number: "15+", label: "Countries" },
                  { number: "500M+", label: "Investment" },
                  { number: "98%", label: "Success Rate" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-black text-[#AA7452] mb-2">
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

        {/* Enhanced Projects Section */}
        <section className="py-32 bg-gradient-to-b from-white via-[#D4C9C7]/5 to-gray-50/50 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            {/* Controls Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16"
            >
              {/* Filter Categories */}
              <div className="flex flex-wrap items-center gap-3">
                {["all", ...projectCategories.map((cat) => cat.slug)].map(
                  (category) => (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "px-6 py-3 rounded-2xl font-semibold transition-all duration-300 capitalize",
                        selectedCategory === category
                          ? "bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white shadow-lg"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200",
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {category === "all" ? "All Projects" : category}
                    </motion.button>
                  ),
                )}
              </div>

              {/* Search and View Controls */}
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 w-80 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#AA7452] focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-2">
                  <motion.button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-3 rounded-xl transition-all",
                      viewMode === "grid"
                        ? "bg-white shadow-md text-[#AA7452]"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-3 rounded-xl transition-all",
                      viewMode === "list"
                        ? "bg-white shadow-md text-[#AA7452]"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <List className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Projects Grid/List */}
            <motion.div
              key={`${selectedCategory}-${viewMode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={cn(
                "gap-8",
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "space-y-8",
              )}
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  viewMode={viewMode}
                  onView={handleViewProject}
                />
              ))}
            </motion.div>

            {/* No results */}
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No projects found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try adjusting your search criteria or browse all projects to
                  discover our work.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Project Detail Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </Layout>
  );
}

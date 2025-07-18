import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  date: string;
  budget: string;
  status: "Completed" | "In Progress" | "Planning";
  image: string;
  description: string;
  features: string[];
  gallery: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Lagos Smart City Infrastructure",
    category: "Infrastructure",
    location: "Lagos, Nigeria",
    date: "2023-2024",
    budget: "₦15.2B",
    status: "In Progress",
    image:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><rect width='600' height='400' fill='%23f97316'/><text x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='24' font-family='Arial'>Smart City Project</text></svg>",
    description:
      "Revolutionary smart city infrastructure integrating IoT systems, sustainable energy, and modern transportation networks across Lagos metropolitan area.",
    features: [
      "Smart Traffic Systems",
      "IoT Integration",
      "Renewable Energy",
      "Modern Transportation",
    ],
    gallery: [
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><rect width='600' height='400' fill='%23f97316'/><text x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='20' font-family='Arial'>Gallery Image 1</text></svg>",
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><rect width='600' height='400' fill='%23ef4444'/><text x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='20' font-family='Arial'>Gallery Image 2</text></svg>",
    ],
  },
  {
    id: 2,
    title: "Abuja Solar Energy Complex",
    category: "Solar Energy",
    location: "Abuja, Nigeria",
    date: "2023",
    budget: "₦8.7B",
    status: "Completed",
    image:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><rect width='600' height='400' fill='%23eab308'/><text x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='24' font-family='Arial'>Solar Complex</text></svg>",
    description:
      "Massive solar energy installation providing clean, renewable power to over 100,000 homes in the Federal Capital Territory.",
    features: [
      "500MW Capacity",
      "Smart Grid Integration",
      "Battery Storage",
      "Remote Monitoring",
    ],
    gallery: [
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><rect width='600' height='400' fill='%23eab308'/><text x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='20' font-family='Arial'>Solar Gallery 1</text></svg>",
    ],
  },
  {
    id: 3,
    title: "Port Harcourt Housing Estate",
    category: "Housing",
    location: "Port Harcourt, Rivers",
    date: "2022-2023",
    budget: "₦12.4B",
    status: "Completed",
    image:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><rect width='600' height='400' fill='%2306b6d4'/><text x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='24' font-family='Arial'>Housing Estate</text></svg>",
    description:
      "Modern residential complex featuring 2,000+ units with integrated amenities, green spaces, and smart home technology.",
    features: [
      "2000+ Units",
      "Smart Home Tech",
      "Green Spaces",
      "Community Centers",
    ],
    gallery: [
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><rect width='600' height='400' fill='%2306b6d4'/><text x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='20' font-family='Arial'>Housing Gallery 1</text></svg>",
    ],
  },
  {
    id: 4,
    title: "Kano Industrial Complex",
    category: "Infrastructure",
    location: "Kano, Nigeria",
    date: "2024",
    budget: "₦20.1B",
    status: "Planning",
    image:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><rect width='600' height='400' fill='%23dc2626'/><text x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='24' font-family='Arial'>Industrial Complex</text></svg>",
    description:
      "Comprehensive industrial development featuring manufacturing facilities, logistics hubs, and supporting infrastructure.",
    features: [
      "Manufacturing Hubs",
      "Logistics Centers",
      "Power Infrastructure",
      "Digital Integration",
    ],
    gallery: [
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><rect width='600' height='400' fill='%23dc2626'/><text x='300' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='20' font-family='Arial'>Industrial Gallery 1</text></svg>",
    ],
  },
];

export default function ProjectsShowcase() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Planning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const openLightbox = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeLightbox = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === selectedProject.gallery.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProject.gallery.length - 1 : prev - 1,
      );
    }
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Our Portfolio
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Transforming Africa Through{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Exceptional Projects
            </span>
          </h2>
          <p
            className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Discover our portfolio of groundbreaking infrastructure, sustainable
            energy, and innovative housing solutions that are reshaping
            communities across Africa.
          </p>
        </motion.div>

        {/* Projects Carousel */}
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <h3
              className="text-2xl font-semibold text-slate-800 dark:text-white"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Featured Projects
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("left")}
                className="cursor-button"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("right")}
                className="cursor-button"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden cursor-image"
                onClick={() => openLightbox(project)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="cursor-button"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="cursor-button"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {project.category}
                    </Badge>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {project.budget}
                    </span>
                  </div>

                  <h3
                    className="text-xl font-semibold text-slate-800 dark:text-white mb-3 group-hover:text-orange-500 transition-colors duration-300"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {project.title}
                  </h3>

                  <p
                    className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {project.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{project.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full cursor-button"
          >
            <a href="/projects">
              View All Projects
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors duration-300"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="grid md:grid-cols-2 gap-0 h-full">
                {/* Image Side */}
                <div className="relative">
                  <img
                    src={selectedProject.gallery[currentImageIndex]}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  {selectedProject.gallery.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors duration-300"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors duration-300"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Content Side */}
                <div className="p-8 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getStatusColor(selectedProject.status)}>
                      {selectedProject.status}
                    </Badge>
                    <Badge variant="outline">{selectedProject.category}</Badge>
                  </div>

                  <h3
                    className="text-3xl font-bold text-slate-800 dark:text-white mb-4"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {selectedProject.title}
                  </h3>

                  <p
                    className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {selectedProject.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Location
                        </p>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                          {selectedProject.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Timeline
                        </p>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                          {selectedProject.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Budget
                        </p>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                          {selectedProject.budget}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4
                      className="text-lg font-semibold text-slate-800 dark:text-white mb-3"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Key Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white cursor-button">
                    Learn More About This Project
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

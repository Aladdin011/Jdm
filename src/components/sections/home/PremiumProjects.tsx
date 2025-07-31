import { useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
  Filter,
  Grid3X3,
  List,
  Search,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

// Project categories
const categories = [
  { id: 'all', label: 'All Projects', count: 24 },
  { id: 'residential', label: 'Residential', count: 8 },
  { id: 'commercial', label: 'Commercial', count: 7 },
  { id: 'infrastructure', label: 'Infrastructure', count: 5 },
  { id: 'smart-cities', label: 'Smart Cities', count: 4 }
];

// Featured projects data
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
      energy: "40% reduction"
    },
    awards: ["LEED Platinum", "Smart City Award 2023"],
    timeline: "2021-2023"
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
      rating: "5-Star"
    },
    awards: ["Architecture Excellence"],
    timeline: "2022-2024"
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
      amenities: "15+"
    },
    awards: ["Sustainable Development Award"],
    timeline: "2020-2022"
  },
  {
    id: 4,
    title: "Cross River Bridge",
    category: "infrastructure",
    location: "Cross River, Nigeria",
    value: "$55M",
    duration: "30 months",
    status: "completed",
    completion: 100,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
    description: "Major infrastructure project connecting communities with modern bridge engineering and smart monitoring systems.",
    features: ["Smart Monitoring", "LED Lighting", "Weather Systems", "Traffic Management"],
    stats: {
      length: "2.5km",
      capacity: "50,000 vehicles/day",
      safety: "Zero incidents",
      monitoring: "24/7 AI"
    },
    awards: ["Engineering Excellence", "Infrastructure Award"],
    timeline: "2019-2022"
  },
  {
    id: 5,
    title: "Port Harcourt Mall",
    category: "commercial",
    location: "Port Harcourt, Nigeria",
    value: "$22M",
    duration: "15 months",
    status: "completed",
    completion: 100,
    image: "https://images.unsplash.com/photo-1519642055093-45c8770d0e8e?w=800&q=80",
    description: "Modern shopping and entertainment complex with sustainable design and community integration.",
    features: ["Retail Spaces", "Entertainment", "Food Courts", "Parking"],
    stats: {
      stores: "150+",
      visitors: "2M annually",
      parking: "1,000 spaces",
      restaurants: "25+"
    },
    awards: ["Retail Excellence"],
    timeline: "2021-2022"
  },
  {
    id: 6,
    title: "Kaduna Housing Project",
    category: "residential",
    location: "Kaduna, Nigeria",
    value: "$18M",
    duration: "16 months",
    status: "in-progress",
    completion: 60,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    description: "Affordable housing initiative with modern design, energy efficiency, and community development focus.",
    features: ["Affordable Housing", "Energy Efficient", "Community Spaces", "Schools"],
    stats: {
      units: "800",
      affordability: "40% below market",
      energy: "50% savings",
      schools: "3 primary"
    },
    awards: [],
    timeline: "2023-2024"
  }
];

// Project card component
const ProjectCard = ({ project, index, viewMode }: { 
  project: typeof featuredProjects[0]; 
  index: number; 
  viewMode: 'grid' | 'list';
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { trackUserInteraction } = useAppStore();

  const handleProjectClick = () => {
    trackUserInteraction(`project-${project.title.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleViewDetails = () => {
    trackUserInteraction(`project-details-${project.id}`);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        ref={ref}
        className="flex gap-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        onClick={handleProjectClick}
        whileHover={{ y: -4 }}
      >
        {/* Image */}
        <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {project.value}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {project.timeline}
                </span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              project.status === 'completed' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-blue-100 text-blue-600'
            }`}>
              {project.status === 'completed' ? 'Completed' : 'In Progress'}
            </div>
          </div>

          <p className="text-gray-600 line-clamp-2">{project.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {project.features.slice(0, 3).map((feature, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  {feature}
                </span>
              ))}
              {project.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{project.features.length - 3}
                </span>
              )}
            </div>
            <button 
              onClick={handleViewDetails}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProjectClick}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          animate={{ opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        />

        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
          project.status === 'completed' 
            ? 'bg-green-500/90 text-white' 
            : 'bg-blue-500/90 text-white'
        }`}>
          {project.status === 'completed' ? 'Completed' : 'In Progress'}
        </div>

        {/* Awards */}
        {project.awards.length > 0 && (
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 bg-yellow-500/90 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Award className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* Progress Bar for In-Progress Projects */}
        {project.status === 'in-progress' && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white text-xs mb-2">
              <span>Progress</span>
              <span>{project.completion}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="h-2 bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${project.completion}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Hover Actions */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-3">
            <button
              onClick={handleViewDetails}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Play className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {project.location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {project.value}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {project.features.slice(0, 3).map((feature, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {feature}
            </span>
          ))}
          {project.features.length > 3 && (
            <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded">
              +{project.features.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{project.timeline}</span>
          </div>
          <motion.div
            className="flex items-center gap-2 text-orange-600 font-medium text-sm group-hover:text-orange-700 transition-colors"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span>View Project</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Filter and search component
const FilterControls = ({ 
  activeCategory, 
  onCategoryChange, 
  viewMode, 
  onViewModeChange,
  searchTerm,
  onSearchChange 
}: {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}) => (
  <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12">
    {/* Search */}
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
      />
    </div>

    {/* Categories */}
    <div className="flex gap-2 overflow-x-auto">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategory === category.id
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {category.label} ({category.count})
        </button>
      ))}
    </div>

    {/* View Mode Toggle */}
    <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
        }`}
      >
        <Grid3X3 className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
        }`}
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default function PremiumProjects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Filter projects
  const filteredProjects = featuredProjects.filter(project => {
    const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200/30 to-red-200/30 rounded-full blur-3xl"
        style={{ y }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
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
            <Building2 className="w-4 h-4" />
            Our Projects
          </motion.div>

          <h2 className="text-heading-xl mb-6">
            Transforming Africa's
            <br />
            <span className="gradient-text">Urban Landscape</span>
          </h2>

          <p className="text-body-lg max-w-3xl mx-auto">
            Explore our portfolio of groundbreaking construction projects that showcase 
            innovation, sustainability, and excellence across residential, commercial, 
            and infrastructure developments.
          </p>
        </motion.div>

        {/* Filter Controls */}
        <FilterControls
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Projects Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${viewMode}-${searchTerm}`}
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-6"
            }
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                viewMode={viewMode}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Your Project?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can bring your vision to life with our expertise 
            in construction and innovative solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary-premium">
              <span>Start Your Project</span>
              <ArrowRight className="btn-icon" />
            </button>
            <button className="btn-secondary-premium">
              <span>View All Projects</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

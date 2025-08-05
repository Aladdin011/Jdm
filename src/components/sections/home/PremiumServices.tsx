import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  Building2, 
  Home, 
  Factory, 
  Cpu, 
  Shield, 
  Users, 
  ArrowRight,
  Zap,
  CheckCircle,
  Star,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

interface ServiceFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  premium?: boolean;
  stats?: {
    projects: number;
    satisfaction: number;
  };
}

const services: ServiceFeature[] = [
  {
    icon: <Home className="w-8 h-8" />,
    title: "Residential Construction",
    description: "Modern homes built with precision, sustainability, and innovative design for Africa's growing cities.",
    features: [
      "Eco-friendly materials",
      "Smart home integration", 
      "Energy-efficient systems",
      "Custom architectural designs"
    ],
    premium: true,
    stats: { projects: 250, satisfaction: 98 }
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Commercial Development",
    description: "State-of-the-art commercial complexes that drive economic growth and urban development.",
    features: [
      "Mixed-use developments",
      "LEED certified buildings",
      "Advanced security systems",
      "Flexible workspace designs"
    ],
    stats: { projects: 150, satisfaction: 96 }
  },
  {
    icon: <Factory className="w-8 h-8" />,
    title: "Infrastructure Projects",
    description: "Critical infrastructure that connects communities and enables sustainable urban expansion.",
    features: [
      "Road & bridge construction",
      "Water treatment facilities",
      "Power generation systems",
      "Telecommunications networks"
    ],
    stats: { projects: 80, satisfaction: 99 }
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: "Smart City Solutions",
    description: "Integrated technology platforms that transform urban living through intelligent systems.",
    features: [
      "IoT sensor networks",
      "Traffic management systems",
      "Smart lighting solutions",
      "Digital governance platforms"
    ],
    premium: true,
    stats: { projects: 45, satisfaction: 95 }
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Project Management",
    description: "End-to-end project oversight ensuring on-time delivery and budget optimization.",
    features: [
      "Risk assessment & mitigation",
      "Quality assurance protocols",
      "Timeline optimization",
      "Stakeholder coordination"
    ],
    stats: { projects: 300, satisfaction: 97 }
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Remote Workforce Platform",
    description: "Digital platform connecting skilled professionals with construction projects across Africa.",
    features: [
      "Skill verification system",
      "Real-time project tracking",
      "Payment gateway integration",
      "Performance analytics"
    ],
    premium: true,
    stats: { projects: 500, satisfaction: 94 }
  }
];

// Premium Glass Service Card Component
const GlassServiceCard = ({ service, index }: { service: ServiceFeature; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const { trackUserInteraction } = useAppStore();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  const handleCardClick = () => {
    trackUserInteraction(`service-card-${service.title.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Glass Card Container */}
      <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer overflow-hidden">
        
        {/* Dynamic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-orange-500/5 rounded-2xl" />
        
        {/* Mouse follow spotlight */}
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-orange-400/10 to-amber-400/10 blur-xl pointer-events-none"
          style={{
            left: mousePosition.x - 64,
            top: mousePosition.y - 64,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Premium Badge */}
        {service.premium && (
          <motion.div
            className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-xs font-semibold rounded-full backdrop-blur-sm border border-orange-300/30 shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
          >
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              PREMIUM
            </div>
          </motion.div>
        )}

        {/* Content Container */}
        <div className="relative z-10 space-y-6">
          
          {/* Icon Section */}
          <motion.div
            className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400/20 to-amber-400/20 backdrop-blur-sm border border-orange-300/30 flex items-center justify-center text-orange-500 shadow-lg"
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              boxShadow: "0 20px 40px rgba(251, 146, 60, 0.3)"
            }}
            transition={{ duration: 0.4 }}
          >
            {service.icon}
          </motion.div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white group-hover:text-orange-200 transition-colors duration-300">
              {service.title}
            </h3>
            <p className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
              {service.description}
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            {service.features.map((feature, featureIndex) => (
              <motion.div
                key={featureIndex}
                className="flex items-center gap-3 text-white/70 group-hover:text-white/85 transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: (index * 0.15) + (featureIndex * 0.1) }}
              >
                <div className="w-5 h-5 rounded-full bg-green-400/20 backdrop-blur-sm border border-green-300/30 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          {service.stats && (
            <motion.div
              className="flex items-center gap-6 pt-4 border-t border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 + 0.5 }}
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 backdrop-blur-sm border border-blue-400/20">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-200">{service.stats.projects}+ Projects</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 backdrop-blur-sm border border-yellow-400/20">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-200">{service.stats.satisfaction}% Success</span>
              </div>
            </motion.div>
          )}

          {/* Learn More Button */}
          <motion.div
            className="pt-4"
            whileHover={{ x: 8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 text-orange-300 hover:text-orange-200 font-medium cursor-pointer transition-colors duration-300">
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
            </div>
          </motion.div>
        </div>

        {/* Glass shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
          animate={isHovered ? { translateX: "200%" } : {}}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Border glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400/20 via-amber-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
      </div>
    </motion.div>
  );
};

// Glass Process Steps Component
const GlassProcessSteps = () => {
  const steps = [
    { number: 1, title: "Consultation", description: "Initial project assessment and planning", icon: <Users className="w-6 h-6" /> },
    { number: 2, title: "Design", description: "Architectural design and engineering", icon: <Cpu className="w-6 h-6" /> },
    { number: 3, title: "Build", description: "Construction and quality monitoring", icon: <Factory className="w-6 h-6" /> },
    { number: 4, title: "Deliver", description: "Final inspection and handover", icon: <CheckCircle className="w-6 h-6" /> }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
      {steps.map((step, index) => (
        <motion.div
          key={step.number}
          className="relative group"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          {/* Connection Line */}
          {index < steps.length - 1 && (
            <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-orange-400/50 via-amber-400/50 to-transparent z-0" />
          )}
          
          {/* Glass Step Container */}
          <div className="relative text-center p-6 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 group">
            
            {/* Step Number Circle */}
            <motion.div
              className="relative z-10 w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-2xl border border-orange-300/30"
              whileHover={{ scale: 1.1, rotateY: 180 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
              {step.number}
            </motion.div>
            
            {/* Step Icon */}
            <motion.div
              className="absolute top-6 left-1/2 transform -translate-x-1/2 w-20 h-20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {step.icon}
            </motion.div>
            
            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-orange-200 transition-colors duration-300">
              {step.title}
            </h4>
            <p className="text-white/70 group-hover:text-white/85 transition-colors duration-300">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function PremiumServices() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      id="services" 
      ref={sectionRef} 
      className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    >
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full blur-3xl"
        style={{ y: y }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full blur-3xl"
        style={{ y: y.get() * -0.5 }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Floating glass orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              x: [-10, 10, -10],
              opacity: [0, 1, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/10 backdrop-blur-xl border border-orange-400/20 text-orange-300 rounded-full text-sm font-medium mb-8 shadow-lg"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4" />
            Our Premium Services
          </motion.div>

          {/* Main Title */}
          <motion.h2
            className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Comprehensive Construction
            <br />
            <span className="bg-gradient-to-r from-orange-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">
              Solutions for Africa
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            From residential developments to smart city infrastructure, we deliver 
            world-class construction services that shape Africa's urban landscape 
            with innovation, sustainability, and excellence.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services.map((service, index) => (
            <GlassServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glass container for process section */}
          <div className="p-12 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
            <div className="text-center mb-12">
              <motion.h3 
                className="text-4xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Our Process
              </motion.h3>
              <motion.p 
                className="text-xl text-white/80 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                A streamlined approach that ensures every project is delivered 
                on time, within budget, and to the highest quality standards.
              </motion.p>
            </div>
            <GlassProcessSteps />
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
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-xl font-semibold shadow-2xl hover:shadow-orange-500/30 backdrop-blur-sm border border-orange-300/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <span>Start Your Project</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.button>
            
            <motion.button
              className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl font-semibold hover:bg-white/15 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Download Brochure
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

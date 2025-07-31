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
  Star
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

// Individual service card component
const ServiceCard = ({ service, index }: { service: ServiceFeature; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tiltAngle, setTiltAngle] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const { trackUserInteraction } = useAppStore();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (centerX - e.clientX) / 10;
    
    setTiltAngle({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTiltAngle({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleCardClick = () => {
    trackUserInteraction(`service-card-${service.title.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <motion.div
      ref={cardRef}
      className="service-card-premium gpu-accelerated group"
      style={{
        transform: `perspective(1000px) rotateX(${tiltAngle.x}deg) rotateY(${tiltAngle.y}deg)`,
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* Premium Badge */}
      {service.premium && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold rounded-full">
          PREMIUM
        </div>
      )}

      {/* Card Icon */}
      <motion.div
        className="card-icon"
        animate={isHovered ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {service.icon}
      </motion.div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-heading-md">{service.title}</h3>
        <p className="text-body text-gray-600 leading-relaxed">{service.description}</p>

        {/* Features List */}
        <ul className="space-y-2">
          {service.features.map((feature, featureIndex) => (
            <motion.li
              key={featureIndex}
              className="flex items-center gap-3 text-sm text-gray-600"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) }}
            >
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* Stats */}
        {service.stats && (
          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700">{service.stats.projects}+ Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">{service.stats.satisfaction}% Satisfaction</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <motion.span
          className="learn-more flex items-center gap-2"
          animate={isHovered ? { x: 8 } : { x: 0 }}
          transition={{ duration: 0.3 }}
        >
          Learn More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.span>
      </div>

      {/* Hover Effect Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-xl opacity-0 pointer-events-none"
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

// Process steps component
const ProcessSteps = () => {
  const steps = [
    { number: 1, title: "Consultation", description: "Initial project assessment and planning" },
    { number: 2, title: "Design", description: "Architectural design and engineering" },
    { number: 3, title: "Build", description: "Construction and quality monitoring" },
    { number: 4, title: "Deliver", description: "Final inspection and handover" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
      {steps.map((step, index) => (
        <motion.div
          key={step.number}
          className="text-center relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          {/* Connection Line */}
          {index < steps.length - 1 && (
            <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-orange-300 to-transparent z-0" />
          )}
          
          {/* Step Number */}
          <motion.div
            className="relative z-10 w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {step.number}
          </motion.div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h4>
          <p className="text-sm text-gray-600">{step.description}</p>
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
    <section id="services" ref={sectionRef} className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"
        style={{ y: y }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
        style={{ y: y.get() * -0.5 }}
      />

      <div className="container-fluid relative z-10">
        <motion.div
          style={{ opacity }}
          className="text-center mb-16"
        >
          {/* Section Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Zap className="w-4 h-4" />
            Our Services
          </motion.div>

          {/* Section Title */}
          <motion.h2
            className="text-heading-xl mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Comprehensive Construction
            <br />
            <span className="gradient-text">Solutions for Africa</span>
          </motion.h2>

          <motion.p
            className="text-body-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            From residential developments to smart city infrastructure, we deliver 
            world-class construction services that shape Africa's urban landscape 
            with innovation, sustainability, and excellence.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid-services stagger-container mb-20">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* Process Steps */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-heading-lg mb-4">Our Process</h3>
            <p className="text-body max-w-2xl mx-auto">
              A streamlined approach that ensures every project is delivered 
              on time, within budget, and to the highest quality standards.
            </p>
          </div>
          <ProcessSteps />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button className="btn-primary-premium">
              <span>Start Your Project</span>
              <ArrowRight className="btn-icon" />
            </button>
            <button className="btn-secondary-premium">
              <span>Download Brochure</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

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
  Sparkles,
  TrendingUp
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
      "Mobile workforce management"
    ],
    premium: true,
    stats: { projects: 200, satisfaction: 94 }
  }
];

const ServiceCard = ({ service, index }: { service: ServiceFeature; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className="relative h-full bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-arch-orange/20 overflow-hidden">
        {/* Premium Badge */}
        {service.premium && (
          <div className="absolute top-6 right-6 z-10">
            <div className="bg-gradient-to-r from-arch-orange to-arch-rust text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Premium
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          {/* Icon Section */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-arch-orange/10 to-arch-rust/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <div className="text-arch-orange group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-arch-charcoal mb-3 group-hover:text-arch-orange transition-colors duration-300">
              {service.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Features List */}
          <div className="mb-6">
            <ul className="space-y-2">
              {service.features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-center gap-3 text-sm text-gray-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: (index * 0.15) + (idx * 0.1) }}
                >
                  <div className="w-1.5 h-1.5 bg-arch-orange rounded-full flex-shrink-0"></div>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          {service.stats && (
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-arch-orange">{service.stats.projects}+</div>
                <div className="text-xs text-gray-600">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-arch-orange">{service.stats.satisfaction}%</div>
                <div className="text-xs text-gray-600">Satisfaction</div>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <motion.button
            className="w-full bg-white border-2 border-arch-orange text-arch-orange py-3 px-6 rounded-xl font-semibold hover:bg-arch-orange hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-arch-orange/5 to-arch-rust/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
      </div>
    </motion.div>
  );
};

export default function PremiumServices() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y }}
          className="absolute top-20 -left-40 w-80 h-80 bg-gradient-to-r from-arch-orange/5 to-arch-rust/5 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y.get() * -0.5 }}
          className="absolute bottom-20 -right-40 w-96 h-96 bg-gradient-to-r from-arch-blue-gray/5 to-arch-charcoal/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 bg-arch-orange/10 border border-arch-orange/20 rounded-full text-arch-orange font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Building2 className="w-5 h-5" />
            <span>Our Expertise</span>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-arch-charcoal mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Comprehensive Construction
            <br />
            <span className="bg-gradient-to-r from-arch-orange to-arch-rust bg-clip-text text-transparent">
              & Development Services
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From residential buildings to smart city infrastructure, we deliver
            innovative solutions that shape Africa's urban landscape with
            precision, sustainability, and cutting-edge technology.
          </motion.p>

          {/* Stats Bar */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[
              { number: "500+", label: "Projects Completed", icon: Building2 },
              { number: "15+", label: "Years Experience", icon: TrendingUp },
              { number: "98%", label: "Client Satisfaction", icon: Star },
              { number: "50+", label: "Cities Served", icon: Users },
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                    <IconComponent className="w-6 h-6 text-arch-orange mx-auto mb-2" />
                    <div className="text-2xl font-bold text-arch-charcoal">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-arch-charcoal mb-4">
            Ready to Start Your Project?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can bring your vision to life with our
            comprehensive construction and development expertise.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-8 py-4 bg-arch-orange text-white rounded-xl font-semibold hover:bg-arch-rust transition-colors duration-300 flex items-center gap-2 justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-arch-orange hover:text-arch-orange transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Our Portfolio
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

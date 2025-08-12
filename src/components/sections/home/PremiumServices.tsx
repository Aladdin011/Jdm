import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
  TrendingUp,
  Eye,
} from "lucide-react";

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
  backgroundImage?: string;
  category: string;
}

const services: ServiceFeature[] = [
  {
    icon: <Home className="w-8 h-8" />,
    title: "Residential Construction",
    description:
      "Modern homes and residential complexes built with international standards and local expertise for comfortable living.",
    category: "residential",
    features: [
      "Custom Home Design",
      "Smart Home Integration",
      "Sustainable Materials",
      "Energy Efficiency",
    ],
    premium: true,
    stats: { projects: 150, satisfaction: 98 },
    backgroundImage:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop",
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Commercial Buildings",
    description:
      "Office complexes, retail spaces, and commercial infrastructure designed for business growth and operational efficiency.",
    category: "commercial",
    features: [
      "Office Complexes",
      "Retail Spaces",
      "Mixed-Use Development",
      "LEED Certification",
    ],
    stats: { projects: 75, satisfaction: 96 },
    backgroundImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop",
  },
  {
    icon: <Factory className="w-8 h-8" />,
    title: "Infrastructure Projects",
    description:
      "Roads, bridges, and public infrastructure that form the backbone of Africa's development and connectivity.",
    category: "infrastructure",
    features: [
      "Road Construction",
      "Bridge Engineering",
      "Public Facilities",
      "Utility Systems",
    ],
    premium: true,
    stats: { projects: 200, satisfaction: 99 },
    backgroundImage:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop",
  },
];

const ServiceCard = ({
  service,
  index,
}: {
  service: ServiceFeature;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      className="group relative h-full"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className="relative h-full bg-white rounded-3xl overflow-hidden border border-gray-100 group-hover:border-[#AA7452]/30 transition-all duration-500 min-h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('${service.backgroundImage}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#051822]/90 via-[#2D383E]/85 to-[#7C5841]/80 group-hover:from-[#051822]/95 group-hover:via-[#2D383E]/90 group-hover:to-[#7C5841]/85 transition-all duration-500" />
        </div>

        {/* Premium Badge */}
        {service.premium && (
          <div className="absolute top-6 right-6 z-10">
            <motion.div
              className="bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 + 0.5 }}
            >
              <Sparkles className="w-3 h-3" />
              Premium
            </motion.div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 p-8 h-full flex flex-col text-white">
          {/* Icon Section */}
          <div className="mb-6">
            <motion.div
              className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#AA7452] transition-all duration-300"
              whileHover={{ rotate: 10 }}
            >
              <div className="text-[#AA7452] group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>
            </motion.div>
          </div>

          {/* Title and Description */}
          <div className="mb-6 flex-1">
            <h3 className="text-2xl font-bold mb-4 group-hover:text-[#AA7452] transition-colors duration-300">
              {service.title}
            </h3>
            <p className="text-white/80 leading-relaxed mb-6">
              {service.description}
            </p>

            {/* Features List */}
            <div className="space-y-3">
              {service.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-3 text-sm text-white/70"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15 + idx * 0.1 + 0.5,
                  }}
                >
                  <CheckCircle className="w-4 h-4 text-[#AA7452] flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats */}
          {service.stats && (
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#AA7452]">
                  {service.stats.projects}+
                </div>
                <div className="text-xs text-white/70">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#AA7452]">
                  {service.stats.satisfaction}%
                </div>
                <div className="text-xs text-white/70">Satisfaction</div>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <motion.button
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-4 px-6 rounded-xl font-semibold hover:bg-[#AA7452] hover:border-[#AA7452] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Hover Expansion Panel */}
        <motion.div
          className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-xl border-t border-white/20 p-6 transition-all duration-500 overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          style={{ height: isExpanded ? "auto" : 0 }}
        >
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#051822]">
              Recent Projects
            </h4>

            {/* Project Gallery */}
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="w-full h-full bg-gradient-to-br from-[#AA7452]/20 to-[#7C5841]/20 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-[#AA7452]" />
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              className="w-full bg-[#AA7452] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#7C5841] transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Projects
            </motion.button>
          </div>
        </motion.div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#AA7452]/5 to-[#7C5841]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl z-5"></div>
      </div>
    </motion.div>
  );
};

export default function PremiumServices() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-[#FAFBFC] relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y }}
          className="absolute top-20 -left-40 w-80 h-80 bg-gradient-to-r from-[#AA7452]/5 to-[#7C5841]/5 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y.get() * -0.5 }}
          className="absolute bottom-20 -right-40 w-96 h-96 bg-gradient-to-r from-[#2D383E]/5 to-[#051822]/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#AA7452]/10 border border-[#AA7452]/20 rounded-full text-[#AA7452] font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Zap className="w-5 h-5" />
            <span>Our Expertise</span>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-[#051822] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Comprehensive Construction
            <br />
            <span className="bg-gradient-to-r from-[#AA7452] to-[#7C5841] bg-clip-text text-transparent">
              Solutions
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From residential projects to large-scale infrastructure, we deliver
            excellence across every construction vertical in Africa.
          </motion.p>
        </motion.div>

        {/* Interactive Service Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* Trust Metrics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            {
              number: "98.5%",
              label: "Project Success Rate",
              icon: CheckCircle,
            },
            { number: "4.9/5", label: "Average Rating", icon: Star },
            { number: "24/7", label: "Platform Support", icon: Shield },
            { number: "50+", label: "Cities Served", icon: TrendingUp },
          ].map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={metric.label}
                className="text-center p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#AA7452]/30 hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 bg-[#AA7452]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-[#AA7452]" />
                </div>
                <div className="text-2xl font-bold text-[#051822] mb-1">
                  {metric.number}
                </div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

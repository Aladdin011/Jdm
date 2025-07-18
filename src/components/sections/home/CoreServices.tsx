import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Zap,
  Wrench,
  Shield,
  Lightbulb,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    icon: Building2,
    title: "Construction & Infrastructure",
    shortDescription:
      "Premium construction services from residential to large-scale infrastructure projects.",
    fullDescription:
      "We deliver world-class construction projects that meet international standards. Our expertise spans residential buildings, commercial complexes, industrial facilities, and large-scale infrastructure developments.",
    features: [
      "Project Management",
      "Quality Assurance",
      "Timeline Adherence",
      "Safety Compliance",
    ],
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    id: 2,
    icon: Zap,
    title: "Solar Energy Solutions",
    shortDescription:
      "Sustainable solar installations for homes, businesses, and communities.",
    fullDescription:
      "Leading the renewable energy revolution with cutting-edge solar solutions. We design, install, and maintain solar systems that reduce costs and environmental impact.",
    features: [
      "System Design",
      "Installation Service",
      "Maintenance Support",
      "Energy Consulting",
    ],
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    id: 3,
    icon: Wrench,
    title: "Engineering Services",
    shortDescription:
      "Comprehensive engineering solutions for complex technical challenges.",
    fullDescription:
      "Our experienced engineering team provides innovative solutions for structural, mechanical, and electrical challenges across various industries and project scales.",
    features: [
      "Structural Design",
      "Technical Analysis",
      "System Integration",
      "Compliance Review",
    ],
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: 4,
    icon: Shield,
    title: "Project Consultation",
    shortDescription:
      "Expert guidance from concept to completion for all project types.",
    fullDescription:
      "Strategic consultation services that ensure project success through proper planning, risk assessment, and stakeholder management from initial concept to final delivery.",
    features: [
      "Feasibility Studies",
      "Risk Assessment",
      "Strategic Planning",
      "Stakeholder Management",
    ],
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    id: 5,
    icon: Lightbulb,
    title: "Innovation & R&D",
    shortDescription:
      "Research and development for next-generation construction technologies.",
    fullDescription:
      "Pioneering innovative construction methods and materials to enhance efficiency, sustainability, and cost-effectiveness in all our projects and services.",
    features: [
      "Technology Research",
      "Material Innovation",
      "Process Optimization",
      "Sustainability Focus",
    ],
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: 6,
    icon: Users,
    title: "Training & Development",
    shortDescription:
      "Professional development programs for construction industry excellence.",
    fullDescription:
      "Comprehensive training programs that build capacity and ensure industry best practices across all levels of construction and engineering professionals.",
    features: [
      "Skills Development",
      "Safety Training",
      "Technical Certification",
      "Industry Best Practices",
    ],
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
];

const ServiceCard = ({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative h-80 perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-text"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front of card */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl ${service.bgColor} border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <div className="p-8 h-full flex flex-col justify-between">
            <div>
              <div
                className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl mb-6 shadow-lg`}
              >
                <service.icon className="h-8 w-8 text-white" />
              </div>

              <h3
                className="text-2xl font-bold text-slate-800 dark:text-white mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {service.title}
              </h3>

              <p
                className="text-slate-600 dark:text-slate-300 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {service.shortDescription}
              </p>
            </div>

            <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
              <span>Hover to learn more</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br ${service.color} shadow-lg rotate-y-180`}
        >
          <div className="p-8 h-full flex flex-col justify-between text-white">
            <div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {service.title}
              </h3>

              <p
                className="text-white/90 leading-relaxed mb-6"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {service.fullDescription}
              </p>

              <div className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                    className="flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-white/80" />
                    <span className="text-sm text-white/90">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <Button
              asChild
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 cursor-button"
            >
              <Link to="/services">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function CoreServices() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-orange-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <span
              className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Our Core Services
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Comprehensive Solutions for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Every Challenge
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            From innovative construction projects to sustainable energy
            solutions, we deliver excellence across every aspect of
            infrastructure development and engineering services.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-12 max-w-4xl mx-auto border border-slate-200 dark:border-slate-700">
            <h3
              className="text-3xl font-bold text-slate-800 dark:text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to Transform Your Vision into Reality?
            </h3>
            <p
              className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Let's discuss how our comprehensive services can bring your
              project to life with excellence, innovation, and unwavering
              commitment to quality.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-full cursor-button"
              >
                <Link to="/contact">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-slate-300 dark:border-slate-600 px-8 py-4 text-lg font-semibold rounded-full cursor-button"
              >
                <Link to="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import React, { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Award,
  Calendar,
  Users,
  MapPin,
  Target,
  Lightbulb,
  Zap,
  Building2,
  Globe2,
  CheckCircle,
  ArrowRight,
  Play,
  TrendingUp,
  Sparkles,
  Eye,
  Heart,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";

// Company stats data
const companyStats = [
  {
    value: "17+",
    label: "Years of Excellence",
    icon: <Calendar className="w-6 h-6" />,
    description: "Since 2007",
    color: "from-blue-500 to-cyan-500",
  },
  {
    value: "500+",
    label: "Projects Completed",
    icon: <Building2 className="w-6 h-6" />,
    description: "Across Africa",
    color: "from-green-500 to-emerald-500",
  },
  {
    value: "$50M+",
    label: "Investment Value",
    icon: <TrendingUp className="w-6 h-6" />,
    description: "USD Total",
    color: "from-purple-500 to-pink-500",
  },
  {
    value: "98%",
    label: "Client Satisfaction",
    icon: <Award className="w-6 h-6" />,
    description: "Success Rate",
    color: "from-arch-orange to-arch-rust",
  },
];

// Values data
const companyValues = [
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Innovation",
    description:
      "Pioneering sustainable construction technologies and smart city solutions across Africa.",
    color: "from-arch-orange to-arch-rust",
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Quality",
    description:
      "Uncompromising commitment to excellence in every project we undertake.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Collaboration",
    description:
      "Building strong partnerships with clients, communities, and stakeholders.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Globe2 className="w-8 h-8" />,
    title: "Sustainability",
    description:
      "Creating environmentally responsible solutions for future generations.",
    color: "from-purple-500 to-pink-500",
  },
];

// Modern Stats Card Component
const ModernStatsCard = ({ stat, index }: { stat: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true });

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      initial={{ opacity: 0, scale: 0.8, y: 60 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl border border-gray-100 group-hover:border-arch-orange/20 transition-all duration-500 text-center overflow-hidden">
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}
        />

        {/* Icon */}
        <div className="relative z-10 mb-6">
          <div
            className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}
          >
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
              <div
                className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            className="text-4xl font-bold text-arch-charcoal mb-2"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {stat.value}
          </motion.div>

          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            {stat.label}
          </h4>

          <p className="text-sm text-gray-600">{stat.description}</p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
          <Sparkles className="w-6 h-6 text-arch-orange" />
        </div>
      </div>
    </motion.div>
  );
};

// Value Card Component
const ValueCard = ({ value, index }: { value: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true });

  return (
    <motion.div
      ref={cardRef}
      className="group"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <div className="relative h-full p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl border border-gray-100 group-hover:border-arch-orange/20 transition-all duration-500">
        {/* Icon */}
        <div className="mb-6">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}
          >
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
              <div
                className={`bg-gradient-to-r ${value.color} bg-clip-text text-transparent`}
              >
                {value.icon}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-arch-charcoal mb-4 group-hover:text-arch-orange transition-colors duration-300">
          {value.title}
        </h3>

        <p className="text-gray-600 leading-relaxed">{value.description}</p>

        {/* Hover Effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl pointer-events-none`}
        />
      </div>
    </motion.div>
  );
};

export default function PremiumAbout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.8],
  );

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y }}
          className="absolute top-20 -left-40 w-80 h-80 bg-gradient-to-r from-arch-orange/5 to-arch-rust/5 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y.get() * -0.5 }}
          className="absolute bottom-20 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"
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
            <Heart className="w-5 h-5" />
            <span>About JD Marc</span>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-arch-charcoal mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Building Africa's Future
            <br />
            <span className="bg-gradient-to-r from-arch-orange to-arch-rust bg-clip-text text-transparent">
              One Project at a Time
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Since 2007, JD Marc Limited has been at the forefront of African
            infrastructure development, delivering innovative construction
            solutions that transform communities and drive economic growth
            across the continent.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {companyStats.map((stat, index) => (
            <ModernStatsCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* Mission & Vision Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-arch-orange" />
                  <h3 className="text-3xl font-bold text-arch-charcoal">
                    Our Mission
                  </h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To provide reliable, cost-effective engineering and
                  construction services that meet international standards while
                  solving Africa's pressing infrastructure needs with innovative
                  solutions and sustainable practices.
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-8 h-8 text-arch-orange" />
                  <h3 className="text-3xl font-bold text-arch-charcoal">
                    Our Vision
                  </h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To become Africa's most trusted construction
                  partner—delivering quality, innovation, and sustainable
                  solutions that shape smarter cities and resilient communities
                  across the continent.
                </p>
              </div>

              {/* CTA Button */}
              <motion.button
                className="px-8 py-4 bg-arch-orange text-white rounded-xl font-semibold hover:bg-arch-rust transition-colors duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Learn Our Story</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/about1.jpg"
                  alt="JD Marc construction project"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-arch-charcoal/20 to-transparent" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-arch-orange hover:scale-110 transition-transform duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </motion.button>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-arch-orange">17+</div>
                  <div className="text-sm text-gray-600">Years</div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-arch-orange">3</div>
                  <div className="text-sm text-gray-600">Continents</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-arch-charcoal mb-6">
              Our Core Values
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide every decision we make and every project we
              undertake, ensuring we deliver excellence while building lasting
              relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

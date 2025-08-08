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
  Heart
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";

// Company stats data
const companyStats = [
  {
    value: "15+",
    label: "Years of Excellence",
    icon: <Calendar className="w-6 h-6" />,
    description: "Since 2007",
    color: "from-blue-400 to-cyan-400",
  },
  {
    value: "500+",
    label: "Projects Completed",
    icon: <Building2 className="w-6 h-6" />,
    description: "Across Africa",
    color: "from-green-400 to-emerald-400",
  },
  {
    value: "$50M+",
    label: "Investment Value",
    icon: <TrendingUp className="w-6 h-6" />,
    description: "USD Total",
    color: "from-purple-400 to-pink-400",
  },
  {
    value: "98%",
    label: "Client Satisfaction",
    icon: <Award className="w-6 h-6" />,
    description: "Success Rate",
    color: "from-orange-400 to-amber-400",
  },
];

// Values data
const companyValues = [
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Innovation",
    description: "Pioneering sustainable construction technologies and smart city solutions across Africa.",
    color: "from-yellow-400 to-orange-400"
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Quality",
    description: "Uncompromising commitment to excellence in every project we undertake.",
    color: "from-green-400 to-emerald-400"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Collaboration",
    description: "Building strong partnerships with clients, communities, and stakeholders.",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: <Globe2 className="w-8 h-8" />,
    title: "Sustainability",
    description: "Creating environmentally responsible solutions for future generations.",
    color: "from-purple-400 to-pink-400"
  }
];

// Glass Stats Card Component
const GlassStatsCard = ({ stat, index }: { stat: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true });

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, scale: 0.8, y: 60 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 text-center overflow-hidden">
        
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl`} />
        
        {/* Floating background decoration */}
        <motion.div
          className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-xl`}
          animate={isHovered ? { scale: 1.3, rotate: 180 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.8 }}
        />

        <div className="relative z-10 space-y-4">
          {/* Icon */}
          <motion.div
            className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${stat.color} p-3 text-white shadow-lg`}
            whileHover={{ 
              scale: 1.2, 
              rotate: 360,
              boxShadow: "0 20px 40px rgba(255, 255, 255, 0.2)"
            }}
            transition={{ duration: 0.6 }}
          >
            {stat.icon}
          </motion.div>

          {/* Value */}
          <motion.div 
            className="text-4xl lg:text-5xl font-bold text-white group-hover:text-orange-200 transition-colors duration-300"
            animate={isInView ? { scale: [0.8, 1.1, 1] } : {}}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
          >
            {stat.value}
          </motion.div>

          {/* Label */}
          <div className="space-y-1">
            <div className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors duration-300">
              {stat.label}
            </div>
            <div className="text-white/60 group-hover:text-white/75 transition-colors duration-300 text-sm">
              {stat.description}
            </div>
          </div>
        </div>

        {/* Glass shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
        />
      </div>
    </motion.div>
  );
};

// Glass Values Card Component
const GlassValuesCard = ({ value, index }: { value: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      initial={{ opacity: 0, y: 80, rotateX: -20 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden h-full">
        
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-5 group-hover:opacity-15 transition-opacity duration-500 rounded-2xl`} />
        
        {/* Animated background shapes */}
        <motion.div
          className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${value.color} opacity-10 rounded-full blur-lg`}
          animate={isHovered ? { scale: 1.5, rotate: 90 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.6 }}
        />

        <div className="relative z-10 space-y-6">
          {/* Icon */}
          <motion.div
            className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} p-3 text-white shadow-lg backdrop-blur-sm`}
            whileHover={{ 
              scale: 1.1, 
              rotate: 15,
              boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)"
            }}
            transition={{ duration: 0.4 }}
          >
            {value.icon}
          </motion.div>

          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white group-hover:text-orange-200 transition-colors duration-300">
              {value.title}
            </h3>
            <p className="text-white/70 group-hover:text-white/85 transition-colors duration-300 leading-relaxed">
              {value.description}
            </p>
          </div>

          {/* Decorative element */}
          <motion.div
            className={`w-12 h-1 bg-gradient-to-r ${value.color} rounded-full`}
            initial={{ width: 0 }}
            animate={isInView ? { width: 48 } : {}}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default function PremiumAbout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-full blur-3xl"
        style={{ y }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full blur-3xl"
        style={{ y: y.get() * -0.7 }}
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-orange-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-40, -200, -40],
              x: [-20, 20, -20],
              opacity: [0, 1, 0],
              scale: [0.5, 2, 0.5],
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          style={{ opacity }}
          className="text-center mb-24"
        >
          {/* Glass Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/10 backdrop-blur-xl border border-purple-400/20 text-purple-300 rounded-full text-sm font-medium mb-8 shadow-lg"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Building2 className="w-4 h-4" />
            About JD Marc Limited
          </motion.div>

          {/* Main Title */}
          <motion.h2
            className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Building Africa's
            <br />
            <span className="bg-gradient-to-r from-orange-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">
              Future Cities
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Since 2007, we've been at the forefront of Africa's construction revolution, 
            delivering innovative solutions that transform communities and create lasting impact 
            across the continent.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {companyStats.map((stat, index) => (
            <GlassStatsCard key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>

        {/* Vision & Mission Section */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 mb-32"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Vision */}
          <div className="relative p-10 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500 rounded-3xl" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 p-3 text-white shadow-lg">
                  <Eye className="w-full h-full" />
                </div>
                <h3 className="text-3xl font-bold text-white">Our Vision</h3>
              </div>
              
              <p className="text-lg text-white/80 leading-relaxed">
                To be Africa's leading construction innovator, creating sustainable urban 
                environments that enhance quality of life and drive economic prosperity 
                across the continent.
              </p>
            </div>

            {/* Glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>

          {/* Mission */}
          <div className="relative p-10 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 group-hover:from-orange-500/10 group-hover:to-amber-500/10 transition-all duration-500 rounded-3xl" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-amber-400 p-3 text-white shadow-lg">
                  <Target className="w-full h-full" />
                </div>
                <h3 className="text-3xl font-bold text-white">Our Mission</h3>
              </div>
              
              <p className="text-lg text-white/80 leading-relaxed">
                To deliver exceptional construction services through innovation, sustainability, 
                and excellence, while empowering local communities and setting new standards 
                for the industry.
              </p>
            </div>

            {/* Glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <motion.h3 
              className="text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Core Values
            </motion.h3>
            <motion.p 
              className="text-xl text-white/80 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The principles that guide everything we do and define who we are as a company.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <GlassValuesCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Glass CTA Container */}
          <div className="relative inline-block p-10 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-3xl" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-orange-400" />
                <h3 className="text-3xl font-bold text-white">
                  Let's Build Something Amazing Together
                </h3>
                <Sparkles className="w-6 h-6 text-orange-400" />
              </div>
              
              <p className="text-white/80 max-w-2xl mx-auto text-lg">
                Ready to transform your vision into reality? Partner with Africa's most innovative construction company.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
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
                  <div className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    <span>Learn More</span>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Background decorations */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-xl" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

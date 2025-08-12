import { useState, useRef } from "react";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { teamMembers, companyValues, certifications } from "@/data/team";
import {
  Award,
  CheckCircle,
  Leaf,
  Shield,
  Lightbulb,
  Users,
  MapPin,
  Building2,
  Globe,
  Target,
  Heart,
  Zap,
  ArrowRight,
  Calendar,
  TrendingUp,
  Star,
  Sparkles,
  Eye,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

const valueIcons = {
  award: <Award className="w-8 h-8" />,
  shield: <Shield className="w-8 h-8" />,
  leaf: <Leaf className="w-8 h-8" />,
  lightbulb: <Lightbulb className="w-8 h-8" />,
  "check-circle": <CheckCircle className="w-8 h-8" />,
  handshake: <Users className="w-8 h-8" />,
};

const FloatingShape = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
    animate={{ 
      opacity: [0.1, 0.3, 0.1], 
      scale: [0.8, 1.2, 0.8], 
      rotate: [0, 180, 360],
      x: [0, 50, -50, 0],
      y: [0, -30, 30, 0] 
    }}
    transition={{ 
      duration: 20, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
    className={cn("absolute rounded-full blur-2xl", className)}
  />
);

export default function About() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("vision");
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const handleCardFlip = (id: number) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  return (
    <Layout>
      {/* Enhanced Hero Section with Dynamic Backgrounds */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y, opacity }}
      >
        {/* Dynamic Background with Multiple Layers */}
        <div className="absolute inset-0 z-0">
          <motion.img
            src="https://cdn.builder.io/o/assets%2F751ea84be0da437c8dd3f1bf04173189%2F6fe8dede446d44e5b3f61dac8e245b53?alt=media&token=2cd3aa20-e283-42dd-ad0a-b327725825be&apiKey=751ea84be0da437c8dd3f1bf04173189"
            alt="JD Marc About Background"
            className="w-full h-full object-cover"
            style={{ scale }}
          />
          {/* Enhanced Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-arch-charcoal/50 via-arch-blue-gray/30 to-arch-orange/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-arch-charcoal/80 via-transparent to-arch-rust/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-arch-orange/5 to-transparent" />
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingShape 
            className="top-20 left-20 w-40 h-40 bg-gradient-to-r from-arch-orange/20 to-arch-rust/10" 
            delay={0}
          />
          <FloatingShape 
            className="top-40 right-32 w-32 h-32 bg-gradient-to-r from-arch-light-blue/15 to-arch-blue-gray/10" 
            delay={5}
          />
          <FloatingShape 
            className="bottom-32 left-40 w-36 h-36 bg-gradient-to-r from-white/10 to-arch-orange/5" 
            delay={10}
          />
          <FloatingShape 
            className="bottom-20 right-20 w-44 h-44 bg-gradient-to-r from-arch-rust/15 to-arch-brown/10" 
            delay={15}
          />
          
          {/* Sparkle Effects */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/60 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Enhanced Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-6xl mx-auto"
          >
            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.4 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl border border-white/30 rounded-full text-white font-semibold mb-8 shadow-2xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Building2 className="w-6 h-6 text-arch-orange" />
              </motion.div>
              <span className="text-lg">Building Africa's Future Since 2007</span>
              <Sparkles className="w-5 h-5 text-arch-light-blue" />
            </motion.div>

            {/* Enhanced Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.3 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-none tracking-tight"
            >
              <motion.span
                className="block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                About
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-arch-orange via-arch-rust to-arch-light-blue bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                JD Marc
              </motion.span>
            </motion.h1>

            {/* Enhanced Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-xl md:text-3xl text-white/95 mb-12 max-w-5xl mx-auto leading-relaxed font-light"
            >
              A <span className="text-arch-orange font-semibold">Nigerian-grown</span>, 
              <span className="text-arch-light-blue font-semibold"> Pan-African EPC</span> company 
              focused on delivering total construction and smart city solutions that improve lives 
              and support economic growth across the African continent.
            </motion.p>

            {/* Enhanced Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            >
              {[
                { number: "17+", label: "Years Experience", icon: Calendar, color: "from-arch-orange to-arch-rust" },
                { number: "200+", label: "Projects Completed", icon: Building2, color: "from-arch-blue-gray to-arch-charcoal" },
                { number: "3", label: "Continents", icon: Globe, color: "from-arch-rust to-arch-brown" },
                { number: "98%", label: "Client Satisfaction", icon: Star, color: "from-arch-light-blue to-arch-blue-gray" },
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1, type: "spring", bounce: 0.4 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -10,
                      transition: { type: "spring", stiffness: 400 }
                    }}
                    className="group"
                  >
                    <div className={cn(
                      "bg-gradient-to-br backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl transition-all duration-500 group-hover:shadow-3xl group-hover:border-white/40",
                      "bg-white/10 group-hover:bg-white/20"
                    )}>
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={cn("w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r p-4 flex items-center justify-center", stat.color)}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.div 
                        className="text-4xl md:text-5xl font-black text-white mb-2"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {stat.number}
                      </motion.div>
                      <div className="text-white/90 text-sm font-medium tracking-wide uppercase">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-14 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm bg-white/10"
          >
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-4 bg-gradient-to-b from-arch-orange to-arch-rust rounded-full mt-3"
            />
          </motion.div>
          <motion.p 
            className="text-sm mt-3 text-white/80 font-medium tracking-wider"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SCROLL TO EXPLORE
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Enhanced Vision & Mission Section */}
      <section className="py-32 bg-gradient-to-br from-white via-gray-50/50 to-arch-light-blue/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-arch-charcoal/10 to-transparent" />
        
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-r from-arch-orange/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-40 -right-40 w-96 h-96 bg-gradient-to-l from-arch-rust/5 to-transparent rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-arch-orange/10 to-arch-rust/10 rounded-full text-arch-orange font-semibold mb-8"
            >
              <Target className="w-5 h-5" />
              <span>Our Foundation</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-arch-charcoal mb-8 leading-tight">
              Vision & <span className="text-arch-orange">Purpose</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Built on strong values and clear vision for Africa's infrastructure future
            </p>
          </motion.div>

          {/* Enhanced Tab Navigation */}
          <motion.div 
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-gray-100 to-white rounded-3xl p-3 inline-flex shadow-xl border border-gray-200">
              {[
                { key: "vision", label: "Vision", icon: Eye },
                { key: "mission", label: "Mission", icon: Target },
                { key: "story", label: "Story", icon: Rocket }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 capitalize text-lg",
                      activeTab === tab.key
                        ? "bg-gradient-to-r from-arch-orange to-arch-rust text-white shadow-xl scale-105"
                        : "text-gray-600 hover:text-arch-orange hover:bg-white/50"
                    )}
                    whileHover={{ scale: activeTab === tab.key ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconComponent className="w-5 h-5" />
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Enhanced Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                {activeTab === "vision" && (
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-arch-orange to-arch-rust rounded-2xl flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black text-arch-charcoal">Our Vision</h3>
                    </div>
                    <p className="text-xl text-gray-700 leading-relaxed mb-8">
                      To become Africa's most trusted construction partner—delivering
                      quality, innovation, and sustainable solutions that shape
                      smarter cities and resilient communities across the continent.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {["Quality", "Innovation", "Sustainability", "Trust"].map((item, i) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-arch-orange/10 to-arch-rust/10 rounded-xl"
                        >
                          <CheckCircle className="w-5 h-5 text-arch-orange" />
                          <span className="font-medium text-arch-charcoal">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {activeTab === "mission" && (
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-arch-rust to-arch-brown rounded-2xl flex items-center justify-center">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black text-arch-charcoal">Our Mission</h3>
                    </div>
                    <p className="text-xl text-gray-700 leading-relaxed mb-8">
                      To provide reliable, cost-effective engineering and construction
                      services that meet international standards while solving
                      Africa's pressing infrastructure needs with innovative
                      solutions and sustainable practices.
                    </p>
                    <div className="space-y-4">
                      {[
                        "International Standards",
                        "Cost-Effective Solutions", 
                        "Innovative Practices",
                        "Sustainable Development"
                      ].map((item, i) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-md border border-gray-100"
                        >
                          <div className="w-2 h-2 bg-arch-orange rounded-full" />
                          <span className="font-medium text-gray-700">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {activeTab === "story" && (
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-arch-blue-gray to-arch-charcoal rounded-2xl flex items-center justify-center">
                        <Rocket className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black text-arch-charcoal">Our Story</h3>
                    </div>
                    <p className="text-xl text-gray-700 leading-relaxed mb-8">
                      Since 2007, JD Marc has grown from a local Nigerian construction
                      company to a Pan-African leader in infrastructure development.
                      With offices in Abuja, London, and New York, we bring global
                      expertise to solve local challenges.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {["2007: Founded", "2015: London Office", "2020: NY Office", "2024: Pan-African Leader"].map((milestone, i) => (
                        <motion.div
                          key={milestone}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="px-4 py-2 bg-gradient-to-r from-arch-light-blue/20 to-arch-blue-gray/20 rounded-full text-sm font-medium text-arch-charcoal border border-arch-light-blue/30"
                        >
                          {milestone}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
              
              <motion.div 
                className="relative order-1 lg:order-2"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative bg-gradient-to-br from-arch-orange/10 via-white to-arch-rust/10 rounded-3xl p-8 shadow-2xl border border-white/50">
                  <img
                    src="/images/about1.jpg"
                    alt="JD Marc projects"
                    className="w-full h-80 object-cover rounded-2xl shadow-xl"
                  />
                  <motion.div 
                    className="absolute -top-6 -right-6 bg-gradient-to-r from-arch-orange to-arch-rust rounded-2xl p-6 shadow-2xl"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1] 
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Zap className="w-10 h-10 text-white" />
                  </motion.div>
                  <motion.div 
                    className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-200"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-arch-orange" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Leadership Team Section */}
      <section className="py-32 bg-gradient-to-b from-arch-light-blue/5 via-white to-gray-50/50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-arch-orange/3 to-arch-rust/3 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-l from-arch-blue-gray/5 to-arch-charcoal/3 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-arch-blue-gray/10 to-arch-charcoal/10 rounded-full text-arch-charcoal font-semibold mb-8"
            >
              <Users className="w-5 h-5" />
              <span>Leadership Team</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-arch-charcoal mb-8 leading-tight">
              Excellence in <span className="text-arch-orange">Leadership</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Meet the visionary leaders driving JD Marc's mission to transform
              African infrastructure and urban development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <motion.div
                  className={cn(
                    "relative h-[600px] w-full rounded-3xl perspective-1000 cursor-pointer",
                    flippedCard === member.id ? "z-20" : "z-10"
                  )}
                  onClick={() => handleCardFlip(member.id)}
                  whileHover={{ scale: 1.02, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="w-full h-full transition-all duration-700 preserve-3d"
                    style={{
                      rotateY: flippedCard === member.id ? 180 : 0,
                    }}
                  >
                    {/* Enhanced Front of Card */}
                    <div className="absolute inset-0 backface-hidden">
                      <div className="h-full bg-gradient-to-br from-white via-gray-50/50 to-white rounded-3xl shadow-2xl overflow-hidden group-hover:shadow-3xl transition-all duration-500 border border-gray-200 group-hover:border-arch-orange/30">
                        {/* Enhanced Image Section */}
                        <div className="relative h-96 overflow-hidden">
                          <motion.img
                            src={
                              member.image ||
                              `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80`
                            }
                            alt={member.name}
                            className="w-full h-full object-cover transition-all duration-700"
                            animate={{
                              scale: hoveredMember === member.id ? 1.1 : 1,
                              filter: hoveredMember === member.id ? "brightness(1.1)" : "brightness(1)"
                            }}
                            transition={{ duration: 0.7 }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.unsplash.com/photo-${
                                member.id === 1
                                  ? "1507003211169-0a1dd7228f2d"
                                  : member.id === 2
                                    ? "1472099645785-5658abf4ff4e"
                                    : "1519085360753-af0119f7c6b6"
                              }?w=400&h=400&fit=crop&crop=face&auto=format&q=80`;
                            }}
                          />
                          
                          {/* Enhanced Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-arch-charcoal/90 via-arch-charcoal/50 to-transparent" />
                          
                          {/* Animated Badge */}
                          <motion.div 
                            className="absolute top-6 right-6"
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5 + index * 0.1, type: "spring", bounce: 0.5 }}
                          >
                            <div className="bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-sm text-arch-orange px-5 py-3 rounded-full text-sm font-bold shadow-xl border border-white/30">
                              Leadership
                            </div>
                          </motion.div>
                          
                          {/* Enhanced Name Overlay */}
                          <motion.div 
                            className="absolute bottom-8 left-6 right-6 text-white"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                          >
                            <h4 className="text-3xl font-black mb-3">{member.name}</h4>
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-6 bg-arch-orange rounded-full" />
                              <p className="text-arch-light-blue font-semibold text-lg">{member.title}</p>
                            </div>
                          </motion.div>

                          {/* Floating Action Indicator */}
                          <motion.div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                              <ArrowRight className="w-8 h-8 text-white" />
                            </div>
                          </motion.div>
                        </div>

                        {/* Enhanced Content Section */}
                        <div className="p-8 bg-gradient-to-br from-white via-gray-50/30 to-white">
                          <div className="text-center">
                            <motion.p 
                              className="text-gray-600 text-sm mb-6 font-medium"
                              animate={{ opacity: [0.7, 1, 0.7] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              Click to read full biography
                            </motion.p>
                            <motion.div 
                              className="flex items-center justify-center gap-3 text-arch-orange"
                              whileHover={{ scale: 1.05 }}
                            >
                              <span className="text-base font-bold tracking-wide">Learn More</span>
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <ArrowRight className="w-5 h-5" />
                              </motion.div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Back of Card */}
                    <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-white via-gray-50/50 to-white rounded-3xl shadow-2xl [transform:rotateY(180deg)] overflow-hidden border border-gray-200">
                      {/* Enhanced Header */}
                      <div className="bg-gradient-to-r from-arch-charcoal via-arch-blue-gray to-arch-charcoal p-8 text-white relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-arch-orange rounded-full blur-2xl" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-arch-rust rounded-full blur-xl" />
                        </div>
                        
                        <div className="flex items-center gap-6 relative z-10">
                          <motion.div 
                            className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-xl"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <img
                              src={
                                member.image ||
                                `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format&q=80`
                              }
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                          <div>
                            <h3 className="text-2xl font-black mb-1">{member.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-4 bg-arch-orange rounded-full" />
                              <p className="text-arch-light-blue font-semibold">{member.title}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Biography */}
                      <div className="p-8 flex-1 h-full flex flex-col relative">
                        <div className="mb-6">
                          <h4 className="text-arch-orange font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-arch-orange rounded-full" />
                            Professional Background
                          </h4>
                          <div className="w-20 h-1 bg-gradient-to-r from-arch-orange to-arch-rust rounded-full mb-4"></div>
                        </div>
                        
                        <p className="text-gray-700 text-base leading-relaxed flex-1 mb-6">
                          {member.bio}
                        </p>

                        <div className="pt-6 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="w-3 h-3 bg-arch-orange rounded-full animate-pulse" />
                              <span className="font-medium">JD Marc Limited Executive Team</span>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 180 }}
                              className="w-8 h-8 bg-gradient-to-r from-arch-orange to-arch-rust rounded-full flex items-center justify-center"
                            >
                              <ArrowRight className="w-4 h-4 text-white" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Core Values */}
      <section className="py-32 bg-gradient-to-br from-white via-arch-light-blue/5 to-gray-50/50 relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-arch-orange/10 to-arch-rust/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-l from-arch-blue-gray/10 to-arch-charcoal/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-arch-light-blue/5 to-transparent rounded-full blur-2xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-arch-orange/10 to-arch-rust/10 rounded-full text-arch-orange font-semibold mb-8"
            >
              <Heart className="w-5 h-5" />
              <span>Core Values</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-arch-charcoal mb-8 leading-tight">
              Our <span className="text-arch-orange">Foundation</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              These principles guide every decision, shape our culture, and define
              how we approach projects and partnerships across Africa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {companyValues.map((value, index) => (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2, type: "spring", bounce: 0.3 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div 
                  className="bg-gradient-to-br from-white via-gray-50/50 to-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 group-hover:border-arch-orange/30 h-full"
                  whileHover={{ scale: 1.02, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="bg-gradient-to-br from-arch-orange/15 to-arch-rust/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div 
                      className="text-arch-orange"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {value.icon && valueIcons[value.icon as keyof typeof valueIcons]}
                    </motion.div>
                  </motion.div>
                  
                  <h3 className="text-2xl md:text-3xl font-black text-arch-charcoal mb-6 group-hover:text-arch-orange transition-colors leading-tight">
                    {value.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {value.description}
                  </p>

                  <motion.div
                    className="flex items-center gap-2 text-arch-orange font-semibold"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm tracking-wide">Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Global Presence */}
      <section className="py-32 bg-gradient-to-b from-gray-50/50 via-white to-arch-light-blue/5 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-arch-orange/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-80 h-80 bg-gradient-to-l from-arch-rust/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-arch-blue-gray/10 to-arch-charcoal/10 rounded-full text-arch-charcoal font-semibold mb-8"
            >
              <Globe className="w-5 h-5" />
              <span>Global Presence</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-arch-charcoal mb-8 leading-tight">
              <span className="text-arch-orange">Global</span> Reach, 
              <br />African <span className="text-arch-rust">Focus</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Strategic offices across three continents bring international
              expertise to African infrastructure challenges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {[
              {
                location: "Nigeria",
                subtitle: "Headquarters",
                address: "Plot 107, Ahmadu Bello Way, Abuja",
                focus: "Operations & Project Management",
                established: "2007",
                icon: "🏢",
                color: "from-arch-orange via-arch-rust to-arch-orange",
                bgColor: "from-arch-orange/10 to-arch-rust/5"
              },
              {
                location: "United Kingdom",
                subtitle: "European Office",
                address: "71-75 Shelton Street, London WC2H 9RQ",
                focus: "International Partnerships & Technology",
                established: "2015",
                icon: "🇬🇧",
                color: "from-arch-blue-gray via-arch-charcoal to-arch-blue-gray",
                bgColor: "from-arch-blue-gray/10 to-arch-charcoal/5"
              },
              {
                location: "United States",
                subtitle: "Americas Office",
                address: "125 Park Avenue, New York, NY 10017",
                focus: "Global Procurement & Investment",
                established: "2020",
                icon: "🇺🇸",
                color: "from-arch-rust via-arch-brown to-arch-rust",
                bgColor: "from-arch-rust/10 to-arch-brown/5"
              },
            ].map((office, index) => (
              <motion.div
                key={office.location}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2, type: "spring", bounce: 0.3 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div 
                  className={cn(
                    "bg-gradient-to-br from-white via-gray-50/30 to-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-5 h-full border border-gray-200 group-hover:border-arch-orange/30",
                    "relative overflow-hidden"
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Background Decoration */}
                  <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20", office.bgColor)} />
                  
                  {/* Header with Enhanced Icon */}
                  <div className={cn(
                    "bg-gradient-to-r text-white rounded-t-3xl p-8 text-center relative overflow-hidden",
                    office.color
                  )}>
                    {/* Header Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full blur-xl" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full blur-lg" />
                    </div>
                    
                    <motion.div 
                      className="text-6xl mb-4 relative z-10"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {office.icon}
                    </motion.div>
                    <h3 className="text-3xl font-black mb-2 relative z-10">{office.location}</h3>
                    <p className="text-white/90 text-base font-medium relative z-10">{office.subtitle}</p>
                  </div>

                  {/* Enhanced Content */}
                  <div className="p-8 space-y-6 relative z-10">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <h4 className="font-black text-arch-charcoal mb-3 flex items-center gap-3 text-lg">
                        <div className="w-3 h-3 bg-arch-orange rounded-full" />
                        Address
                      </h4>
                      <p className="text-gray-600 leading-relaxed pl-6">{office.address}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <h4 className="font-black text-arch-charcoal mb-3 flex items-center gap-3 text-lg">
                        <div className="w-3 h-3 bg-arch-rust rounded-full" />
                        Focus Area
                      </h4>
                      <p className="text-gray-600 leading-relaxed pl-6">{office.focus}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <h4 className="font-black text-arch-charcoal mb-3 flex items-center gap-3 text-lg">
                        <div className="w-3 h-3 bg-arch-blue-gray rounded-full" />
                        Established
                      </h4>
                      <div className="flex items-center gap-3 pl-6">
                        <p className="text-gray-600 leading-relaxed">{office.established}</p>
                        <div className="px-3 py-1 bg-gradient-to-r from-arch-orange/10 to-arch-rust/10 rounded-full text-xs font-bold text-arch-orange">
                          {new Date().getFullYear() - parseInt(office.established)} Years
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Certifications */}
      <section className="py-32 bg-gradient-to-br from-white via-arch-light-blue/3 to-gray-50/30 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/3 w-80 h-80 bg-gradient-to-r from-arch-orange/5 to-arch-rust/3 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/3 w-72 h-72 bg-gradient-to-l from-arch-blue-gray/5 to-arch-charcoal/3 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-arch-orange/10 to-arch-rust/10 rounded-full text-arch-orange font-semibold mb-8"
            >
              <Award className="w-5 h-5" />
              <span>Certifications</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-arch-charcoal mb-8 leading-tight">
              Excellence Through <span className="text-arch-orange">Standards</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Maintaining the highest industry standards through rigorous
              certification and continuous professional development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1, type: "spring", bounce: 0.4 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div 
                  className="bg-gradient-to-br from-white via-gray-50/50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-3 border border-gray-200 group-hover:border-arch-orange/30 text-center h-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-arch-orange/15 to-arch-rust/10 text-arch-orange flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    {cert.icon === "certificate" && <Award size={40} />}
                    {cert.icon === "award" && <Award size={40} />}
                    {cert.icon === "shield" && <Shield size={40} />}
                    {cert.icon === "building" && <Users size={40} />}
                  </motion.div>
                  
                  <h3 className="text-xl font-black text-arch-charcoal mb-4 group-hover:text-arch-orange transition-colors leading-tight">
                    {cert.name}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed text-base">
                    {cert.description}
                  </p>

                  <motion.div
                    className="mt-6 w-12 h-1 bg-gradient-to-r from-arch-orange to-arch-rust rounded-full mx-auto"
                    initial={{ width: 0 }}
                    whileInView={{ width: "3rem" }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

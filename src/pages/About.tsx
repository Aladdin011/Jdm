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

export default function About() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("vision");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const handleCardFlip = (id: number) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  return (
    <Layout>
      {/* Hero Section with Transparency and Modern Design */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y, opacity }}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://cdn.builder.io/o/assets%2F751ea84be0da437c8dd3f1bf04173189%2F6fe8dede446d44e5b3f61dac8e245b53?alt=media&token=2cd3aa20-e283-42dd-ad0a-b327725825be&apiKey=751ea84be0da437c8dd3f1bf04173189"
            alt="JD Marc About Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-arch-charcoal/40 via-arch-charcoal/20 to-white/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-arch-charcoal/60 via-transparent to-transparent" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-20 w-32 h-32 bg-arch-orange/5 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              rotate: [0, -180, -360],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium mb-8"
            >
              <Building2 className="w-5 h-5" />
              <span>Building Africa's Future Since 2007</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              About{" "}
              <span className="bg-gradient-to-r from-arch-orange to-arch-rust bg-clip-text text-transparent">
                JD Marc
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              A Nigerian-grown, Pan-African EPC company focused on delivering total
              construction and smart city solutions that improve lives and support
              economic growth across the African continent.
            </motion.p>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12"
            >
              {[
                { number: "17+", label: "Years Experience", icon: Calendar },
                { number: "200+", label: "Projects Completed", icon: Building2 },
                { number: "3", label: "Continents", icon: Globe },
                { number: "98%", label: "Client Satisfaction", icon: Star },
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center"
                  >
                    <IconComponent className="w-8 h-8 text-arch-orange mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-white/80 text-sm">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Vision & Mission Section with Tabs */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-arch-charcoal/5 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-arch-charcoal mb-6">
              Our Foundation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on strong values and clear vision for Africa's infrastructure future
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-2xl p-2 inline-flex">
              {["vision", "mission", "story"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-8 py-3 rounded-xl font-medium transition-all duration-300 capitalize",
                    activeTab === tab
                      ? "bg-white text-arch-orange shadow-md"
                      : "text-gray-600 hover:text-arch-orange"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {activeTab === "vision" && (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <Target className="w-8 h-8 text-arch-orange" />
                      <h3 className="text-3xl font-bold text-arch-charcoal">Our Vision</h3>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      To become Africa's most trusted construction partner—delivering
                      quality, innovation, and sustainable solutions that shape
                      smarter cities and resilient communities across the continent.
                    </p>
                  </>
                )}
                {activeTab === "mission" && (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <Heart className="w-8 h-8 text-arch-orange" />
                      <h3 className="text-3xl font-bold text-arch-charcoal">Our Mission</h3>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      To provide reliable, cost-effective engineering and construction
                      services that meet international standards while solving
                      Africa's pressing infrastructure needs with innovative
                      solutions and sustainable practices.
                    </p>
                  </>
                )}
                {activeTab === "story" && (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="w-8 h-8 text-arch-orange" />
                      <h3 className="text-3xl font-bold text-arch-charcoal">Our Story</h3>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Since 2007, JD Marc has grown from a local Nigerian construction
                      company to a Pan-African leader in infrastructure development.
                      With offices in Abuja, London, and New York, we bring global
                      expertise to solve local challenges.
                    </p>
                  </>
                )}
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-arch-orange/10 to-arch-rust/10 rounded-3xl p-8">
                  <img
                    src="/images/about1.jpg"
                    alt="JD Marc projects"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                  <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-lg">
                    <Zap className="w-8 h-8 text-arch-orange" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leadership Team with Modern Cards */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-arch-charcoal mb-6">
              Leadership Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the visionary leaders driving JD Marc's mission to transform
              African infrastructure and urban development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div
                  className={cn(
                    "relative h-[500px] w-full rounded-3xl perspective-1000 cursor-pointer",
                    flippedCard === member.id ? "z-10" : ""
                  )}
                  onClick={() => handleCardFlip(member.id)}
                >
                  <motion.div
                    className="w-full h-full transition-all duration-700 preserve-3d"
                    style={{
                      rotateY: flippedCard === member.id ? 180 : 0,
                    }}
                  >
                    {/* Front of Card */}
                    <div className="absolute inset-0 backface-hidden">
                      <div className="h-full bg-white rounded-3xl shadow-xl overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                        {/* Image Section */}
                        <div className="relative h-80 overflow-hidden">
                          <img
                            src={
                              member.image ||
                              `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80`
                            }
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-arch-charcoal/80 via-transparent to-transparent" />
                          
                          {/* Badge */}
                          <div className="absolute top-6 right-6">
                            <div className="bg-white/90 backdrop-blur-sm text-arch-orange px-4 py-2 rounded-full text-sm font-semibold">
                              Leadership
                            </div>
                          </div>
                          
                          {/* Name Overlay */}
                          <div className="absolute bottom-6 left-6 right-6 text-white">
                            <h4 className="text-2xl font-bold mb-2">{member.name}</h4>
                            <p className="text-arch-orange font-medium">{member.title}</p>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-8 bg-gradient-to-br from-white to-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="text-center w-full">
                              <p className="text-gray-600 text-sm mb-4">
                                Click to read full biography
                              </p>
                              <div className="flex items-center justify-center gap-2 text-arch-orange">
                                <span className="text-sm font-medium">Learn More</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl [transform:rotateY(180deg)] overflow-hidden">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-arch-charcoal to-arch-blue-gray p-6 text-white">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white/30">
                            <img
                              src={
                                member.image ||
                                `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format&q=80`
                              }
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{member.name}</h3>
                            <p className="text-arch-orange font-medium">{member.title}</p>
                          </div>
                        </div>
                      </div>

                      {/* Biography */}
                      <div className="p-6 flex-1 h-full flex flex-col">
                        <div className="mb-4">
                          <h4 className="text-arch-orange font-semibold text-sm uppercase tracking-wide mb-2">
                            Professional Background
                          </h4>
                          <div className="w-16 h-1 bg-arch-orange rounded-full mb-4"></div>
                        </div>
                        
                        <p className="text-gray-700 text-sm leading-relaxed flex-1">
                          {member.bio}
                        </p>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-2 h-2 bg-arch-orange rounded-full"></div>
                            <span>JD Marc Limited Executive Team</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values with Modern Design */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-arch-orange rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-arch-rust rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-arch-charcoal mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide every decision, shape our culture, and define
              how we approach projects and partnerships across Africa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {companyValues.map((value, index) => (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-arch-orange/20 h-full">
                  <div className="bg-gradient-to-br from-arch-orange/10 to-arch-rust/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-arch-orange">
                      {value.icon && valueIcons[value.icon as keyof typeof valueIcons]}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-arch-charcoal mb-4 group-hover:text-arch-orange transition-colors">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence with Interactive Map Style */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-arch-charcoal mb-6">
              Global Presence, African Focus
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Strategic offices across three continents bring international
              expertise to African infrastructure challenges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                location: "Nigeria",
                subtitle: "Headquarters",
                address: "Plot 107, Ahmadu Bello Way, Abuja",
                focus: "Operations & Project Management",
                established: "2007",
                icon: "🏢",
                color: "from-arch-orange to-arch-rust",
              },
              {
                location: "United Kingdom",
                subtitle: "European Office",
                address: "71-75 Shelton Street, London WC2H 9RQ",
                focus: "International Partnerships & Technology",
                established: "2015",
                icon: "🇬🇧",
                color: "from-arch-blue-gray to-arch-charcoal",
              },
              {
                location: "United States",
                subtitle: "Americas Office",
                address: "125 Park Avenue, New York, NY 10017",
                focus: "Global Procurement & Investment",
                established: "2020",
                icon: "🇺🇸",
                color: "from-arch-rust to-arch-brown",
              },
            ].map((office, index) => (
              <motion.div
                key={office.location}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 h-full">
                  {/* Header with Icon */}
                  <div className={cn(
                    "bg-gradient-to-r text-white rounded-2xl p-6 mb-6 text-center",
                    office.color
                  )}>
                    <div className="text-4xl mb-3">{office.icon}</div>
                    <h3 className="text-2xl font-bold">{office.location}</h3>
                    <p className="text-white/80 text-sm">{office.subtitle}</p>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-arch-charcoal mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-arch-orange" />
                        Address
                      </h4>
                      <p className="text-gray-600 text-sm">{office.address}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-arch-charcoal mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-arch-orange" />
                        Focus Area
                      </h4>
                      <p className="text-gray-600 text-sm">{office.focus}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-arch-charcoal mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-arch-orange" />
                        Established
                      </h4>
                      <p className="text-gray-600 text-sm">{office.established}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications with Modern Grid */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-arch-charcoal mb-6">
              Excellence Through Standards
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Maintaining the highest industry standards through rigorous
              certification and continuous professional development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1 border border-gray-100 group-hover:border-arch-orange/20 text-center h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-arch-orange/10 to-arch-rust/10 text-arch-orange flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    {cert.icon === "certificate" && <Award size={32} />}
                    {cert.icon === "award" && <Award size={32} />}
                    {cert.icon === "shield" && <Shield size={32} />}
                    {cert.icon === "building" && <Users size={32} />}
                  </div>
                  
                  <h3 className="text-lg font-bold text-arch-charcoal mb-3 group-hover:text-arch-orange transition-colors">
                    {cert.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

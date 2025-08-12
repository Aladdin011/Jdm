import { useState, useRef, useEffect } from "react";
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
  Construction,
  Briefcase,
  Clock,
  Trophy,
  Linkedin,
  Twitter,
  Github,
  Mail,
  Phone,
  MapPin as LocationIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FloatingElement = ({ 
  className, 
  delay = 0, 
  duration = 20 
}: { 
  className: string; 
  delay?: number; 
  duration?: number; 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
    animate={{ 
      opacity: [0.05, 0.15, 0.05], 
      scale: [0.8, 1.2, 0.8], 
      rotate: [0, 180, 360],
      x: [0, 50, -50, 0],
      y: [0, -30, 30, 0] 
    }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
    className={cn("absolute rounded-full", className)}
  />
);

const StatCard = ({ 
  number, 
  label, 
  delay = 0 
}: { 
  number: string; 
  label: string; 
  delay?: number; 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.8, delay, type: "spring", bounce: 0.4 }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="text-center group"
  >
    <motion.div 
      className="text-4xl md:text-5xl font-black text-[#AA7452] mb-2 group-hover:text-[#7C5841] transition-colors"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      {number}
    </motion.div>
    <div className="text-[#D4C9C7] text-sm font-medium tracking-wide uppercase">
      {label}
    </div>
  </motion.div>
);

const PurposeCard = ({ 
  icon, 
  title, 
  content, 
  delay = 0,
  type = "default"
}: { 
  icon: string; 
  title: string; 
  content: any; 
  delay?: number;
  type?: "default" | "values";
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50, rotateX: -10 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: 0.8, delay, type: "spring", bounce: 0.3 }}
    viewport={{ once: true }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group h-full"
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 bg-gradient-to-br from-[#AA7452]/20 to-[#7C5841]/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-[#051822] group-hover:text-[#7C5841] transition-colors">
        {title}
      </h3>
    </div>
    
    {type === "values" ? (
      <ul className="space-y-3">
        {(content as string[]).map((item, i) => (
          <motion.li 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + (i * 0.1) }}
            className="flex items-start gap-3 text-gray-700"
          >
            <CheckCircle className="w-5 h-5 text-[#AA7452] mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-700 leading-relaxed text-lg">
        {content}
      </p>
    )}
  </motion.div>
);

const TeamCard = ({ 
  member, 
  index, 
  isCEO = false 
}: { 
  member: any; 
  index: number; 
  isCEO?: boolean; 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      className={cn(
        "group relative",
        isCEO && "md:col-span-2"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={cn(
          "bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full",
          isCEO ? "md:grid md:grid-cols-2 md:gap-8" : ""
        )}
        whileHover={{ y: -12, scale: 1.02 }}
      >
        {/* Image Section */}
        <div className={cn("relative overflow-hidden", isCEO ? "md:order-1" : "")}>
          <div className={cn("relative", isCEO ? "aspect-[4/5]" : "aspect-square")}>
            <motion.img
              src={
                member.image ||
                `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=face&auto=format&q=80`
              }
              alt={member.name}
              className="w-full h-full object-cover transition-all duration-700"
              animate={{
                scale: isHovered ? 1.1 : 1,
                filter: isHovered ? "brightness(1.1)" : "brightness(1)"
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-${
                  member.id === 1
                    ? "1507003211169-0a1dd7228f2d"
                    : member.id === 2
                      ? "1472099645785-5658abf4ff4e"
                      : "1519085360753-af0119f7c6b6"
                }?w=500&h=500&fit=crop&crop=face&auto=format&q=80`;
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#051822]/90 via-[#051822]/50 to-transparent" />
            
            {/* Badge */}
            {isCEO && (
              <motion.div 
                className="absolute top-6 right-6"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
              >
                <div className="bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl">
                  Founder & CEO
                </div>
              </motion.div>
            )}
            
            {/* Social Links Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#051822]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              <div className="flex gap-3">
                {[
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Mail, href: "#", label: "Email" }
                ].map((social, i) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#AA7452] transition-all duration-300"
                      whileHover={{ scale: 1.1, y: -2 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className={cn("p-8", isCEO ? "md:order-2 md:flex md:flex-col md:justify-center" : "")}>
          <div className="mb-6">
            <h3 className="text-2xl md:text-3xl font-black text-[#051822] mb-2 group-hover:text-[#7C5841] transition-colors">
              {member.name}
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-[#AA7452] rounded-full" />
              <p className="text-[#7C5841] font-semibold text-lg">{member.title}</p>
            </div>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            {member.bio}
          </p>

          {/* Expertise Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["Strategic Leadership", "Project Management", "Innovation"].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="px-3 py-1 bg-gradient-to-r from-[#AA7452]/10 to-[#7C5841]/10 text-[#7C5841] text-sm font-medium rounded-full border border-[#AA7452]/20"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Stats for CEO */}
          {isCEO && (
            <div className="flex gap-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-black text-[#AA7452]">500+</div>
                <div className="text-sm text-gray-600">Projects Led</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[#AA7452]">15</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-[#AA7452]">50+</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const TimelineItem = ({ 
  year, 
  title, 
  description, 
  index, 
  isLast = false 
}: { 
  year: string; 
  title: string; 
  description: string; 
  index: number; 
  isLast?: boolean; 
}) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: index * 0.2 }}
    viewport={{ once: true }}
    className="relative flex items-center group"
  >
    {/* Timeline Line */}
    {!isLast && (
      <div className="absolute top-20 left-1/2 w-0.5 h-24 bg-gradient-to-b from-[#AA7452] to-[#7C5841]" />
    )}
    
    {/* Year Circle */}
    <motion.div
      className="relative z-10 w-20 h-20 bg-gradient-to-br from-[#AA7452] to-[#7C5841] rounded-full flex items-center justify-center shadow-xl"
      whileHover={{ scale: 1.1 }}
    >
      <span className="text-white font-black text-lg">{year.slice(-2)}</span>
    </motion.div>
    
    {/* Content */}
    <motion.div
      className="ml-8 bg-white rounded-2xl p-6 shadow-lg group-hover:shadow-xl transition-all duration-300 flex-1"
      whileHover={{ x: 10 }}
    >
      <h4 className="text-xl font-black text-[#051822] mb-2 group-hover:text-[#7C5841] transition-colors">
        {title}
      </h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  </motion.div>
);

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    // Apply CSS custom properties for the enhanced color system
    const root = document.documentElement;
    root.style.setProperty('--primary-dark', '#051822');
    root.style.setProperty('--secondary-dark', '#2D383E');
    root.style.setProperty('--accent-warm', '#7C5841');
    root.style.setProperty('--accent-light', '#AA7452');
    root.style.setProperty('--neutral-mid', '#969A9E');
    root.style.setProperty('--neutral-light', '#D4C9C7');
    root.style.setProperty('--construction-white', '#FFFFFF');
  }, []);

  const companyMilestones = [
    {
      year: "2009",
      title: "Foundation",
      description: "JD Marc Construction founded with a vision to transform African construction industry through innovation and excellence."
    },
    {
      year: "2015",
      title: "Digital Innovation",
      description: "Launched our first digital platform for remote project management and worker coordination across multiple sites."
    },
    {
      year: "2020",
      title: "Platform Evolution",
      description: "Revolutionary worker-client connection platform transforms the industry, enabling seamless remote collaboration."
    },
    {
      year: "2025",
      title: "Future Vision",
      description: "Leading Africa's construction digital transformation across 50+ cities with sustainable smart infrastructure."
    }
  ];

  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ 
          y, 
          opacity,
          background: "linear-gradient(135deg, #051822 0%, #2D383E 50%, #7C5841 100%)"
        }}
      >
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(212,201,199,0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(170,116,82,0.2) 0%, transparent 50%)
              `
            }}
          />
        </div>

        {/* Premium Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingElement 
            className="top-20 left-20 w-48 h-48 bg-gradient-to-r from-[#D4C9C7]/5 to-[#AA7452]/3 blur-3xl" 
            delay={0}
            duration={25}
          />
          <FloatingElement 
            className="top-40 right-32 w-40 h-40 bg-gradient-to-r from-[#AA7452]/10 to-[#7C5841]/5 blur-2xl" 
            delay={8}
            duration={30}
          />
          <FloatingElement 
            className="bottom-32 left-40 w-44 h-44 bg-gradient-to-r from-white/5 to-[#D4C9C7]/5 blur-3xl" 
            delay={15}
            duration={35}
          />
          <FloatingElement 
            className="bottom-20 right-20 w-52 h-52 bg-gradient-to-r from-[#7C5841]/8 to-[#2D383E]/5 blur-3xl" 
            delay={22}
            duration={28}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                {/* Enhanced Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.4 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#AA7452]/20 to-[#7C5841]/10 backdrop-blur-xl border border-[#AA7452]/30 rounded-full text-[#D4C9C7] font-semibold mb-8 shadow-2xl"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Construction className="w-6 h-6 text-[#AA7452]" />
                  </motion.div>
                  <span className="text-lg">15+ Years Building Excellence</span>
                </motion.div>

                {/* Enhanced Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.3 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-none tracking-tight"
                >
                  <motion.span
                    className="block mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Crafting Africa's
                  </motion.span>
                  <motion.span 
                    className="block bg-gradient-to-r from-[#AA7452] via-[#7C5841] to-[#D4C9C7] bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    Future Infrastructure
                  </motion.span>
                </motion.h1>

                {/* Enhanced Description */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="text-xl md:text-2xl text-[#D4C9C7] mb-12 max-w-4xl leading-relaxed font-light"
                >
                  We are <span className="text-[#AA7452] font-semibold">JD Marc Construction</span> – 
                  a visionary team dedicated to transforming Africa's construction landscape through 
                  <span className="text-[#D4C9C7] font-semibold"> innovative solutions</span>, 
                  remote collaboration, and uncompromising quality standards.
                </motion.p>

                {/* Enhanced Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="grid grid-cols-3 gap-8"
                >
                  <StatCard number="500+" label="Projects Completed" delay={1.1} />
                  <StatCard number="1,200+" label="Skilled Workers" delay={1.2} />
                  <StatCard number="50+" label="Cities Served" delay={1.3} />
                </motion.div>
              </motion.div>
            </div>

            {/* Enhanced Visual */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 100, rotateY: 15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="relative"
              >
                <div className="relative">
                  {/* Main Image */}
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=750&fit=crop&auto=format&q=80"
                      alt="JD Marc construction project"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#051822]/60 to-transparent" />
                  </div>

                  {/* Overlay Image */}
                  <motion.div 
                    className="absolute -bottom-8 -left-8 w-2/3 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-white"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&h=300&fit=crop&auto=format&q=80"
                      alt="Construction team at work"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Experience Badge */}
                  <motion.div 
                    className="absolute -top-6 -right-6 bg-gradient-to-r from-[#AA7452] to-[#7C5841] rounded-2xl p-6 shadow-2xl"
                    animate={{ 
                      rotate: [0, 2, -2, 0],
                      scale: [1, 1.05, 1] 
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🏗️</div>
                      <div className="text-2xl font-black">15+</div>
                      <div className="text-sm">Years Experience</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
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
            className="w-8 h-14 border-2 border-[#D4C9C7]/40 rounded-full flex justify-center backdrop-blur-sm bg-white/10"
          >
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-4 bg-gradient-to-b from-[#AA7452] to-[#7C5841] rounded-full mt-3"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Enhanced Mission & Vision Section */}
      <section 
        className="py-32 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #D4C9C7 100%)"
        }}
      >
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#AA7452]/10 to-[#7C5841]/10 rounded-full text-[#7C5841] font-semibold mb-8"
            >
              <Target className="w-5 h-5" />
              <span>Our Purpose & Vision</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-[#051822] mb-8 leading-tight">
              Building more than structures – <br />
              <span className="text-[#AA7452]">we're building Africa's future</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <PurposeCard
              icon="🎯"
              title="Our Mission"
              content="To revolutionize construction in Africa by connecting skilled professionals with innovative projects through our remote collaboration platform, ensuring quality, efficiency, and sustainable development across the continent."
              delay={0.2}
            />
            
            <PurposeCard
              icon="🌟"
              title="Our Vision"
              content="To become Africa's leading construction ecosystem, where every project contributes to building modern, sustainable cities while empowering local communities and fostering economic growth."
              delay={0.4}
            />
            
            <PurposeCard
              icon="⚡"
              title="Our Values"
              content={[
                "Quality craftsmanship in every project",
                "Innovation through technology",
                "Sustainability and environmental care",
                "Community empowerment and growth"
              ]}
              delay={0.6}
              type="values"
            />
          </div>
        </div>
      </section>

      {/* Premium Team Section */}
      <section className="py-32 bg-gradient-to-b from-[#D4C9C7] via-white to-gray-50/50 relative overflow-hidden">
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#051822]/10 to-[#2D383E]/10 rounded-full text-[#051822] font-semibold mb-8"
            >
              <Users className="w-5 h-5" />
              <span>Meet Our Leaders</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-[#051822] mb-8 leading-tight">
              The <span className="text-[#AA7452]">Visionaries</span> Behind JD Marc
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our leadership team combines decades of construction expertise with 
              innovative technology vision to drive Africa's construction revolution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
            {teamMembers.map((member, index) => (
              <TeamCard
                key={member.id}
                member={member}
                index={index}
                isCEO={index === 0}
              />
            ))}
          </div>

          {/* Team Culture Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#051822] to-[#2D383E] rounded-3xl p-12 relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-[#AA7452]/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-[#7C5841]/10 to-transparent rounded-full blur-2xl" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="text-white">
                <h3 className="text-3xl font-black mb-6">Our Team Culture</h3>
                <p className="text-[#D4C9C7] text-lg leading-relaxed mb-8">
                  We believe in fostering innovation, collaboration, and continuous learning. 
                  Our diverse team brings together local expertise and global best practices 
                  to deliver exceptional results for every project.
                </p>
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-[#AA7452] to-[#7C5841] text-white font-bold rounded-2xl shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join Our Team
                </motion.button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {[
                  { number: "50+", label: "Team Members" },
                  { number: "12", label: "Nationalities" },
                  { number: "95%", label: "Retention Rate" }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="text-center"
                  >
                    <div className="text-3xl font-black text-[#AA7452] mb-2">{stat.number}</div>
                    <div className="text-[#D4C9C7] text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-32 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7C5841]/10 to-[#AA7452]/10 rounded-full text-[#7C5841] font-semibold mb-8"
            >
              <Clock className="w-5 h-5" />
              <span>Our Journey</span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-black text-[#051822] mb-8 leading-tight">
              <span className="text-[#7C5841]">15 years</span> of growth, <br />
              innovation, and <span className="text-[#AA7452]">impact</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {companyMilestones.map((milestone, index) => (
              <TimelineItem
                key={milestone.year}
                year={milestone.year}
                title={milestone.title}
                description={milestone.description}
                index={index}
                isLast={index === companyMilestones.length - 1}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

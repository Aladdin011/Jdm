import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  ArrowRight,
  Users,
  Building2,
  CheckCircle,
  Calendar,
  Zap,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  Award,
  Sparkles,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CallToActionSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const workerBenefits = [
    { icon: <CheckCircle className="w-5 h-5" />, text: "Access to premium projects" },
    { icon: <Clock className="w-5 h-5" />, text: "Flexible remote work options" },
    { icon: <DollarSign className="w-5 h-5" />, text: "Secure payment system" },
  ];

  const clientBenefits = [
    { icon: <Users className="w-5 h-5" />, text: "Vetted construction professionals" },
    { icon: <TrendingUp className="w-5 h-5" />, text: "Real-time project management" },
    { icon: <Award className="w-5 h-5" />, text: "Quality assurance guarantee" },
  ];

  const socialProofStats = [
    { number: "5,000+", label: "Users joined this month" },
    { number: "200+", label: "Projects launched weekly" },
    { number: "₦2B+", label: "Project value managed" },
  ];

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#051822] via-[#2D383E] to-[#7C5841]" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(170,116,82,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(212,201,199,0.1) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#051822]/90 via-[#2D383E]/80 to-[#7C5841]/85" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Main CTA Content */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-[#AA7452] to-[#D4C9C7] bg-clip-text text-transparent">
              Construction Experience?
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join thousands of construction professionals and clients who are 
            building Africa's future through our innovative platform.
          </motion.p>
        </motion.div>

        {/* Dual Path CTA */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          
          {/* Workers Path */}
          <motion.div
            className="group relative"
            onMouseEnter={() => setHoveredPath('workers')}
            onMouseLeave={() => setHoveredPath(null)}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden h-full">
              
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500 rounded-3xl" />
              
              {/* Floating Background Element */}
              <motion.div
                className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-xl"
                animate={hoveredPath === 'workers' ? { scale: 1.5, rotate: 180 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.6 }}
              />

              <div className="relative z-10 space-y-6">
                
                {/* Header */}
                <div className="flex items-start gap-6">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <Users className="w-8 h-8" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">For Construction Workers</h3>
                    <p className="text-white/70">Find quality projects, grow your career, and work remotely</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  {workerBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 text-white/80"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    >
                      <div className="text-blue-400 flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <span>{benefit.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={() => navigate('/register/worker')}
                  className="w-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white py-4 px-8 rounded-xl font-semibold shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Join as Worker</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-transparent rounded-3xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-cyan-400/20 to-transparent rounded-3xl" />
            </div>
          </motion.div>

          {/* Clients Path */}
          <motion.div
            className="group relative"
            onMouseEnter={() => setHoveredPath('clients')}
            onMouseLeave={() => setHoveredPath(null)}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden h-full">
              
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-500 rounded-3xl" />
              
              {/* Floating Background Element */}
              <motion.div
                className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-xl"
                animate={hoveredPath === 'clients' ? { scale: 1.5, rotate: 180 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.6 }}
              />

              <div className="relative z-10 space-y-6">
                
                {/* Header */}
                <div className="flex items-start gap-6">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <Building2 className="w-8 h-8" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">For Clients & Companies</h3>
                    <p className="text-white/70">Connect with skilled professionals and manage projects seamlessly</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  {clientBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 text-white/80"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    >
                      <div className="text-green-400 flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <span>{benefit.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={() => navigate('/register/client')}
                  className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-4 px-8 rounded-xl font-semibold shadow-2xl hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Post Project</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-green-400/20 to-transparent rounded-3xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-emerald-400/20 to-transparent rounded-3xl" />
            </div>
          </motion.div>
        </motion.div>

        {/* Alternative Action */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {/* Glass CTA Container */}
          <div className="relative inline-block p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
            <div className="space-y-6">
              <p className="text-white/80 text-lg">Want to learn more first?</p>
              
              <motion.button
                onClick={() => navigate('/demo')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl font-semibold hover:bg-white/15 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule a Demo</span>
              </motion.button>
            </div>

            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#AA7452]/20 to-[#D4C9C7]/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-xl" />
          </div>
        </motion.div>

        {/* Social Proof Footer */}
        <motion.div
          className="border-t border-white/10 pt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {socialProofStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-[#AA7452] mb-2">
                  {stat.number}
                </div>
                <div className="text-white/70">{stat.label}</div>
                {index < socialProofStats.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-px h-12 bg-white/20 transform -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#AA7452]/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, -150, -30],
              x: [-15, 15, -15],
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default CallToActionSection;

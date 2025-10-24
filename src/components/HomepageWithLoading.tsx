import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  HardHat, 
  Building2, 
  Hammer, 
  Ruler, 
  Sparkles, 
  ChevronDown,
  Menu,
  X
} from "lucide-react";

export default function HomepageWithLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  // Simulate loading process
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 4500); // Increased to 4.5 seconds for better visibility

    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  // Navigation items
  const navItems = [
    { name: "Projects", href: "#projects" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 relative overflow-hidden">
      {/* Enhanced Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 0.95,
              transition: { duration: 1, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 overflow-hidden"
            role="status"
            aria-live="polite"
            aria-label="Loading application"
          >
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-20" aria-hidden="true">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(234,88,12,0.1)_2px,transparent_2px),linear-gradient(90deg,rgba(234,88,12,0.1)_2px,transparent_2px)] bg-[size:50px_50px]"></div>
            </div>

            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-600/30 via-transparent to-transparent" aria-hidden="true"></div>
            
            {/* Animated Particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                  opacity: 0
                }}
                animate={{ 
                  y: [null, Math.random() * window.innerHeight],
                  scale: [0, Math.random() * 0.5 + 0.5, 0],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute w-1 h-1 bg-orange-500 rounded-full"
                aria-hidden="true"
              />
            ))}

            {/* Large Floating Construction Icons */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: 0,
                opacity: 0.15,
                y: [0, -30, 0]
              }}
              transition={{ 
                duration: 2,
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute top-20 left-20"
              aria-hidden="true"
            >
              <Building2 className="h-32 w-32 text-orange-500" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: 180, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                rotate: 0,
                opacity: 0.15,
                y: [0, 30, 0]
              }}
              transition={{ 
                duration: 2,
                delay: 0.3,
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }
              }}
              className="absolute bottom-20 right-20"
              aria-hidden="true"
            >
              <Hammer className="h-28 w-28 text-orange-500" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                opacity: 0.15,
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                delay: 0.6,
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute top-1/3 right-1/4"
              aria-hidden="true"
            >
              <Ruler className="h-24 w-24 text-orange-500" />
            </motion.div>

            {/* Main Loading Content */}
            <div className="relative z-10 text-center px-4">
              {/* Pulsing Outer Ring */}
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0, 0.3]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 -m-32 rounded-full border-4 border-orange-500"
                aria-hidden="true"
              />

              {/* Logo Container with Dramatic Effects */}
              <motion.div
                initial={{ scale: 0, y: 100, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ 
                  duration: 1.5, 
                  type: "spring", 
                  stiffness: 100,
                  delay: 0.2
                }}
                className="mb-12"
              >
                <div className="relative">
                  {/* Rotating Glow Effect */}
                  <motion.div
                    animate={{ 
                      rotate: 360,
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity, 
                      ease: "linear"
                    }}
                    className="absolute -inset-8 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 rounded-full blur-2xl opacity-60"
                    aria-hidden="true"
                  />

                  {/* Pulsing Inner Glow */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity
                    }}
                    className="absolute -inset-6 bg-orange-500 rounded-full blur-xl"
                    aria-hidden="true"
                  />
                  
                  {/* Main Logo */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative w-32 h-32 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/50 backdrop-blur-sm border-2 border-orange-400/30 mx-auto"
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <HardHat className="h-16 w-16 text-white drop-shadow-2xl" aria-hidden="true" />
                    </motion.div>
                  </motion.div>

                  {/* Orbiting Elements */}
                  {[0, 120, 240].map((angle, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        rotate: 360
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.3
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ transform: `rotate(${angle}deg)` }}
                      aria-hidden="true"
                    >
                      <motion.div
                        className="w-4 h-4 bg-orange-400 rounded-full shadow-lg shadow-orange-500/50"
                        style={{ position: 'absolute', top: '-40px' }}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Text Animation with Dramatic Effects */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mb-8"
              >
                <motion.h1 
                  className="text-7xl md:text-8xl font-black mb-4 relative"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(234,88,12,0.5)",
                      "0 0 40px rgba(234,88,12,0.8)",
                      "0 0 20px rgba(234,88,12,0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                    CONSTRUCT
                  </span>
                  <motion.span 
                    className="text-orange-500"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    .
                  </motion.span>
                </motion.h1>
                
                <motion.p 
                  className="text-orange-300/80 text-xl md:text-2xl font-semibold tracking-wider"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  Building Excellence Since 2024
                </motion.p>
              </motion.div>

              {/* Enhanced Progress Bar */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="max-w-md mx-auto mb-8"
              >
                <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden border border-orange-500/30 shadow-inner">
                  {/* Background glow */}
                  <motion.div
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/30 to-transparent"
                    aria-hidden="true"
                  />
                  
                  {/* Progress fill */}
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "easeInOut", delay: 1.5 }}
                    className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 rounded-full relative overflow-hidden shadow-lg shadow-orange-500/50"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={100}
                    aria-label="Loading progress"
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      animate={{
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      aria-hidden="true"
                    />
                  </motion.div>
                </div>
                
                {/* Percentage Text */}
                <motion.p 
                  className="text-orange-400 text-sm font-semibold mt-3 tracking-wider"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  INITIALIZING EXPERIENCE...
                </motion.p>
              </motion.div>

              {/* Enhanced Loading Dots */}
              <motion.div 
                className="flex justify-center items-center space-x-3" 
                aria-hidden="true"
              >
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1.5, 1],
                      opacity: [0, 1, 0],
                      y: [0, -15, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 1.8 + index * 0.2,
                      repeat: Infinity,
                      repeatDelay: 0.5
                    }}
                    className="w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg shadow-orange-500/50"
                  />
                ))}
              </motion.div>

              <span className="sr-only">Loading application, please wait...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative z-40"
          >
            {/* Navigation Bar */}
            <motion.nav
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.8,
                type: "spring",
                stiffness: 100
              }}
              className="fixed top-0 left-0 right-0 z-50"
              role="navigation"
              aria-label="Main navigation"
            >
              <div className="relative">
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-2xl" aria-hidden="true"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <HardHat className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <span className="text-xl font-bold text-white">
                        CONSTRUCT<span className="text-orange-500">.</span>
                      </span>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                      {navItems.map((item, index) => (
                        <motion.a
                          key={item.name}
                          href={item.href}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: 1 + index * 0.1 
                          }}
                          whileHover={{ 
                            y: -2,
                            color: "#f97316"
                          }}
                          className="text-gray-300 hover:text-orange-500 transition-colors duration-300 font-medium"
                        >
                          {item.name}
                        </motion.a>
                      ))}
                      <motion.button
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.4 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
                        onClick={() => navigate("/contact")}
                      >
                        Get Quote
                      </motion.button>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.5 }}
                      className="md:hidden text-white p-2"
                      onClick={() => setIsNavOpen(!isNavOpen)}
                      aria-label={isNavOpen ? "Close menu" : "Open menu"}
                      aria-expanded={isNavOpen}
                      aria-controls="mobile-menu"
                    >
                      {isNavOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
                    </motion.button>
                  </div>

                  {/* Mobile Navigation */}
                  <AnimatePresence>
                    {isNavOpen && (
                      <motion.div
                        id="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden absolute top-full left-0 right-0 bg-white/10 backdrop-blur-2xl border-b border-white/10"
                      >
                        <div className="px-4 py-6 space-y-4">
                          {navItems.map((item, index) => (
                            <motion.a
                              key={item.name}
                              href={item.href}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="block text-gray-300 hover:text-orange-500 transition-colors duration-300 font-medium py-2"
                              onClick={() => setIsNavOpen(false)}
                            >
                              {item.name}
                            </motion.a>
                          ))}
                          <motion.button
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-orange-500/25"
                            onClick={() => { setIsNavOpen(false); navigate("/contact"); }}
                          >
                            Get Quote
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.nav>

            {/* Hero Section */}
            <section id="main-content" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative" role="main">
              {/* Background Elements */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" aria-hidden="true"></div>
              
              <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center">
                  {/* Main Heading */}
                  <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="text-6xl md:text-8xl font-bold mb-6"
                  >
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      BUILDING
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                      TOMORROW
                    </span>
                  </motion.h1>

                  {/* Subheading */}
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto"
                  >
                    Crafting exceptional spaces with precision, innovation, and unwavering commitment to excellence.
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 font-semibold text-lg flex items-center gap-2"
                      onClick={() => navigate("/contact")}
                    >
                      <Sparkles className="h-5 w-5" aria-hidden="true" />
                      Start Your Project
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border border-white/20 bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 font-semibold text-lg"
                      onClick={() => navigate("/projects")}
                    >
                      View Portfolio
                    </motion.button>
                  </motion.div>

                  {/* Scroll Indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-gray-400 flex flex-col items-center gap-2"
                    >
                      <span className="text-sm">Scroll to explore</span>
                      <ChevronDown className="h-5 w-5" aria-hidden="true" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="py-20 px-4 sm:px-6 lg:px-8"
              id="services"
              aria-labelledby="services-heading"
            >
              <div className="max-w-7xl mx-auto">
                <h2 id="services-heading" className="sr-only">Our Services</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: <Building2 className="h-8 w-8" />,
                      title: "Architectural Design",
                      description: "Innovative designs that blend form and function seamlessly."
                    },
                    {
                      icon: <Hammer className="h-8 w-8" />,
                      title: "Quality Construction",
                      description: "Premium materials and craftsmanship for lasting results."
                    },
                    {
                      icon: <Ruler className="h-8 w-8" />,
                      title: "Precision Engineering",
                      description: "Meticulous planning and execution for perfect outcomes."
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.8 + index * 0.2 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="text-orange-500 mb-4" aria-hidden="true">{feature.icon}</div>
                      <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


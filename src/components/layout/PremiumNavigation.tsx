import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Building2,
  Users,
  Briefcase,
  MessageSquare,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { useTheme } from '@/contexts/ThemeContext';

interface NavItem {
  label: string;
  href: string;
  subItems?: { label: string; href: string; description?: string }[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    subItems: [
      { label: 'Residential', href: '/services/residential', description: 'Modern homes and communities' },
      { label: 'Commercial', href: '/services/commercial', description: 'Office buildings and complexes' },
      { label: 'Infrastructure', href: '/services/infrastructure', description: 'Roads, bridges, and utilities' },
      { label: 'Smart Cities', href: '/services/smart-cities', description: 'Technology-integrated urban planning' },
    ]
  },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// Mobile menu component
const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackUserInteraction } = useAppStore();
  const { theme, setTheme, actualTheme } = useTheme();

  const handleNavClick = (href: string, label: string) => {
    trackUserInteraction(`mobile-nav-${label.toLowerCase()}`);
    navigate(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-gray-800">JD Marc</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <button
                      onClick={() => handleNavClick(item.href, item.label)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        location.pathname === item.href
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.subItems && <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {/* Sub Items */}
                    {item.subItems && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.subItems.map((subItem) => (
                          <button
                            key={subItem.label}
                            onClick={() => handleNavClick(subItem.href, subItem.label)}
                            className="w-full p-3 text-left text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            <div className="font-medium">{subItem.label}</div>
                            {subItem.description && (
                              <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span>+234 (0) 9 291 3991</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <span>info@jdmarc.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>Abuja, Nigeria</span>
                  </div>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Theme Preference</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors flex flex-col items-center gap-1 ${
                        theme === 'light'
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors flex flex-col items-center gap-1 ${
                        theme === 'dark'
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors flex flex-col items-center gap-1 ${
                        theme === 'system'
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                      <span>Auto</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Auth Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => handleNavClick('/login', 'Login')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => handleNavClick('/register', 'Register')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </div>

              {/* CTA Button */}
              <div className="mt-6">
                <button
                  onClick={() => handleNavClick('/contact', 'Get Quote')}
                  className="w-full btn-primary-premium justify-center"
                >
                  <span>Get Quote</span>
                  <ArrowRight className="btn-icon" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Desktop dropdown menu
const DropdownMenu = ({ item, isOpen, onToggle }: { 
  item: NavItem; 
  isOpen: boolean; 
  onToggle: () => void; 
}) => {
  const navigate = useNavigate();
  const { trackUserInteraction } = useAppStore();

  const handleSubItemClick = (href: string, label: string) => {
    trackUserInteraction(`dropdown-nav-${label.toLowerCase()}`);
    navigate(href);
    onToggle();
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-4 py-2 text-white/90 hover:text-white transition-colors"
      >
        <span>{item.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && item.subItems && (
          <motion.div
            className="absolute top-full left-0 mt-2 w-72 glass-dark rounded-xl border border-white/10 p-2 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {item.subItems.map((subItem, index) => (
              <motion.button
                key={subItem.label}
                onClick={() => handleSubItemClick(subItem.href, subItem.label)}
                className="w-full p-3 text-left rounded-lg hover:bg-white/10 transition-colors group"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium group-hover:text-orange-300 transition-colors">
                    {subItem.label}
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-orange-300 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
                {subItem.description && (
                  <div className="text-sm text-white/60 mt-1">{subItem.description}</div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function PremiumNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { trackUserInteraction } = useAppStore();
  const { theme, setTheme, actualTheme } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleNavClick = (href: string, label: string) => {
    trackUserInteraction(`nav-${label.toLowerCase()}`);
    navigate(href);
  };

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const handleLogoClick = () => {
    trackUserInteraction('nav-logo');
    navigate('/');
  };

  const handleGetQuote = () => {
    trackUserInteraction('nav-get-quote');
    navigate('/contact');
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'bg-black/20 backdrop-blur-sm'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container-fluid">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.button
              onClick={handleLogoClick}
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="h-10 w-auto flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fb9e926f9dca9498f8a0f99f9f9792da7%2F850832a345244408ac37832fa5cb7097?format=webp&width=800"
                  alt="JD Marc Limited Logo"
                  className="h-8 w-auto object-contain"
                />
              </motion.div>
              <div className="text-white font-bold text-xl group-hover:text-orange-300 transition-colors">
                Limited
              </div>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <div key={item.label} onClick={(e) => e.stopPropagation()}>
                  {item.subItems ? (
                    <DropdownMenu
                      item={item}
                      isOpen={activeDropdown === item.label}
                      onToggle={() => handleDropdownToggle(item.label)}
                    />
                  ) : (
                    <button
                      onClick={() => handleNavClick(item.href, item.label)}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 relative ${
                        location.pathname === item.href
                          ? 'text-white bg-white/10'
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{item.label}</span>
                      {location.pathname === item.href && (
                        <motion.div
                          className="absolute bottom-0 left-1/2 w-1 h-1 bg-orange-400 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          layoutId="activeIndicator"
                        />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {/* Fancy Theme Toggle - Desktop */}
              <div className="hidden lg:flex items-center gap-2">
                <motion.div
                  className="relative w-16 h-8 bg-black/40 border border-white/20 rounded-full p-1 cursor-pointer backdrop-blur-sm"
                  onClick={() => setTheme(actualTheme === 'light' ? 'dark' : 'light')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Track gradient */}
                  <div className={`absolute inset-1 rounded-full transition-all duration-500 ${
                    actualTheme === 'dark'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                  }`} />

                  {/* Sliding toggle */}
                  <motion.div
                    className="relative w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
                    animate={{ x: actualTheme === 'dark' ? 0 : 32 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <motion.div
                      animate={{ rotate: actualTheme === 'dark' ? 0 : 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      {actualTheme === 'dark' ? (
                        <Moon className="w-3 h-3 text-blue-600" />
                      ) : (
                        <Sun className="w-3 h-3 text-orange-500" />
                      )}
                    </motion.div>
                  </motion.div>

                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
                    actualTheme === 'dark'
                      ? 'shadow-lg shadow-blue-500/30'
                      : 'shadow-lg shadow-orange-500/30'
                  }`} />
                </motion.div>
              </div>

              {/* Auth Buttons - Desktop */}
              <div className="hidden lg:flex items-center gap-3">
                <motion.button
                  onClick={() => handleNavClick('/login', 'Login')}
                  className="flex items-center gap-2 px-5 py-2.5 text-white/90 hover:text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogIn className="w-4 h-4" />
                  <span className="font-medium">Login</span>
                </motion.button>
                <motion.button
                  onClick={() => handleNavClick('/register', 'Register')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-white to-gray-100 text-black rounded-full hover:from-gray-100 hover:to-white transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="font-medium">Register</span>
                </motion.button>
              </div>

              {/* Get Quote Button - Desktop */}
              <motion.button
                onClick={handleGetQuote}
                className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Get Quote</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
          </nav>
        </div>

        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500"
          style={{
            width: `${Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%`,
            transformOrigin: "left"
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
        />
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}

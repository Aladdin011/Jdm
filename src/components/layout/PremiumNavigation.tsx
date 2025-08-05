import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ArrowRight,
  Building2,
  Home,
  Settings,
  Users,
  Briefcase,
  Target,
  Zap,
  Shield,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { useTheme } from '@/contexts/ThemeContext';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  subItems?: { 
    label: string; 
    href: string; 
    description?: string;
    icon?: React.ReactNode;
  }[];
}

const navItems: NavItem[] = [
  {
    label: 'Services',
    href: '/services',
    subItems: [
      { 
        label: 'Residential', 
        href: '/services/residential', 
        description: 'Modern homes and communities',
        icon: <Home className="w-5 h-5" />
      },
      { 
        label: 'Commercial', 
        href: '/services/commercial', 
        description: 'Office buildings and complexes',
        icon: <Building2 className="w-5 h-5" />
      },
      { 
        label: 'Infrastructure', 
        href: '/services/infrastructure', 
        description: 'Roads, bridges, and utilities',
        icon: <Settings className="w-5 h-5" />
      },
      { 
        label: 'Smart Cities', 
        href: '/services/smart-cities', 
        description: 'Technology-integrated urban planning',
        icon: <Zap className="w-5 h-5" />
      },
    ]
  },
  {
    label: 'Platform',
    href: '/platform',
    subItems: [
      { 
        label: 'Project Management', 
        href: '/platform/projects', 
        description: 'Advanced project tracking',
        icon: <Target className="w-5 h-5" />
      },
      { 
        label: 'Team Collaboration', 
        href: '/platform/teams', 
        description: 'Real-time team coordination',
        icon: <Users className="w-5 h-5" />
      },
      { 
        label: 'Business Intelligence', 
        href: '/platform/analytics', 
        description: 'Data-driven insights',
        icon: <Briefcase className="w-5 h-5" />
      },
      { 
        label: 'Security & Compliance', 
        href: '/platform/security', 
        description: 'Enterprise-grade protection',
        icon: <Shield className="w-5 h-5" />
      },
    ]
  },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
];

// Premium Dropdown Component
const PremiumDropdown = ({ 
  item, 
  isOpen, 
  onToggle,
  onClose 
}: { 
  item: NavItem; 
  isOpen: boolean; 
  onToggle: () => void;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const { trackUserInteraction } = useAppStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubItemClick = (href: string, label: string) => {
    trackUserInteraction(`dropdown-nav-${label.toLowerCase()}`);
    navigate(href);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="nav-item dropdown flex items-center gap-1 px-3 py-2 text-nav-text hover:text-nav-hover transition-all duration-200 relative group"
      >
        <span className="font-medium">{item.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
        
        {/* Hover underline */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-nav-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
      </button>

      <AnimatePresence>
        {isOpen && item.subItems && (
          <motion.div
            className="dropdown-menu absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-dropdown-bg backdrop-blur-xl border border-border rounded-xl shadow-2xl z-50"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              <div className="space-y-3">
                {item.subItems.map((subItem, index) => (
                  <motion.button
                    key={subItem.label}
                    onClick={() => handleSubItemClick(subItem.href, subItem.label)}
                    className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-all duration-200 group border border-transparent hover:border-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-nav-accent mt-0.5">
                        {subItem.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-nav-hover font-medium group-hover:text-white transition-colors">
                            {subItem.label}
                          </h4>
                          <ArrowRight className="w-4 h-4 text-nav-text/40 group-hover:text-nav-accent opacity-0 group-hover:opacity-100 transition-all duration-200" />
                        </div>
                        {subItem.description && (
                          <p className="text-sm text-nav-text/70 mt-1 group-hover:text-nav-text transition-colors">
                            {subItem.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile Menu Component
const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackUserInteraction } = useAppStore();
  const { theme, setTheme } = useTheme();

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-dropdown-bg backdrop-blur-xl border-l border-border z-50"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://cdn.builder.io/api/v1/image/assets%2Fb9e926f9dca9498f8a0f99f9f9792da7%2F850832a345244408ac37832fa5cb7097?format=webp&width=800"
                    alt="JD Marc Logo"
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-nav-text" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2 mb-8">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <button
                      onClick={() => handleNavClick(item.href, item.label)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200 ${
                        location.pathname === item.href
                          ? 'bg-nav-accent/20 text-nav-hover border border-nav-accent/30'
                          : 'text-nav-text hover:bg-white/5 hover:text-nav-hover'
                      }`}
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.subItems && <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </nav>

              {/* Theme Toggle */}
              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-nav-text text-sm font-medium mb-3">Theme</p>
                <div className="flex gap-2">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'system', icon: Building2, label: 'Auto' }
                  ].map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value as any)}
                      className={`flex-1 p-3 rounded-lg border transition-all duration-200 ${
                        theme === value
                          ? 'border-nav-accent bg-nav-accent/20 text-nav-hover'
                          : 'border-white/10 hover:border-white/20 text-nav-text'
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs font-medium">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auth Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => handleNavClick('/login', 'Login')}
                  className="w-full flex items-center justify-center gap-2 p-4 border border-border rounded-xl text-nav-text hover:bg-white/5 hover:text-nav-hover font-medium transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button 
                  onClick={() => handleNavClick('/register', 'Register')}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-nav-accent text-white rounded-xl hover:bg-nav-accent/90 font-medium transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Get Started</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <>
      <motion.header
        className={`header-premium fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-header-blur backdrop-blur-xl shadow-2xl border-b border-border' 
            : 'bg-header-bg backdrop-blur-xl border-b border-border/50'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <nav className="nav-container max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={handleLogoClick}
            className="logo flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="h-10 w-auto flex items-center justify-center">
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2Fb9e926f9dca9498f8a0f99f9f9792da7%2F850832a345244408ac37832fa5cb7097?format=webp&width=800"
                alt="JD Marc Limited Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="text-nav-hover font-bold text-xl group-hover:text-white transition-colors">
              JD Marc
            </div>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="nav-desktop hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.subItems ? (
                  <PremiumDropdown
                    item={item}
                    isOpen={activeDropdown === item.label}
                    onToggle={() => handleDropdownToggle(item.label)}
                    onClose={() => setActiveDropdown(null)}
                  />
                ) : (
                  <button
                    onClick={() => handleNavClick(item.href, item.label)}
                    className={`nav-item px-3 py-2 rounded-lg transition-all duration-200 relative group ${
                      location.pathname === item.href
                        ? 'text-nav-hover'
                        : 'text-nav-text hover:text-nav-hover'
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-nav-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                    {location.pathname === item.href && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-nav-accent" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA & Theme Toggle */}
          <div className="nav-cta hidden lg:flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.div 
              className="relative w-16 h-8 bg-black/40 border border-white/20 rounded-full p-1 cursor-pointer backdrop-blur-sm"
              onClick={() => setTheme(actualTheme === 'light' ? 'dark' : 'light')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
                animate={{ x: actualTheme === 'dark' ? 0 : 32 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {actualTheme === 'dark' ? (
                  <Moon className="w-3 h-3 text-blue-600" />
                ) : (
                  <Sun className="w-3 h-3 text-orange-500" />
                )}
              </motion.div>
            </motion.div>

            {/* Auth Buttons */}
            <motion.button
              onClick={() => handleNavClick('/login', 'Login')}
              className="btn-secondary px-4 py-2 bg-transparent border border-border rounded-lg text-nav-text hover:text-nav-hover hover:border-white/30 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In
            </motion.button>
            <motion.button
              onClick={() => handleNavClick('/register', 'Register')}
              className="btn-primary px-4 py-2 bg-nav-accent text-white rounded-lg hover:bg-nav-accent/90 hover:shadow-lg hover:shadow-nav-accent/30 transition-all duration-200"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(true)}
            className="mobile-toggle lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="w-5 h-0.5 bg-nav-text transition-all duration-300" />
            <span className="w-5 h-0.5 bg-nav-text transition-all duration-300" />
            <span className="w-5 h-0.5 bg-nav-text transition-all duration-300" />
          </motion.button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}

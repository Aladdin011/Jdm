import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, LogIn, UserPlus, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const authItems = [
  { name: "Login", path: "/login", icon: LogIn },
  { name: "Register", path: "/register", icon: UserPlus },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 dark:bg-primary/95 shadow-md backdrop-blur-sm py-3"
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {/* JD Marc Logo - Updated branding */}
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              <div
                className={cn(
                  "text-2xl font-bold mr-1",
                  scrolled ? "text-[#4A90E2]" : "text-[#4A90E2]",
                )}
              >
                JD
              </div>
              <div
                className={cn(
                  "text-xl font-bold",
                  scrolled ? "text-primary" : "text-white",
                )}
              >
                Marc
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Main Navigation Links */}
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative font-medium transition-colors hover:text-accent flex items-center gap-1",
                location.pathname === item.path
                  ? "text-accent"
                  : scrolled
                    ? "text-primary/90 dark:text-white/90"
                    : "text-white/90 dark:text-white/90",
                "group",
              )}
            >
              {item.icon && <item.icon size={16} />}
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {/* Divider */}
          <div
            className={cn(
              "h-6 w-px",
              scrolled ? "bg-primary/20" : "bg-white/20",
            )}
          />

          {/* Authentication Links */}
          {authItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative font-medium transition-colors hover:text-accent flex items-center gap-1",
                location.pathname === item.path
                  ? "text-accent"
                  : scrolled
                    ? "text-primary/90 dark:text-white/90"
                    : "text-white/90 dark:text-white/90",
                "group",
                item.name === "Dashboard" &&
                  "bg-accent/10 px-3 py-1 rounded-md",
              )}
            >
              <item.icon size={16} />
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <Button
          className={cn(
            "hidden lg:flex text-white rounded transition-all duration-300 transform hover:scale-105 hover:shadow-md",
          )}
          style={{
            backgroundColor: "#A7967E",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#C2CCC5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#A7967E";
          }}
        >
          Request a Quote
        </Button>

        {/* Mobile Menu Button */}
        <button
          className={cn(
            "md:hidden",
            scrolled ? "text-primary dark:text-white" : "text-white",
          )}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-primary border-t border-gray-200 dark:border-gray-700"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {/* Main Navigation - Mobile */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "py-2 px-4 font-medium rounded-md transition-colors flex items-center gap-2",
                    location.pathname === item.path
                      ? "text-accent bg-accent/10"
                      : "text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  {item.icon && <item.icon size={18} />}
                  {item.name}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

              {/* Authentication Links - Mobile */}
              {authItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "py-2 px-4 font-medium rounded-md transition-colors flex items-center gap-2",
                    location.pathname === item.path
                      ? "text-accent bg-accent/10"
                      : "text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
                    item.name === "Dashboard" && "border border-accent/30",
                  )}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}

              <Button
                className="text-white rounded w-full mt-4"
                style={{
                  backgroundColor: "#A7967E",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#C2CCC5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#A7967E";
                }}
              >
                Request a Quote
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

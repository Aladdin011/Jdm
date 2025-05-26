import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
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
        <Link
          to="/"
          className="text-2xl font-bold text-primary dark:text-white flex items-center gap-3"
        >
          {/* JD MARC Logo */}
          <div className="flex items-center gap-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2Fa99cd57b1b98496ca25fa02ed32b5108"
              alt="JD MARC Logo"
              className="h-10 w-auto object-contain"
            />
            <span
              className={cn(
                "font-bold text-xl",
                scrolled
                  ? "text-primary dark:text-white"
                  : "text-white dark:text-white",
              )}
            >
              CONSTRUCTIONS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative font-medium transition-colors hover:text-accent",
                location.pathname === item.path
                  ? "text-accent"
                  : scrolled
                    ? "text-primary/90 dark:text-white/90"
                    : "text-white/90 dark:text-white/90",
                "group",
              )}
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <Button
          className={cn(
            "hidden md:flex text-white rounded transition-all duration-300 transform hover:scale-105 hover:shadow-md",
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
          className="md:hidden text-primary dark:text-white"
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
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "py-2 px-4 font-medium rounded-md transition-colors",
                    location.pathname === item.path
                      ? "text-accent bg-accent/10"
                      : "text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                className="text-white rounded w-full"
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

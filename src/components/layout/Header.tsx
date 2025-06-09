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
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-primary/95 backdrop-blur-md shadow-lg py-3"
            : "bg-gradient-to-r from-primary to-secondary py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            {/* Enhanced Logo */}
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                <div className="text-2xl font-bold mr-1 text-[#4A90E2]">JD</div>
                <div className="text-xl font-bold text-white">Marc</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {location.pathname === "/" ? (
              // Homepage - Use smooth scroll anchors
              <>
                {sectionAnchors.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => smoothScrollTo(id)}
                    className="flex items-center gap-1 relative transition-colors duration-150 font-medium text-white/90 hover:text-white px-2 py-1"
                  >
                    <span>{label}</span>
                  </button>
                ))}
              </>
            ) : (
              // Other pages - Use regular navigation
              <>
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-1 relative transition-colors duration-150 font-medium ${
                      isActive(path)
                        ? "text-accent"
                        : "text-white/90 hover:text-white"
                    } px-2 py-1`}
                  >
                    {Icon && path === "/" && <Icon size={16} />}
                    <span>{label}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${
                        isActive(path) ? "w-full" : "w-0"
                      }`}
                    />
                  </Link>
                ))}
              </>
            )}

            {/* Authentication Links */}
            <div className="flex items-center gap-1 ml-6 pl-6 border-l border-white/20">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <BarChart3 size={16} />
                    <span className="hidden xl:inline">Dashboard</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                    >
                      <Settings size={16} />
                      <span className="hidden xl:inline">Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <UserCheck size={16} />
                    <span className="hidden xl:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10 border border-white/20"
                  >
                    <LogIn size={16} />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg"
                  >
                    <UserPlus size={16} />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-primary/95 backdrop-blur-md border-t border-white/20">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {location.pathname === "/" ? (
                // Homepage - Use smooth scroll anchors
                <>
                  {sectionAnchors.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => smoothScrollTo(id)}
                      className="block w-full text-left text-white/90 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                    >
                      {label}
                    </button>
                  ))}
                </>
              ) : (
                // Other pages - Use regular navigation
                <>
                  {navLinks.map(({ path, label }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block transition-colors py-2 px-3 rounded-lg ${
                        isActive(path)
                          ? "text-accent bg-white/10"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                </>
              )}

              {/* Mobile Authentication Links */}
              <div className="border-t border-white/20 pt-4 mt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-white/90 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                    >
                      <BarChart3 size={16} />
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-white/90 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                      >
                        <Settings size={16} />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-white/90 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10 w-full text-left"
                    >
                      <UserCheck size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-white/90 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10 border border-white/20"
                    >
                      <LogIn size={16} />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white py-2 px-3 rounded-lg transition-colors font-medium"
                    >
                      <UserPlus size={16} />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
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
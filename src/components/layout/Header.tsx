import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  UserCheck,
  Settings,
  LogIn,
  UserPlus,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to section
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/projects", label: "Projects" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
  ];

  // Section anchors for smooth scrolling on homepage
  const sectionAnchors = [
    { id: "hero", label: "Home" },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

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

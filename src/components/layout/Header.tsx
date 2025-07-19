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
  User,
  LogOut,
  ChevronDown,
  UserCircle,
  Mail,
  Phone,
  Building,
  MapPin,
  Shield,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
            ? "bg-background/95 dark:bg-arch-charcoal/95 backdrop-blur-md shadow-lg border-b border-border py-3"
            : "bg-gradient-to-r from-arch-charcoal to-arch-blue-gray dark:from-arch-charcoal dark:to-arch-brown py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            {/* Enhanced Logo */}
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                <div className="text-2xl font-bold mr-1 text-arch-orange">
                  JD
                </div>
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

            {/* Theme Toggle */}
            <div className="mx-4">
              <ThemeToggle />
            </div>

            {/* Authentication Links - Role-based */}
            <div className="flex items-center gap-1 ml-6 pl-6 border-l border-white/20 dark:border-slate-600">
              {isAuthenticated ? (
                <>
                  {/* Dashboard Link - Always show for logged in users */}
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <BarChart3 size={16} />
                    <span className="hidden xl:inline">Dashboard</span>
                  </Link>

                  {/* Admin Panel Link - Only for admin users */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 bg-[#F97316]/20 text-[#F97316] hover:bg-[#F97316]/30 transition-colors px-3 py-2 rounded-lg border border-[#F97316]/30"
                    >
                      <Settings size={16} />
                      <span className="hidden xl:inline">Admin Panel</span>
                    </Link>
                  )}

                  {/* User Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-white/10 text-white text-sm font-medium">
                            {user?.firstName?.[0]}
                            {user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden lg:flex flex-col items-start">
                          <span className="text-sm font-medium">
                            {user?.firstName} {user?.lastName}
                          </span>
                          <span className="text-xs text-white/60 capitalize">
                            {user?.role}
                          </span>
                        </div>
                        <ChevronDown size={16} className="hidden lg:inline" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 p-0">
                      {/* User Info Header */}
                      <div className="p-4 bg-gradient-to-r from-[#142E54] to-[#F97316] text-white">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-white/20 text-white text-lg font-bold">
                              {user?.firstName?.[0]}
                              {user?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-lg">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <div className="flex items-center gap-2">
                              <Shield size={14} />
                              <span className="text-sm capitalize opacity-90">
                                {user?.role} Account
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User Details */}
                      <div className="p-4 border-b">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={14} />
                            <span>{user?.email}</span>
                          </div>
                          {user?.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone size={14} />
                              <span>{user?.phone}</span>
                            </div>
                          )}
                          {user?.company && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Building size={14} />
                              <span>{user?.company}</span>
                            </div>
                          )}
                          {user?.department && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Briefcase size={14} />
                              <span className="capitalize">
                                {user?.department.replace("-", " ")}
                              </span>
                            </div>
                          )}
                          {user?.location && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin size={14} />
                              <span>{user?.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <DropdownMenuItem asChild>
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2 w-full px-2 py-2"
                          >
                            <BarChart3 size={16} />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="flex items-center gap-2 px-2 py-2">
                          <UserCircle size={16} />
                          <span>Profile Settings</span>
                        </DropdownMenuItem>

                        {isAdmin && (
                          <DropdownMenuItem asChild>
                            <Link
                              to="/admin"
                              className="flex items-center gap-2 w-full px-2 py-2"
                            >
                              <Settings size={16} />
                              <span>Admin Panel</span>
                            </Link>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={logout}
                          className="flex items-center gap-2 px-2 py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {/* Login & Register for non-authenticated users */}
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
          <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-white/20 dark:border-slate-600">
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

              {/* Theme Toggle - Mobile */}
              <div className="border-t border-white/20 dark:border-slate-600 pt-4 mt-4">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-white/90 font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>

              {/* Mobile Authentication Links - Role-based */}
              <div className="border-t border-white/20 dark:border-slate-600 pt-4 mt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    {/* User Info - Mobile */}
                    <div className="bg-white/10 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-white/20 text-white font-medium">
                            {user?.firstName?.[0]}
                            {user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-white/60 text-sm capitalize">
                            {user?.role} • {user?.department?.replace("-", " ")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dashboard Link */}
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-white/90 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                    >
                      <BarChart3 size={16} />
                      Dashboard
                    </Link>

                    {/* Profile Settings */}
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-white/90 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10 w-full text-left"
                    >
                      <UserCircle size={16} />
                      Profile Settings
                    </button>

                    {/* Admin Panel Link - Only for admin users */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 bg-[#F97316]/20 text-[#F97316] hover:bg-[#F97316]/30 transition-colors py-2 px-3 rounded-lg border border-[#F97316]/30"
                      >
                        <Settings size={16} />
                        Admin Panel
                      </Link>
                    )}

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-red-300 hover:text-red-200 transition-colors py-2 px-3 rounded-lg hover:bg-red-500/20 w-full text-left border-t border-white/10 mt-2 pt-4"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    {/* Login & Register for non-authenticated users */}
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

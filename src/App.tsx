import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CallProvider } from "@/contexts/CallContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as ToasterUI } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import PageTransition from "@/components/ui/PageTransition";
import DevelopmentModeIndicator from "@/components/ui/DevelopmentModeIndicator";
import BackToTop from "@/components/ui/BackToTop";

// Import all pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

// Protected Route Component
import PrivateRoute from "./components/auth/PrivateRoute";

// Global styles
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="jdmarc-ui-theme">
        <AuthProvider>
          <CallProvider>
            <BrowserRouter>
              <div className="App min-h-screen bg-background text-foreground">
                {/* Development Mode Indicator */}
                <DevelopmentModeIndicator />

                {/* Routes */}
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <PageTransition>
                        <Home />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/home"
                    element={<Navigate to="/" replace />}
                  />
                  <Route
                    path="/about"
                    element={
                      <PageTransition>
                        <About />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/services"
                    element={
                      <PageTransition>
                        <Services />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/projects"
                    element={
                      <PageTransition>
                        <Projects />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <PageTransition>
                        <Contact />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/blog"
                    element={
                      <PageTransition>
                        <Blog />
                      </PageTransition>
                    }
                  />

                  {/* Authentication Routes */}
                  <Route
                    path="/login"
                    element={
                      <PageTransition>
                        <Login />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PageTransition>
                        <Register />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PageTransition>
                        <ForgotPassword />
                      </PageTransition>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <PageTransition>
                          <Dashboard />
                        </PageTransition>
                      </PrivateRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute requiredRole="admin">
                        <PageTransition>
                          <Admin />
                        </PageTransition>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <PrivateRoute requiredRole="admin">
                        <PageTransition>
                          <UserManagement />
                        </PageTransition>
                      </PrivateRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route
                    path="*"
                    element={
                      <PageTransition>
                        <NotFound />
                      </PageTransition>
                    }
                  />
                </Routes>

                {/* Global Components */}
                <BackToTop />
                <Toaster />
                <ToasterUI />
              </div>
            </BrowserRouter>
          </CallProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

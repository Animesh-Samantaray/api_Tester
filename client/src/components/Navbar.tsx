import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, Terminal } from "lucide-react";

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (anchorId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + anchorId);
      return;
    }
    const element = document.getElementById(anchorId.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <nav
      className="glass-nav"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "70px",
        display: "flex",
        alignItems: "center",
        zIndex: 1000,
        transition: "background-color var(--transition-normal)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, hsl(263.4, 70%, 50.4%) 0%, hsl(263.4, 85%, 65%) 100%)",
              color: "white",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(124, 58, 237, 0.3)",
            }}
          >
            <Terminal size={18} />
          </div>
          <span className="text-gradient" style={{ fontWeight: 800 }}>
            APIHUB
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        {!isDashboard && (
          <div
            style={{
              display: "none",
              gap: "24px",
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "hsl(var(--muted-foreground))",
            }}
            className="desktop-links"
          >
            <style>{`
              @media (min-width: 769px) {
                .desktop-links { display: flex !important; }
                .mobile-toggle { display: none !important; }
              }
            `}</style>
            <Link
              to="/"
              style={{ transition: "color var(--transition-fast)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "hsl(var(--foreground))")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "hsl(var(--muted-foreground))")
              }
            >
              Home
            </Link>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#features");
              }}
              style={{ transition: "color var(--transition-fast)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "hsl(var(--foreground))")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "hsl(var(--muted-foreground))")
              }
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#pricing");
              }}
              style={{ transition: "color var(--transition-fast)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "hsl(var(--foreground))")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "hsl(var(--muted-foreground))")
              }
            >
              Pricing
            </a>
            <a
              href="#docs"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#faq"); // Connect docs button to FAQ/Documentation block
              }}
              style={{ transition: "color var(--transition-fast)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "hsl(var(--foreground))")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "hsl(var(--muted-foreground))")
              }
            >
              FAQ
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const footer = document.querySelector("footer");
                if (footer) footer.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ transition: "color var(--transition-fast)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "hsl(var(--foreground))")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "hsl(var(--muted-foreground))")
              }
            >
              Contact
            </a>
          </div>
        )}

        {/* Buttons (Desktop) */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "hsl(var(--foreground))",
              transition: "background-color var(--transition-fast)",
            }}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>

          {/* Auth Controls */}
          <div
            className="desktop-links"
            style={{ display: "none", alignItems: "center", gap: "12px" }}
          >
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "hsl(var(--primary) / 0.1)",
                    color: "hsl(var(--primary))",
                    border: "1px solid hsl(var(--primary) / 0.2)",
                    transition: "all var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "hsl(var(--primary) / 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "hsl(var(--primary) / 0.1)";
                  }}
                >
                  Dashboard
                </Link>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <img
                    src={user?.avatar}
                    alt={user?.fullName}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1.5px solid hsl(var(--primary))",
                    }}
                  />
                  <button
                    onClick={logout}
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "hsl(var(--muted-foreground))",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "hsl(var(--foreground))")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color =
                        "hsl(var(--muted-foreground))")
                    }
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    padding: "8px 16px",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                  style={{
                    padding: "8px 16px",
                    fontSize: "0.9rem",
                    borderRadius: "8px",
                  }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "hsl(var(--foreground))",
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              top: "70px",
              left: 0,
              right: 0,
              background: "hsl(var(--background))",
              borderBottom: "1px solid hsl(var(--border))",
              boxShadow: "var(--shadow-lg)",
              zIndex: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                gap: "16px",
              }}
            >
              {!isDashboard && (
                <>
                  <a
                    href="#home"
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      navigate("/");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    style={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      padding: "8px 0",
                    }}
                  >
                    Home
                  </a>
                  <a
                    href="#features"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick("#features");
                    }}
                    style={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      padding: "8px 0",
                    }}
                  >
                    Features
                  </a>
                  <a
                    href="#pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick("#pricing");
                    }}
                    style={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      padding: "8px 0",
                    }}
                  >
                    Pricing
                  </a>
                  <a
                    href="#faq"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick("#faq");
                    }}
                    style={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      padding: "8px 0",
                    }}
                  >
                    FAQ
                  </a>
                </>
              )}

              <hr
                style={{ border: 0, borderTop: "1px solid hsl(var(--border))" }}
              />

              {isAuthenticated ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.fullName}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                        {user?.fullName}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "hsl(var(--muted-foreground))",
                        }}
                      >
                        @{user?.username}
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      textAlign: "center",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      padding: "10px",
                      borderRadius: "8px",
                      background: "hsl(var(--primary) / 0.1)",
                      color: "hsl(var(--primary))",
                      border: "1px solid hsl(var(--primary) / 0.2)",
                    }}
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      background: "none",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      fontWeight: 500,
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary"
                    style={{
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

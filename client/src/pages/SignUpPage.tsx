import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";
import { Lock, Mail, User, ArrowLeft, Terminal } from "lucide-react";

export const SignUpPage: React.FC = () => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Very Weak",
    color: "#ef4444",
  });

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({
        score: 0,
        label: "None",
        color: "hsl(var(--border))",
      });
      return;
    }
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = "Very Weak";
    let color = "#ef4444"; // Red

    if (score === 2) {
      label = "Weak";
      color = "#f97316"; // Orange
    } else if (score === 3) {
      label = "Fair";
      color = "#eab308"; // Yellow
    } else if (score === 4) {
      label = "Good";
      color = "#3b82f6"; // Blue
    } else if (score === 5) {
      label = "Strong";
      color = "#10b981"; // Green
    }

    setPasswordStrength({ score, label, color });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password || !confirmPassword) {
      showToast("All fields are required", "warning");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", "warning");
      return;
    }

    setIsLoading(true);
    try {
      await signup(fullName, username, email, password);
      showToast("Account Created Successfully! Please login.", "success");
      navigate("/login");
    } catch (err: any) {
      showToast(err.message || "Signup failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    showToast("Redirecting to Google Sign Up...", "info");
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "70px",
        paddingBottom: "50px",
        paddingInline: "24px",
        position: "relative",
        background: "var(--hero-glow)",
        overflow: "hidden",
      }}
    >
      <div className="hero-glow-bg" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "460px",
          borderRadius: "var(--radius-lg)",
          padding: "40px",
          boxShadow: "var(--shadow-xl)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <Link
              to="/"
              aria-label="Go to landing page"
              style={{
                background:
                  "linear-gradient(135deg, hsl(263.4, 70%, 50.4%) 0%, hsl(263.4, 85%, 65%) 100%)",
                color: "white",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(124, 58, 237, 0.3)",
              }}
            >
              <Terminal size={18} />
            </Link>
            <span style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              Create account
            </span>
          </div>

          <p
            style={{
              color: "hsl(var(--muted-foreground))",
              fontSize: "0.875rem",
              marginTop: "6px",
            }}
          >
            Start building and testing requests in seconds
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Full Name */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "4px",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              Full Name
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "hsl(var(--muted-foreground))",
                  display: "flex",
                }}
              >
                <User size={16} />
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="input-field"
                style={{ paddingLeft: "38px" }}
                required
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "4px",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              Username
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "hsl(var(--muted-foreground))",
                  display: "flex",
                }}
              >
                <User size={16} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
                }
                placeholder="johndoe"
                className="input-field"
                style={{ paddingLeft: "38px" }}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "4px",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "hsl(var(--muted-foreground))",
                  display: "flex",
                }}
              >
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                style={{ paddingLeft: "38px" }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "4px",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "hsl(var(--muted-foreground))",
                  display: "flex",
                }}
              >
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: "38px" }}
                required
              />
            </div>

            {/* Password strength meter */}
            {password && (
              <div style={{ marginTop: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    Strength:
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: passwordStrength.color,
                    }}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "4px", height: "4px" }}>
                  {[...Array(5)].map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        flexGrow: 1,
                        height: "100%",
                        borderRadius: "2px",
                        background:
                          idx < passwordStrength.score
                            ? passwordStrength.color
                            : "hsl(var(--border))",
                        transition: "background var(--transition-fast)",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "4px",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "hsl(var(--muted-foreground))",
                  display: "flex",
                }}
              >
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: "38px" }}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "12px",
              marginTop: "8px",
            }}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="btn-secondary"
            style={{
              justifyContent: "center",
              fontSize: "0.85rem",
              padding: "12px",
              width: "100%",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
              style={{ marginRight: "6px" }}
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>{" "}
            Continue with Google
          </button>
        </div>

        {/* Back to Login */}
        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "0.875rem",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ fontWeight: 600, color: "hsl(var(--primary))" }}
          >
            Sign in{" "}
            <ArrowLeft
              size={14}
              style={{ verticalAlign: "middle", marginLeft: "4px" }}
            />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

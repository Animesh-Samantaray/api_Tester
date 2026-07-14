import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect destination
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill out all fields", "warning");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, rememberMe);
      showToast("Login Successful! Welcome back.", "success");
      navigate(from, { replace: true });
    } catch (err: any) {
      showToast(err.message || "Login Failed. Check credentials.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialMock = (platform: string) => {
    showToast(`Continuing with ${platform} (Simulated)...`, "info");
    setIsLoading(true);
    setTimeout(() => {
      // Create admin profile mock
      login("admin@api.com", "admin123", true);
      showToast("Login Successful via Social ID!", "success");
      navigate(from, { replace: true });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        background: "var(--hero-glow)",
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
          maxWidth: "440px",
          borderRadius: "var(--radius-lg)",
          padding: "40px",
          boxShadow: "var(--shadow-xl)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "1.5rem",
              fontWeight: 800,
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                background:
                  "linear-gradient(135deg, hsl(263.4, 70%, 50.4%) 0%, hsl(263.4, 85%, 65%) 100%)",
                color: "white",
                padding: "6px",
                borderRadius: "8px",
                display: "flex",
              }}
            >
              <Lock size={20} />
            </span>
            <span className="text-gradient">APIHUB</span>
          </Link>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Welcome back</h2>
          <p
            style={{
              color: "hsl(var(--muted-foreground))",
              fontSize: "0.875rem",
              marginTop: "6px",
            }}
          >
            Enter your credentials to access your dashboard
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {/* Email */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "6px",
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "hsl(var(--primary))",
                }}
              >
                Forgot password?
              </Link>
            </div>
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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: "38px", paddingRight: "40px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "hsl(var(--muted-foreground))",
                  display: "flex",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                accentColor: "hsl(var(--primary))",
                width: "16px",
                height: "16px",
                cursor: "pointer",
              }}
            />
            <label
              htmlFor="remember"
              style={{
                fontSize: "0.85rem",
                color: "hsl(var(--muted-foreground))",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Remember me for 30 days
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ width: "100%", justifyContent: "center", padding: "12px" }}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        {/* Separator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "24px 0",
            gap: "10px",
          }}
        >
          <hr
            style={{
              flexGrow: 1,
              border: 0,
              borderTop: "1px solid hsl(var(--border))",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              color: "hsl(var(--muted-foreground))",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Or continue with
          </span>
          <hr
            style={{
              flexGrow: 1,
              border: 0,
              borderTop: "1px solid hsl(var(--border))",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={() => handleSocialMock("Google")}
            className="btn-secondary"
            style={{
              justifyContent: "center",
              fontSize: "0.85rem",
              padding: "10px",
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
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialMock("GitHub")}
            className="btn-secondary"
            style={{
              justifyContent: "center",
              fontSize: "0.85rem",
              padding: "10px",
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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z"
              />
            </svg>{" "}
            GitHub
          </button>
        </div>

        {/* Link to SignUp */}
        <div
          style={{
            textAlign: "center",
            marginTop: "28px",
            fontSize: "0.875rem",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{ fontWeight: 600, color: "hsl(var(--primary))" }}
          >
            Sign up now{" "}
            <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
          </Link>
        </div>

        {/* Admin credentials hint */}
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            borderRadius: "6px",
            background: "hsl(var(--primary) / 0.05)",
            border: "1px dashed hsl(var(--primary) / 0.2)",
            fontSize: "0.75rem",
            textAlign: "center",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          Demo credentials:{" "}
          <strong style={{ color: "hsl(var(--foreground))" }}>
            admin@api.com
          </strong>{" "}
          /{" "}
          <strong style={{ color: "hsl(var(--foreground))" }}>admin123</strong>
        </div>
      </motion.div>
    </div>
  );
};

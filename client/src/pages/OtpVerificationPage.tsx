import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Terminal } from "lucide-react";

export const OtpVerificationPage: React.FC = () => {
  const { verifyLoginOTP, verifyEmail, sendVerificationOTP, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Read state passed from Login/Profile page
  const state = location.state as {
    email?: string;
    password?: string;
    type?: "login" | "email-verification";
  } || {};

  // Also support reading from query params in case of Google OAuth redirect
  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get("email") || state.email || "";
  const typeParam = (queryParams.get("type") as "login" | "email-verification") || state.type || "login";

  const email = emailParam;
  const type = typeParam;

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!email) {
      showToast("No email provided. Redirecting to login.", "warning");
      navigate("/login");
    }
  }, [email, navigate, showToast]);

  // Countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (value: string, index: number) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) {
      showToast("Please paste a valid 6-digit number", "warning");
      return;
    }

    const digits = pasteData.split("");
    setOtp(digits);

    // Focus last input
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      showToast("Please enter all 6 digits", "warning");
      return;
    }

    setIsLoading(true);
    try {
      if (type === "login") {
        await verifyLoginOTP(email, otpCode);
        showToast("Login Successful!", "success");
        navigate("/dashboard");
      } else {
        await verifyEmail(email, otpCode);
        showToast("Email Verified Successfully!", "success");
        navigate("/profile");
      }
    } catch (err: any) {
      showToast(err.message || "Invalid or expired OTP", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    try {
      if (type === "login") {
        if (state.password) {
          await login(email, state.password, false);
          showToast("OTP Resent Successfully!", "success");
        } else {
          showToast("Please click Google Login again to get a new code.", "info");
          navigate("/login");
          return;
        }
      } else {
        await sendVerificationOTP(email);
        showToast("Verification OTP Resent Successfully!", "success");
      }
      setCountdown(60);
      setCanResend(false);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      showToast(err.message || "Failed to resend OTP", "error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
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
          maxWidth: "440px",
          borderRadius: "var(--radius-lg)",
          padding: "40px",
          boxShadow: "var(--shadow-xl)",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <Link
              to="/"
              aria-label="Go to landing page"
              style={{
                background: "linear-gradient(135deg, hsl(263.4, 70%, 50.4%) 0%, hsl(263.4, 85%, 65%) 100%)",
                color: "white", width: "36px", height: "36px", borderRadius: "10px", display: "inline-flex",
                alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(124, 58, 237, 0.3)",
              }}
            >
              <Terminal size={18} />
            </Link>
            <span style={{ fontSize: "1.5rem", fontWeight: 800 }}>Verification</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <div style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))", padding: "12px", borderRadius: "50%", display: "flex" }}>
              <Shield size={28} />
            </div>
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Verify your identity</h2>
          <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem", marginTop: "6px", lineHeight: 1.5 }}>
            Enter the 6-digit code sent to <strong style={{ color: "hsl(var(--foreground))" }}>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <label style={{ display: "block", textAlign: "left", fontSize: "0.85rem", fontWeight: 600, marginBottom: "10px", color: "hsl(var(--muted-foreground))" }}>
              Verification Code
            </label>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  onPaste={handleOtpPaste}
                  className="input-field"
                  aria-label={`Verification digit ${index + 1}`}
                  style={{ width: "100%", height: "52px", padding: 0, textAlign: "center", fontSize: "1.25rem", fontWeight: 700 }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.some((d) => d === "")}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "12px" }}
          >
            {isLoading ? "Verifying..." : "Verify code"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "28px", fontSize: "0.875rem", color: "hsl(var(--muted-foreground))" }}>
          <div>
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                style={{ border: "none", background: "none", padding: 0, cursor: "pointer", fontWeight: 600, color: "hsl(var(--primary))" }}
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            ) : (
              <span>
                Resend code in <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>{countdown}s</span>
              </span>
            )}
          </div>

          <Link
            to="/login"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "18px", fontWeight: 600, color: "hsl(var(--primary))" }}
          >
            <ArrowLeft size={16} />
            <span>Back to sign in</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

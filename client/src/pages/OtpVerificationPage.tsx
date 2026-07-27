import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center"
      >
        {/* Banner: OTP Sent */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <CheckCircle2 size={16} />
          <span>OTP Sent</span>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-blue-600/10 p-3 rounded-full text-blue-500">
            <Shield size={36} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          We have sent a 6-digit verification code to
          <br />
          <span className="text-blue-400 font-semibold">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          {/* Email read-only field (prefilled) */}
          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Verifying Email Address
            </label>
            <input
              type="text"
              value={email}
              readOnly
              className="w-full bg-slate-850 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 text-sm focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* OTP inputs */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-left">
              Verification Code
            </label>
            <div className="flex justify-between gap-2">
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
                  className="w-12 h-14 text-center text-xl font-bold text-white bg-slate-800 border border-slate-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isLoading || otp.some((d) => d === "")}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:pointer-events-none"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col items-center gap-4">
          <div className="text-sm">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-blue-500 hover:text-blue-400 font-semibold transition-colors disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            ) : (
              <span className="text-slate-500 font-medium">
                Resend OTP in <span className="text-slate-300 font-semibold">{countdown}s</span>
              </span>
            )}
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-colors mt-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

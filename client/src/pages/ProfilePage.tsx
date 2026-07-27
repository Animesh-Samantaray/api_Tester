import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ShieldAlert, ShieldCheck } from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { user, sendVerificationOTP } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>Loading Profile...</p>
      </div>
    );
  }

  const handleVerifyClick = async () => {
    setIsLoading(true);
    try {
      await sendVerificationOTP(user.email);
      showToast("Verification code sent to your email.", "success");
      navigate("/otp-verification", {
        state: { email: user.email, type: "email-verification" },
      });
    } catch (err: any) {
      showToast(err.message || "Failed to send verification code", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-extrabold text-white mb-8 border-b border-slate-800 pb-4 text-center md:text-left">
          My Profile
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-600/30"
            />
            {user.isVerified ? (
              <div className="absolute bottom-0 right-0 bg-emerald-500 text-slate-950 p-1.5 rounded-full border-4 border-slate-900 shadow-md">
                <ShieldCheck size={18} className="text-white" />
              </div>
            ) : (
              <div className="absolute bottom-0 right-0 bg-amber-500 text-slate-950 p-1.5 rounded-full border-4 border-slate-900 shadow-md">
                <ShieldAlert size={18} className="text-white" />
              </div>
            )}
          </div>

          {/* Core Info */}
          <div className="text-center md:text-left flex-1 space-y-2">
            <h3 className="text-2xl font-bold text-white">{user.fullName}</h3>
            <span className="inline-block bg-blue-600/10 text-blue-400 font-semibold px-3 py-1 rounded-full text-xs">
              {user.role || "Developer"}
            </span>
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 text-slate-400 text-sm mt-3">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-slate-955 border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold text-slate-300">Email Verification</h4>
            <p className="text-xs text-slate-500 mt-1">
              {user.isVerified
                ? "Your email address is secured and verified."
                : "Verify your email to secure your account and enable all features."}
            </p>
          </div>

          <div>
            {user.isVerified ? (
              <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl font-bold text-sm">
                <ShieldCheck size={18} />
                <span>Verified</span>
              </div>
            ) : (
              <button
                onClick={handleVerifyClick}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:pointer-events-none"
              >
                {isLoading ? "Sending Code..." : "Verify Email"}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

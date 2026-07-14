import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound, Check } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const { forgotPasswordSimulate } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email address', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await forgotPasswordSimulate(email);
      setIsSent(true);
      showToast('Password reset link simulated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error executing request', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        background: 'var(--hero-glow)',
      }}
    >
      <div className="hero-glow-bg" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, hsl(263.4, 70%, 50.4%) 0%, hsl(263.4, 85%, 65%) 100%)',
              color: 'white',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.3)',
            }}
          >
            <KeyRound size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Forgot password?</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', marginTop: '6px', lineHeight: 1.5 }}>
            {isSent 
              ? "We've simulated sending a recovery email to your inbox."
              : "No worries! Enter your email and we'll simulate sending you a recovery link."}
          </p>
        </div>

        {isSent ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                background: 'hsl(142.1, 76.2%, 36.3%, 0.1)',
                border: '1px solid hsl(142.1, 76.2%, 36.3%, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'start',
                gap: '12px',
              }}
            >
              <div style={{ background: '#10b981', color: 'white', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                <Check size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#10b981' }}>Reset Link Sent</h4>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginTop: '4px', lineHeight: 1.4 }}>
                  A mock token has been stored in local storage. Click the link below to load the password reset screen with that token.
                </p>
              </div>
            </div>

            <Link
              to="/reset-password?token=simulate-reset-token-xyz"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              Go to Reset Password Screen
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--muted-foreground))' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))', display: 'flex' }}>
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              {isLoading ? 'Processing...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, ShieldAlert } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const { resetPasswordSimulate } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      showToast('All fields are required', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordSimulate(token, password);
      showToast('Password reset successfully! Please login with your new password.', 'success');
      navigate('/login');
    } catch (err: any) {
      showToast(err.message || 'Failed to reset password', 'error');
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
            <Lock size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Reset your password</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', marginTop: '6px' }}>
            Choose a strong new password for your account
          </p>
        </div>

        {!token ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
            <div
              style={{
                background: 'hsl(346.8, 77.2%, 49.8%, 0.1)',
                border: '1px solid hsl(346.8, 77.2%, 49.8%, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                color: 'hsl(var(--destructive))',
                fontSize: '0.85rem',
                lineHeight: 1.5,
              }}
            >
              <ShieldAlert size={28} style={{ margin: '0 auto 10px auto' }} />
              Invalid or missing password reset token. Please request a new recovery link.
            </div>
            <Link to="/forgot-password" className="btn-secondary" style={{ justifyContent: 'center' }}>
              Request New Link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* New Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--muted-foreground))' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))', display: 'flex' }}>
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--muted-foreground))' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))', display: 'flex' }}>
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
              {isLoading ? 'Updating Password...' : 'Reset Password'}
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

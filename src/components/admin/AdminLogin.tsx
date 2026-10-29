import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_EMAIL } from '../../constants/initialData';

interface AdminLoginProps {
  onBackToPortfolio: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToPortfolio }) => {
  const { currentUser, loginWithGoogle, authError, clearAuthError, isAuthorizedAdmin } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Sign-in failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-cyan-600/10 via-blue-600/10 to-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Back button */}
      <div className="w-full max-w-md mb-6">
        <button
          onClick={onBackToPortfolio}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur-xl space-y-6">
        {/* Security Shield Icon */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/40">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Secure administrative dashboard for Riya Singh's portfolio database.
          </p>
        </div>

        {/* Access Warning Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Strict Role-Based Access Control</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Only the designated Google account <strong className="text-white font-mono">{ADMIN_EMAIL}</strong> has permission to access the admin dashboard and write to Firestore.
          </p>
        </div>

        {/* Error notification if unauthorized or login failed */}
        {authError && (
          <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>Access Denied</span>
            </div>
            <p>{authError}</p>
          </div>
        )}

        {/* User state preview if signed in with wrong account */}
        {currentUser && !isAuthorizedAdmin && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/30 text-xs text-amber-200">
            <span>Currently signed in as: </span>
            <strong className="font-mono text-white block truncate">{currentUser.email}</strong>
            <span className="text-[11px] text-amber-300 mt-1 block">
              This account does not match {ADMIN_EMAIL}. Please sign in with Riya's admin account.
            </span>
          </div>
        )}

        {/* Google Sign In Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {/* Google G Logo SVG */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSigningIn ? 'Authenticating...' : 'Sign In with Google'}</span>
          </button>
        </div>

        {/* Security assurance */}
        <div className="pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-400">
          Enforced by Firebase Security Rules & OAuth 2.0
        </div>
      </div>
    </div>
  );
};

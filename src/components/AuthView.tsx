import React, { useState } from 'react';
import { User, ViewState } from '../types';
import { loginUser, registerUser } from '../services/storage';
import { Egg, Lock, Mail, Phone, User as UserIcon, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

interface AuthViewProps {
  initialMode: 'login' | 'register';
  onSuccess: (user: User) => void;
  onNavigate: (view: ViewState) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode, onSuccess, onNavigate }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!phone.trim()) {
        setError('Please enter your active mobile phone number');
        return;
      }
    }

    if (!email.trim()) {
      setError('Please enter your email or mobile number');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        if (mode === 'login') {
          const { user } = loginUser(email, password);
          onSuccess(user);
        } else {
          const { user } = registerUser(name, email, phone, password);
          onSuccess(user);
        }
      } catch (err) {
        setError('Authentication failed. Please verify credentials.');
      } finally {
        setIsLoading(false);
      }
    }, 400);
  };

  const handleDemoSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      const { user } = loginUser('tariq.farm@gmail.com', 'demo1234');
      onSuccess(user);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-6">
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-600 items-center justify-center text-white shadow-sm mb-1">
            <Egg className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-stone-900">
            {mode === 'login' ? 'Welcome Back to Rozgar Farm' : 'Create Farm Investor Account'}
          </h2>
          <p className="text-xs text-stone-500">
            {mode === 'login'
              ? 'Access your daily egg harvests, flocks, and wallet balance'
              : 'Join Pakistan’s leading direct-poultry investment network'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Register Account
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Tariq Mehmood"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-stone-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {mode === 'login' ? 'Email or Mobile Number' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={mode === 'login' ? 'tariq.farm@gmail.com or 03028472911' : 'tariq.farm@gmail.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-stone-900"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number (EasyPaisa / JazzCash)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="03001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-stone-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-stone-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Account' : 'Create & Activate Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Sign-in */}
        <div className="pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>1-Click Demo Investor Account (Preloaded Balance)</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 text-[11px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Token-protected encrypted session storage</span>
        </div>
      </div>
    </div>
  );
};

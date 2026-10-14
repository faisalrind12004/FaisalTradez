import React, { useState } from 'react';
import { ViewState, User } from '../types';
import { Egg, Wallet, User as UserIcon, LogOut, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; view: ViewState }[] = [
    { label: 'Home', view: 'landing' },
    { label: 'Farm Tiers', view: 'landing' },
    { label: 'Deposit Funds', view: 'deposit' },
    { label: 'Dashboard', view: 'dashboard' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly conforming Top Bar Contract: 3 zones separated by gap-8 */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand title, single line text element wordmark */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Egg className="w-5 h-5 text-amber-300" />
            </div>
            <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
              Rozgar Farm Invest
            </span>
          </button>

          {/* Zone 2: Navigation links, single line, no pill enclosures */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigate(link.view);
                }}
                className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
                  currentView === link.view ? 'text-amber-400 font-semibold border-b-2 border-amber-400 pb-0.5' : 'text-stone-300'
                }`}
              >
                {link.label}
              </button>
            ))}
            <span className="text-stone-600 select-none">|</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Deposit Portal</span>
            </div>
          </nav>

          {/* Zone 3: Primary action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs transition-colors"
                >
                  <Wallet className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-amber-300 tabular-nums">₨ {user.balancePKR.toLocaleString()}</span>
                  <span className="text-stone-400 hidden lg:inline">· {user.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => onNavigate('deposit')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
                >
                  Deposit
                </button>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 text-xs font-medium text-stone-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
                >
                  Join Farm
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-xs font-semibold text-amber-300 bg-stone-800 px-2.5 py-1 rounded border border-stone-700 tabular-nums"
              >
                ₨ {user.balancePKR.toLocaleString()}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-900 border-b border-stone-800 px-4 pt-3 pb-5 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-stone-800">
            <button
              onClick={() => {
                onNavigate('landing');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm text-stone-200 hover:bg-stone-800 rounded"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm text-stone-200 hover:bg-stone-800 rounded font-semibold text-amber-300"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                onNavigate('deposit');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm text-emerald-400 hover:bg-stone-800 rounded font-semibold"
            >
              Deposit Funds
            </button>
            <button
              onClick={() => {
                onNavigate('landing');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  const el = document.getElementById('plans-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left px-3 py-2 text-sm text-stone-200 hover:bg-stone-800 rounded"
            >
              Farm Plans
            </button>
          </div>

          {user ? (
            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-stone-400">
                Logged in as <strong className="text-stone-200">{user.name}</strong>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-xs font-medium text-stone-200 bg-stone-800 rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onNavigate('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-xs font-semibold text-stone-900 bg-emerald-400 rounded-lg"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

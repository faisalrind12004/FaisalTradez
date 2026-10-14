/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewState, User, InvestmentTier } from './types';
import { getCurrentUser, logoutUser, initializeDemoDataIfEmpty, buyFlockTier } from './services/storage';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { DepositView } from './components/DepositView';
import { DashboardView } from './components/DashboardView';
import { AuthView } from './components/AuthView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [globalToast, setGlobalToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Initialize simulated session and local persistence
  useEffect(() => {
    initializeDemoDataIfEmpty();
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setGlobalToast({ message, type });
    setTimeout(() => {
      setGlobalToast(null);
    }, 4500);
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setCurrentView('landing');
    showToast('You have been logged out securely.', 'info');
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setCurrentView('dashboard');
    showToast(`Welcome, ${authenticatedUser.name}! Session authenticated.`);
  };

  const handleDepositApproved = (updatedUser: User) => {
    setUser(updatedUser);
    showToast(`Deposit approved! New Balance: ₨ ${updatedUser.balancePKR.toLocaleString()}`);
  };

  const handleSelectTierToActivate = (tier: InvestmentTier) => {
    if (!user) {
      setCurrentView('login');
      return;
    }

    if (user.balancePKR < tier.costPKR) {
      showToast(
        `Insufficient balance for ${tier.name}. Please deposit ₨ ${(tier.costPKR - user.balancePKR).toLocaleString()} via our official admins.`,
        'info'
      );
      setCurrentView('deposit');
      return;
    }

    const res = buyFlockTier(tier);
    if (res.success && res.updatedUser) {
      setUser(res.updatedUser);
      showToast(res.message);
      setCurrentView('dashboard');
    } else {
      showToast(res.message, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Global Notification Toast */}
      {globalToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="font-semibold text-emerald-400">
            {globalToast.type === 'success' ? 'Rozgar Farm Notice' : 'Alert'}
          </p>
          <p className="text-stone-300 mt-0.5">{globalToast.message}</p>
        </div>
      )}

      {/* Strict Top Bar Contract Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView
            onNavigate={handleNavigate}
            user={user}
            onSelectTierToActivate={handleSelectTierToActivate}
          />
        )}

        {currentView === 'deposit' && (
          <DepositView
            user={user}
            onDepositApproved={handleDepositApproved}
            onNavigateToAuth={() => setCurrentView('login')}
            onNavigateToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'dashboard' && (
          user ? (
            <DashboardView
              user={user}
              onUpdateUser={(updated) => setUser(updated)}
              onNavigate={handleNavigate}
            />
          ) : (
            <AuthView
              initialMode="login"
              onSuccess={handleAuthSuccess}
              onNavigate={handleNavigate}
            />
          )
        )}

        {(currentView === 'login' || currentView === 'register') && (
          <AuthView
            initialMode={currentView}
            onSuccess={handleAuthSuccess}
            onNavigate={handleNavigate}
          />
        )}
      </main>
    </div>
  );
}

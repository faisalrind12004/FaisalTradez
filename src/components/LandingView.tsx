import React, { useState } from 'react';
import { ViewState, User, InvestmentTier } from '../types';
import { INVESTMENT_TIERS, ADMIN_CONTACTS, FARM_METRICS, REVIEWS } from '../data/mockData';
import { AdminContactCard } from './AdminContactCard';
import {
  Egg,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Users,
  Feather,
  Sparkles,
  ChevronRight,
  Smartphone,
  PhoneCall,
  Activity,
  HeartHandshake,
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: ViewState) => void;
  user: User | null;
  onSelectTierToActivate: (tier: InvestmentTier) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  user,
  onSelectTierToActivate,
}) => {
  // Calculator state
  const [calcInvestment, setCalcInvestment] = useState<number>(8500);

  // Derive estimated returns from investment
  const calcEstimatedHens = Math.round(calcInvestment / 280);
  const calcDailyReturn = Math.round(calcInvestment * 0.042); // ~4.2% daily return
  const calcMonthlyReturn = calcDailyReturn * 30;
  const calcTotalCycleReturn = calcDailyReturn * 45;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 text-white">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/poultry_farm_hero_1791973502394.jpg"
            alt="Healthy hens grazing on modern poultry farm pasture at golden hour"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-stone-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl space-y-6">
            {/* Value Proposition Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full">
              <Egg className="w-3.5 h-3.5" />
              <span>Direct Farm Poultry Partnership in Pakistan</span>
            </div>

            {/* Unmistakable Headline */}
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Healthy Hens, <br className="hidden sm:inline" />
              <span className="text-amber-400">Happy Farms.</span>
            </h1>

            {/* Value description */}
            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
              Co-fund commercial egg-laying hen flocks with veterinary supervision.
              Collect reliable daily egg yields transferred directly to your EasyPaisa,
              JazzCash, or bank account.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('plans-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-heading font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Explore Farm Plans</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('deposit')}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-semibold text-sm transition-all flex items-center justify-center gap-2 text-center shadow-xs"
              >
                <Smartphone className="w-4 h-4" />
                <span>Deposit via EasyPaisa / JazzCash</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Handlers: M Faisal & Nek Muhammad</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Daily Egg Harvest Withdrawals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistics / Counter Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
            <div className="space-y-1">
              <div className="text-stone-500 text-xs font-medium">Active Farm Partners</div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                {FARM_METRICS.activeFarmers}
              </div>
              <div className="text-[11px] text-stone-400">Growing together across Pakistan</div>
            </div>

            <div className="space-y-1 pt-4 lg:pt-0 lg:pl-8">
              <div className="text-stone-500 text-xs font-medium">Daily Fresh Eggs Yield</div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-emerald-800 tabular-nums">
                {FARM_METRICS.dailyEggsCollected}
              </div>
              <div className="text-[11px] text-stone-400">Grade-A brown & golden eggs</div>
            </div>

            <div className="space-y-1 pt-4 lg:pt-0 lg:pl-8">
              <div className="text-stone-500 text-xs font-medium">Total Yield Paid Out</div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
                {FARM_METRICS.totalPaidOutPKR}
              </div>
              <div className="text-[11px] text-stone-400">Settled via mobile wallets</div>
            </div>

            <div className="space-y-1 pt-4 lg:pt-0 lg:pl-8">
              <div className="text-stone-500 text-xs font-medium">Payout Success Rate</div>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums">
                {FARM_METRICS.onTimeSettlementRate}
              </div>
              <div className="text-[11px] text-stone-400">{FARM_METRICS.operatingDistricts}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Features Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Modern Poultry Agriculture
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-stone-900">
            Why Partner with Rozgar Farm
          </h2>
          <p className="text-sm text-stone-600">
            We operate fully equipped commercial poultry sheds with veterinary checks, optimized feed
            formulation, and immediate market distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Naturally Raised */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col">
            <div className="h-48 overflow-hidden bg-stone-100">
              <img
                src="/src/assets/images/hen_flock_pasture_1791973503076.jpg"
                alt="Flock of healthy laying hens roaming freely in green pasture"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-emerald-700 mb-1">
                  Ethical & Free-Range
                </div>
                <h3 className="font-heading text-lg font-bold text-stone-900">
                  Naturally Raised Flocks
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Healthy hens fed clean organic grains with open ventilation, resulting in superior
                  laying rates and disease resistance.
                </p>
              </div>
              <div className="pt-3 text-xs text-stone-500 font-medium">
                Vaccinated & Vet-Certified
              </div>
            </div>
          </div>

          {/* Card 2: Farm-Fresh Quality */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col">
            <div className="h-48 overflow-hidden bg-stone-100">
              <img
                src="/src/assets/images/farm_fresh_eggs_1791973503254.jpg"
                alt="Organic farm fresh eggs nestled in straw basket"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-amber-700 mb-1">
                  Guaranteed Market Off-take
                </div>
                <h3 className="font-heading text-lg font-bold text-stone-900">
                  Farm-Fresh Egg Distribution
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Eggs harvested daily are transported through pre-contracted bakery, grocery, and
                  institutional chains, securing uninterrupted cash flow.
                </p>
              </div>
              <div className="pt-3 text-xs text-stone-500 font-medium">
                Zero Middlemen Losses
              </div>
            </div>
          </div>

          {/* Card 3: Smarter Farming */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-700 mb-1">
                  Smarter Farming
                </div>
                <h3 className="font-heading text-lg font-bold text-stone-900">
                  Automated Climate & Feed
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  Shed sensors maintain 24.2°C temperature and 56% humidity automatically. Automated
                  nipple lines and feed silos ensure peak laying conditions.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1">
              <div className="flex justify-between">
                <span>Egg Production Efficiency:</span>
                <strong className="text-emerald-700">92.4%</strong>
              </div>
              <div className="flex justify-between">
                <span>Mortality Risk Protection:</span>
                <strong className="text-emerald-700">Covered</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dedicated Official Handlers Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 border border-stone-800 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Official Pakistani Payment Verification
              </div>
              <h2 className="font-heading text-xl sm:text-3xl font-bold text-white mt-1">
                Official Account Deposit Handlers
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Use 1-tap copy, 1-tap WhatsApp verification, or call our certified coordinators directly.
              </p>
            </div>

            <button
              onClick={() => onNavigate('deposit')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Go to Full Deposit Portal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ADMIN_CONTACTS.map((contact) => (
              <AdminContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Investment Tiers / Farm Plans */}
      <section id="plans-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Transparent Poultry Shares
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-stone-900">
            Select Your Poultry Flock Tier
          </h2>
          <p className="text-sm text-stone-600">
            All tiers include feed, housing, veterinary vaccines, and daily egg harvesting credits
            into your balance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INVESTMENT_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`bg-white rounded-3xl border transition-all duration-200 p-6 flex flex-col justify-between space-y-5 relative ${
                tier.featured
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-md'
                  : 'border-stone-200 hover:border-stone-300 shadow-xs'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-bold text-[11px] px-3 py-0.5 rounded-full shadow-xs">
                  Most Popular Flock
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <h3 className="font-heading text-lg font-bold text-stone-900">{tier.name}</h3>
                  <p className="text-xs text-stone-500 mt-1">{tier.tagline}</p>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <div className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
                    ₨ {tier.costPKR.toLocaleString()}
                  </div>
                  <span className="text-xs text-stone-400">Fixed flock allocation</span>
                </div>

                <div className="space-y-2 pt-2 text-xs text-stone-700">
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500">Laying Hens:</span>
                    <strong className="text-stone-900">{tier.henCount} Hens</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500">Daily Return:</span>
                    <strong className="text-emerald-700 tabular-nums">₨ {tier.dailyReturnPKR} / day</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500">Cycle Duration:</span>
                    <strong className="text-stone-900">{tier.cycleDays} Days</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-50">
                    <span className="text-stone-500">Total Harvest Return:</span>
                    <strong className="text-stone-900 tabular-nums font-bold">
                      ₨ {tier.totalReturnPKR.toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-3">
                <button
                  onClick={() => {
                    if (!user) {
                      onNavigate('login');
                    } else {
                      onSelectTierToActivate(tier);
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-heading font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    tier.featured
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  <span>Activate Flock</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigate('deposit')}
                  className="w-full py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-[11px] font-medium transition-colors"
                >
                  Deposit via EasyPaisa / JazzCash
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Interactive Investment & Egg Yield Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive Yield Calculator</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
              Calculate Your Egg Harvest Profits
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Adjust your flock budget to project daily egg yields and total return over the 45-day cycle.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-stone-700">Flock Investment Budget</label>
                <span className="font-heading text-xl font-bold text-stone-900 tabular-nums">
                  ₨ {calcInvestment.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="3500"
                max="100000"
                step="500"
                value={calcInvestment}
                onChange={(e) => setCalcInvestment(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>₨ 3,500</span>
                <span>₨ 50,000</span>
                <span>₨ 100,000</span>
              </div>
            </div>

            {/* Calculations Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
              <div>
                <span className="text-[11px] text-stone-500 block">Flock Size</span>
                <span className="font-heading text-lg font-bold text-stone-900 tabular-nums">
                  ~{calcEstimatedHens} Hens
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-500 block">Daily Yield</span>
                <span className="font-heading text-lg font-bold text-emerald-700 tabular-nums">
                  ₨ {calcDailyReturn.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-500 block">Monthly Return</span>
                <span className="font-heading text-lg font-bold text-stone-900 tabular-nums">
                  ₨ {calcMonthlyReturn.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-stone-500 block">45-Day Total</span>
                <span className="font-heading text-lg font-bold text-stone-900 tabular-nums">
                  ₨ {calcTotalCycleReturn.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onNavigate('deposit')}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Deposit ₨ {calcInvestment.toLocaleString()} via Official Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Real Investor Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Verified Testimonials
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-900">
            Trusted by Farmers Across Pakistan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <p className="text-xs text-stone-600 leading-relaxed italic">
                "{rev.comment}"
              </p>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-heading text-sm font-bold text-stone-900">{rev.name}</h4>
                  <span className="text-[11px] text-stone-400">
                    {rev.location} · {rev.tier}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {rev.verifiedDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Quiet Footer */}
      <footer className="border-t border-stone-200 pt-12 text-xs text-stone-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
              <Egg className="w-4 h-4 text-amber-300" />
            </div>
            <span className="font-heading font-bold text-stone-900 text-sm">
              Rozgar Farm Invest
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => onNavigate('landing')} className="hover:text-stone-900">
              Home
            </button>
            <button onClick={() => onNavigate('deposit')} className="hover:text-stone-900">
              Deposit Funds
            </button>
            <button onClick={() => onNavigate('dashboard')} className="hover:text-stone-900">
              Farmer Dashboard
            </button>
            <a
              href="https://wa.me/923337803988"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-900"
            >
              Support (M Faisal)
            </a>
            <a
              href="https://wa.me/923313177438"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-900"
            >
              Support (Nek Muhammad)
            </a>
          </div>
        </div>

        <div className="border-t border-stone-100 pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px]">
          <p>© 2026 Rozgar Poultry & Farm Invest Pakistan. All rights reserved.</p>
          <p>Official Handlers: M Faisal (03337803988) · Nek Muhammad (03313177438)</p>
        </div>
      </footer>
    </div>
  );
};

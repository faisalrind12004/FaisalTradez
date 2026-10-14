import React, { useState } from 'react';
import { User, UserFlockTier, ViewState, InvestmentTier } from '../types';
import {
  getUserFlocks,
  claimDailyEggs,
  buyFlockTier,
  getDepositRecords,
  getWithdrawalRecords,
} from '../services/storage';
import { INVESTMENT_TIERS } from '../data/mockData';
import { WithdrawModal } from './WithdrawModal';
import {
  Egg,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Thermometer,
  Droplets,
  Radio,
  Plus,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface DashboardViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onNavigate: (view: ViewState) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [flocks, setFlocks] = useState<UserFlockTier[]>(getUserFlocks());
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [harvestNotification, setHarvestNotification] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'flocks' | 'telemetry' | 'transactions'>('flocks');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  const deposits = getDepositRecords();
  const withdrawals = getWithdrawalRecords();

  const today = new Date().toISOString().split('T')[0];
  const hasHarvestedToday = user.lastEggClaimDate === today;

  const handleClaimEggs = () => {
    const result = claimDailyEggs();
    if (result.success && result.updatedUser) {
      onUpdateUser(result.updatedUser);
      setFlocks(getUserFlocks());
      setHarvestNotification(result.message);
      setTimeout(() => {
        setHarvestNotification(null);
      }, 5000);
    } else {
      setHarvestNotification(result.message);
      setTimeout(() => {
        setHarvestNotification(null);
      }, 4000);
    }
  };

  const handleBuyTier = (tier: InvestmentTier) => {
    setBuyError(null);
    const result = buyFlockTier(tier);
    if (result.success && result.updatedUser) {
      onUpdateUser(result.updatedUser);
      setFlocks(getUserFlocks());
      setShowBuyModal(false);
      setHarvestNotification(result.message);
      setTimeout(() => setHarvestNotification(null), 4000);
    } else {
      setBuyError(result.message);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {harvestNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-stone-900 text-white p-4 rounded-2xl shadow-xl border border-emerald-500/40 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-semibold text-emerald-400">Egg Harvest Update</p>
            <p className="text-stone-300 mt-0.5">{harvestNotification}</p>
          </div>
        </div>
      )}

      {/* Top Banner / User Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Investor ID: {user.id}</span>
            <span>·</span>
            <span>Joined: {user.joinedAt}</span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">
            Welcome, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Your live poultry coops are producing daily grade-A farm fresh eggs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('deposit')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Deposit via Admin</span>
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs border border-stone-300 transition-colors flex items-center gap-1.5"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Financial & Yield Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Wallet Balance</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-heading text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
            ₨ {user.balancePKR.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400">Available for withdrawal or new coops</div>
        </div>

        {/* Daily Yield Rate */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Daily Egg Yield</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-heading text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
            ₨ {user.dailyEarnPKR.toLocaleString()}
            <span className="text-xs font-normal text-stone-500 ml-1">/ day</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            From {user.activeTiersCount} active flock coops
          </div>
        </div>

        {/* Total Eggs Harvested */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Eggs Harvested</span>
            <Egg className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-heading text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
            {user.totalEggsHarvested.toLocaleString()}
            <span className="text-xs font-normal text-stone-500 ml-1">eggs</span>
          </div>
          <div className="text-[11px] text-stone-400">
            {user.eggsHarvestedToday > 0 ? `+${user.eggsHarvestedToday} fresh today` : 'Pending daily collection'}
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Total Withdrawn</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="font-heading text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
            ₨ {user.totalWithdrawnPKR.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400">Direct to EasyPaisa / JazzCash</div>
        </div>
      </div>

      {/* Interactive Daily Egg Collection Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-3xl border border-stone-800 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
              <Egg className="w-8 h-8 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Daily Harvest Routine
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white mt-0.5">
                {hasHarvestedToday
                  ? "Today's Egg Harvest Collected!"
                  : "Collect Today's Fresh Egg Yield"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                {hasHarvestedToday
                  ? `You have credited ₨ ${user.dailyEarnPKR.toLocaleString()} today. Next harvest cycle opens tomorrow morning.`
                  : `Your flocks produced an estimated yield of ₨ ${user.dailyEarnPKR.toLocaleString()}. Click to deposit into your balance.`}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {hasHarvestedToday ? (
              <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Harvest Complete for Today</span>
              </div>
            ) : (
              <button
                onClick={handleClaimEggs}
                disabled={user.activeTiersCount === 0}
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-heading font-bold text-sm transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>
                  {user.activeTiersCount === 0
                    ? 'Activate a Flock First'
                    : `Collect ₨ ${user.dailyEarnPKR.toLocaleString()} Yield`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Tabs: My Active Flocks | Farm Telemetry | Transaction Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setSelectedTab('flocks')}
              className={`text-xs sm:text-sm font-semibold pb-2 border-b-2 transition-colors ${
                selectedTab === 'flocks'
                  ? 'border-emerald-600 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Active Hen Flocks ({flocks.length})
            </button>
            <button
              onClick={() => setSelectedTab('telemetry')}
              className={`text-xs sm:text-sm font-semibold pb-2 border-b-2 transition-colors ${
                selectedTab === 'telemetry'
                  ? 'border-emerald-600 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Live Shed Sensors
            </button>
            <button
              onClick={() => setSelectedTab('transactions')}
              className={`text-xs sm:text-sm font-semibold pb-2 border-b-2 transition-colors ${
                selectedTab === 'transactions'
                  ? 'border-emerald-600 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Account Ledger
            </button>
          </div>

          {selectedTab === 'flocks' && (
            <button
              onClick={() => setShowBuyModal(true)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Flock</span>
            </button>
          )}
        </div>

        {/* Tab 1: Active Flocks */}
        {selectedTab === 'flocks' && (
          <div className="space-y-4">
            {flocks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
                <Egg className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-heading text-base font-bold text-stone-900">
                  No Active Poultry Flocks Yet
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  You have not subscribed to any laying hen coops. Activate your first tier using your
                  balance or deposit via official handlers.
                </p>
                <button
                  onClick={() => setShowBuyModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                >
                  Browse Investment Plans
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flocks.map((flock) => {
                  const progressPct = Math.min(
                    100,
                    Math.round((flock.daysActive / flock.totalDays) * 100)
                  );
                  return (
                    <div
                      key={flock.id}
                      className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                            {flock.henCount} Laying Hens
                          </span>
                          <h4 className="font-heading text-base font-bold text-stone-900">
                            {flock.tierName}
                          </h4>
                          <span className="text-xs text-stone-500">Started: {flock.startedAt}</span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {flock.status === 'active' ? 'Laying Active' : 'Completed'}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-stone-600">
                          <span>Harvest Cycle Progress</span>
                          <span className="font-medium tabular-nums">
                            Day {flock.daysActive} of {flock.totalDays} ({progressPct}%)
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Financial info */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-xs">
                        <div>
                          <span className="text-stone-400 block text-[11px]">Flock Cost</span>
                          <span className="font-semibold text-stone-900 tabular-nums">
                            ₨ {flock.investedPKR.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[11px]">Daily Yield</span>
                          <span className="font-semibold text-amber-600 tabular-nums">
                            ₨ {flock.dailyReturnPKR}/day
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[11px]">Total Harvested</span>
                          <span className="font-semibold text-emerald-700 tabular-nums">
                            ₨ {flock.harvestedPKR.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Live Shed Telemetry */}
        {selectedTab === 'telemetry' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-stone-900">
                  Poultry Shed Environmental Telemetry
                </h3>
                <p className="text-xs text-stone-500">
                  Live sensor readouts from Shed #4 (Punjab Central Commercial Hub).
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Sensors Live</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Temperature</span>
                  <Thermometer className="w-4 h-4 text-rose-500" />
                </div>
                <div className="font-heading text-2xl font-bold text-stone-900 tabular-nums">
                  24.2 °C
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">Optimal climate</div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Humidity</span>
                  <Droplets className="w-4 h-4 text-blue-500" />
                </div>
                <div className="font-heading text-2xl font-bold text-stone-900 tabular-nums">
                  56 %
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">Target range 50-65%</div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Feed Reserve</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div className="font-heading text-2xl font-bold text-stone-900 tabular-nums">
                  88 %
                </div>
                <div className="text-[11px] text-stone-500">Soybean & corn mix</div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Laying Health</span>
                  <Egg className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-heading text-2xl font-bold text-emerald-800 tabular-nums">
                  96.8 %
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">Flock activity strong</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Account Ledger */}
        {selectedTab === 'transactions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deposits */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
              <h4 className="font-heading text-sm font-bold text-stone-900 flex items-center justify-between">
                <span>Deposits & Activations</span>
                <span className="text-xs text-stone-400 font-normal">{deposits.length} records</span>
              </h4>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {deposits.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-stone-900 tabular-nums">
                        ₨ {d.amountPKR.toLocaleString()} via {d.method}
                      </div>
                      <div className="text-stone-500 text-[11px]">
                        Admin: {d.adminName} · Trx: {d.trxId}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          d.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {d.status === 'approved' ? 'Credited' : 'Pending'}
                      </span>
                      <div className="text-[10px] text-stone-400 mt-1">{d.submittedAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Withdrawals */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
              <h4 className="font-heading text-sm font-bold text-stone-900 flex items-center justify-between">
                <span>Withdrawal History</span>
                <span className="text-xs text-stone-400 font-normal">{withdrawals.length} records</span>
              </h4>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {withdrawals.length === 0 ? (
                  <p className="text-xs text-stone-400 py-4 text-center">No withdrawals made yet.</p>
                ) : (
                  withdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-stone-900 tabular-nums">
                          -₨ {w.amountPKR.toLocaleString()} to {w.accountTitle}
                        </div>
                        <div className="text-stone-500 text-[11px]">
                          {w.method} · {w.accountNumber}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                          Completed
                        </span>
                        <div className="text-[10px] text-stone-400 mt-1">{w.submittedAt}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Flock Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold text-stone-900">
                  Select a Laying Hen Flock
                </h3>
                <p className="text-xs text-stone-500">
                  Your current balance:{' '}
                  <strong className="text-stone-900 tabular-nums font-semibold">
                    ₨ {user.balancePKR.toLocaleString()}
                  </strong>
                </p>
              </div>
              <button
                onClick={() => setShowBuyModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {buyError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
                <span>{buyError}</span>
                <button
                  onClick={() => {
                    setShowBuyModal(false);
                    onNavigate('deposit');
                  }}
                  className="font-bold underline ml-2"
                >
                  Deposit Now
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INVESTMENT_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-emerald-600 transition-all space-y-3 bg-stone-50/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-stone-900">{tier.name}</h4>
                      <p className="text-xs text-stone-500">{tier.henCount} Laying Hens</p>
                    </div>
                    <span className="font-heading font-bold text-base text-stone-900 tabular-nums">
                      ₨ {tier.costPKR.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Daily Harvest Return:</span>
                      <strong className="text-emerald-700 tabular-nums">
                        ₨ {tier.dailyReturnPKR} / day
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Cycle Duration:</span>
                      <span>{tier.cycleDays} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Payout:</span>
                      <strong className="text-stone-900 tabular-nums">
                        ₨ {tier.totalReturnPKR.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyTier(tier)}
                    className="w-full py-2 rounded-xl bg-stone-900 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                  >
                    Activate Flock
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <WithdrawModal
          user={user}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={(updated) => {
            onUpdateUser(updated);
          }}
        />
      )}
    </div>
  );
};

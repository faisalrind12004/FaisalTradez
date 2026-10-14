import React, { useState } from 'react';
import { User, DepositRecord } from '../types';
import { ADMIN_CONTACTS } from '../data/mockData';
import { AdminContactCard } from './AdminContactCard';
import { submitDepositRecord, approveDeposit, getDepositRecords } from '../services/storage';
import {
  ShieldAlert,
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Zap,
  Info,
  HelpCircle,
} from 'lucide-react';

interface DepositViewProps {
  user: User | null;
  onDepositApproved: (updatedUser: User) => void;
  onNavigateToAuth: () => void;
  onNavigateToDashboard: () => void;
}

export const DepositView: React.FC<DepositViewProps> = ({
  user,
  onDepositApproved,
  onNavigateToAuth,
  onNavigateToDashboard,
}) => {
  const [selectedAdmin, setSelectedAdmin] = useState<string>('M Faisal');
  const [method, setMethod] = useState<'EasyPaisa' | 'JazzCash' | 'Bank Transfer'>('EasyPaisa');
  const [amount, setAmount] = useState<number>(8500);
  const [trxId, setTrxId] = useState<string>('');
  const [senderAccount, setSenderAccount] = useState<string>(user?.phone || '');
  const [deposits, setDeposits] = useState<DepositRecord[]>(getDepositRecords());
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const quickAmounts = [3500, 8500, 20000, 50000];

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      onNavigateToAuth();
      return;
    }

    if (!trxId.trim()) {
      setErrorMessage('Please enter the Transaction ID (TID) from your payment receipt');
      return;
    }

    if (!senderAccount.trim()) {
      setErrorMessage('Please enter the sender phone or account number used for payment');
      return;
    }

    if (amount < 1000) {
      setErrorMessage('Minimum activation deposit amount is ₨ 1,000');
      return;
    }

    const newRecord = submitDepositRecord({
      adminName: selectedAdmin,
      method,
      amountPKR: amount,
      trxId: trxId.trim().toUpperCase(),
      senderAccount: senderAccount.trim(),
    });

    setDeposits(getDepositRecords());
    setFormSubmitted(true);
    setTrxId('');

    // Pre-fill WhatsApp link automatically so user can immediately send their receipt
    const adminObj = ADMIN_CONTACTS.find((a) => a.name === selectedAdmin) || ADMIN_CONTACTS[0];
    const waText = encodeURIComponent(
      `Hello ${adminObj.name}, I have transferred ₨ ${amount.toLocaleString()} via ${method} for my Rozgar farm account.\nSender: ${senderAccount}\nTrx ID: ${newRecord.trxId}\nPlease verify and credit my account.`
    );
    const customWaUrl = `https://wa.me/92${adminObj.phone.slice(1)}?text=${waText}`;

    setTimeout(() => {
      window.open(customWaUrl, '_blank', 'noopener,noreferrer');
    }, 800);
  };

  const handleInstantApprove = (depositId: string) => {
    const res = approveDeposit(depositId);
    if (res.success && res.updatedUser) {
      setDeposits(getDepositRecords());
      onDepositApproved(res.updatedUser);
    }
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
          <span>Local Pakistani Mobile Banking & Instant Verification</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Deposit Funds & Activate Farm Tier
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Transfer your deposit directly to one of our two official farm operational accounts via
          EasyPaisa, JazzCash, or Bank Transfer, then confirm your receipt with 1-tap WhatsApp verification.
        </p>
      </div>

      {/* Official Security Advisory Banner */}
      <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 space-y-1">
          <p className="font-semibold">
            Official Security Notice: Only Pay These Verified Account Handlers
          </p>
          <p className="text-amber-800 leading-relaxed">
            Never send money to unverified personal numbers, Telegram reps, or social media pages.
            Only transfer funds to <strong>M Faisal (03337803988)</strong> or{' '}
            <strong>Nek Muhammad (03313177438)</strong>. Use the direct verification buttons below.
          </p>
        </div>
      </div>

      {/* Official Handlers Grid: Admin 1 & Admin 2 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-stone-900">
            Official Payment Handlers
          </h2>
          <span className="text-xs text-stone-500">2 Verified Agents Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ADMIN_CONTACTS.map((contact) => (
            <AdminContactCard
              key={contact.id}
              contact={contact}
              isSelected={selectedAdmin === contact.name}
              onSelectAdmin={(name) => setSelectedAdmin(name)}
            />
          ))}
        </div>
      </div>

      {/* Step-by-Step Payment Instructions */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <h3 className="font-heading text-base sm:text-lg font-bold text-stone-900 mb-6 flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-700" />
          <span>How to Deposit in 3 Simple Steps</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-semibold text-stone-900 text-sm">Copy Number & Send</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Tap the <strong>Copy No.</strong> button for M Faisal or Nek Muhammad. Open your
              EasyPaisa, JazzCash, or banking app and transfer your desired flock investment.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-semibold text-stone-900 text-sm">1-Tap WhatsApp Receipt</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Tap the green <strong>WhatsApp Verification</strong> button. It opens a pre-addressed
              chat with the selected admin so you can send your transaction screenshot.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-semibold text-stone-900 text-sm">Automatic Balance Credit</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Submit your Transaction ID (TID) in the form below. Once confirmed by our ops team (usually 5–15 mins), your wallet is credited instantly!
            </p>
          </div>
        </div>
      </div>

      {/* Deposit Proof Submission Form & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="border-b border-stone-100 pb-4 mb-6">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-stone-900">
              Submit Payment Receipt (TID)
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Enter the transaction details after completing your transfer to speed up wallet credit.
            </p>
          </div>

          {formSubmitted && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-emerald-900">
                <p className="font-semibold">Deposit Submitted Successfully!</p>
                <p className="text-emerald-800 mt-0.5">
                  Your verification request has been queued. Our admin will match your TID. A WhatsApp verification chat was prepared.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmitProof} className="space-y-5">
            {/* Admin Handler Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Paid to Official Handler
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ADMIN_CONTACTS.map((admin) => (
                  <button
                    key={admin.id}
                    type="button"
                    onClick={() => setSelectedAdmin(admin.name)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedAdmin === admin.name
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-500'
                        : 'border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span>{admin.name}</span>
                    <span className="font-mono text-stone-500 text-[11px]">{admin.phone.slice(-4)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Payment Channel Used
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['EasyPaisa', 'JazzCash', 'Bank Transfer'] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setMethod(ch)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      method === ch
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount (PKR) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-700">Amount Sent (PKR)</label>
                <span className="text-xs text-stone-500">Min: ₨ 1,000</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-stone-500 text-sm">
                  ₨
                </span>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 font-bold tabular-nums text-base"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors tabular-nums ${
                      amount === q
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    ₨ {q.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Sender Phone Number / Account */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Sender Mobile / Account Number
              </label>
              <input
                type="text"
                placeholder="e.g. 03001234567"
                value={senderAccount}
                onChange={(e) => setSenderAccount(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 text-sm"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                The EasyPaisa, JazzCash, or bank account you sent funds from.
              </span>
            </div>

            {/* Transaction ID (TID) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Transaction ID (TID)
              </label>
              <input
                type="text"
                placeholder="e.g. EP98412803 or 11-digit JazzCash Trx ID"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-stone-900 text-sm uppercase tracking-wide"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Found in the confirmation SMS received from 3737 (EasyPaisa) or 8558 (JazzCash).
              </span>
            </div>

            {/* Submit Proof Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 active:bg-black text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Submit Proof & Open WhatsApp Chat</span>
            </button>
          </form>
        </div>

        {/* Recent Deposit Records Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading text-sm font-bold text-stone-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-500" />
                <span>My Deposit History</span>
              </h4>
              <span className="text-xs text-stone-500 tabular-nums">
                {deposits.length} Records
              </span>
            </div>

            {deposits.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center">
                No deposit requests submitted yet.
              </p>
            ) : (
              <div className="space-y-3">
                {deposits.map((dep) => (
                  <div
                    key={dep.id}
                    className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-stone-900 text-sm tabular-nums">
                        ₨ {dep.amountPKR.toLocaleString()}
                      </div>
                      {dep.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Admin
                        </span>
                      )}
                    </div>

                    <div className="text-stone-600 space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Admin:</span>
                        <span className="font-medium text-stone-800">{dep.adminName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Method:</span>
                        <span className="font-medium text-stone-800">{dep.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Trx ID:</span>
                        <span className="font-mono font-medium text-stone-800">{dep.trxId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Submitted:</span>
                        <span className="text-stone-500">{dep.submittedAt}</span>
                      </div>
                    </div>

                    {/* Instant Demo Verification Helper */}
                    {dep.status === 'pending' && (
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400">Testing platform?</span>
                        <button
                          type="button"
                          onClick={() => handleInstantApprove(dep.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Simulate Instant Approval</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick link to Dashboard */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-900">Ready to invest in a flock?</p>
              <p className="text-[11px] text-emerald-700">Check active tiers on your farm dashboard.</p>
            </div>
            <button
              onClick={onNavigateToDashboard}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

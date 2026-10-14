import React, { useState } from 'react';
import { User } from '../types';
import { requestWithdrawal } from '../services/storage';
import { X, ArrowDownRight, Smartphone, Building2, CheckCircle2 } from 'lucide-react';

interface WithdrawModalProps {
  user: User;
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ user, onClose, onSuccess }) => {
  const [method, setMethod] = useState<'EasyPaisa' | 'JazzCash' | 'Bank Transfer'>('EasyPaisa');
  const [accountTitle, setAccountTitle] = useState(user.name);
  const [accountNumber, setAccountNumber] = useState(user.phone);
  const [bankName, setBankName] = useState('Meezan Bank');
  const [amount, setAmount] = useState<number>(user.balancePKR > 1000 ? 1000 : user.balancePKR);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = requestWithdrawal({
      method,
      accountTitle,
      accountNumber,
      bankName: method === 'Bank Transfer' ? bankName : undefined,
      amountPKR: amount,
    });

    if (!res.success) {
      setError(res.message);
    } else {
      setSuccessMsg(res.message);
      if (res.updatedUser) {
        onSuccess(res.updatedUser);
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
            <span>Instant Mobile Wallet Withdrawal</span>
          </div>
          <h3 className="font-heading text-xl font-bold text-stone-900">
            Withdraw Farm Profits
          </h3>
          <p className="text-xs text-stone-500">
            Available Balance:{' '}
            <strong className="text-stone-900 font-semibold tabular-nums">
              ₨ {user.balancePKR.toLocaleString()}
            </strong>
          </p>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Payout Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['EasyPaisa', 'JazzCash', 'Bank Transfer'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                    method === m
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Account Holder Title
            </label>
            <input
              type="text"
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {method === 'Bank Transfer' ? 'IBAN / Account Number' : 'Mobile Account Number'}
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-stone-900 font-mono"
            />
          </div>

          {method === 'Bank Transfer' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-stone-900"
              />
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-stone-700">Withdrawal Amount (PKR)</label>
              <button
                type="button"
                onClick={() => setAmount(user.balancePKR)}
                className="text-[11px] font-semibold text-emerald-700 hover:underline"
              >
                Max (₨ {user.balancePKR.toLocaleString()})
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-stone-400 text-xs">
                ₨
              </span>
              <input
                type="number"
                min="500"
                max={user.balancePKR}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 font-bold tabular-nums text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={user.balancePKR < 500}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Confirm & Withdraw ₨ {amount.toLocaleString()}
          </button>
        </form>
      </div>
    </div>
  );
};

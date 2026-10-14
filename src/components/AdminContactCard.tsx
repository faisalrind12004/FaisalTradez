import React, { useState } from 'react';
import { AdminContact } from '../types';
import { Copy, Check, MessageSquare, PhoneCall, ShieldCheck, Building2, Smartphone, CreditCard } from 'lucide-react';

interface AdminContactCardProps {
  contact: AdminContact;
  onSelectAdmin?: (adminName: string) => void;
  isSelected?: boolean;
}

export const AdminContactCard: React.FC<AdminContactCardProps> = ({
  contact,
  onSelectAdmin,
  isSelected = false,
}) => {
  /**
   * Clipboard Copy State Management:
   * `copiedField` tracks which identifier was just copied (either the phone number or bank IBAN).
   * When the user clicks the 1-Tap Copy button, we invoke `navigator.clipboard.writeText()`
   * and set `copiedField` to that identifier. A 2000ms setTimeout resets it back to null,
   * providing smooth, accessible "Copied!" tooltip and visual badge feedback.
   */
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showBankDetails, setShowBankDetails] = useState<boolean>(false);

  const handleCopy = async (textToCopy: string, fieldIdentifier: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for non-https or older webview environments
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      // Set feedback state for 2 seconds
      setCopiedField(fieldIdentifier);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const isPhoneCopied = copiedField === contact.phone;

  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
        isSelected
          ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20'
          : 'border-stone-200 hover:border-stone-300'
      }`}
    >
      {/* Header bar with trust signal */}
      <div className="bg-stone-50 border-b border-stone-100 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Verified Official Deposit Handler</span>
        </div>
        <div className="text-xs text-stone-500 font-medium">
          Instant WhatsApp Sync
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Admin profile header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-heading font-bold text-lg shadow-sm shrink-0">
              {contact.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-stone-900 leading-tight">
                {contact.name}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">{contact.title}</p>
            </div>
          </div>

          {onSelectAdmin && (
            <button
              onClick={() => onSelectAdmin(contact.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                isSelected
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {isSelected ? 'Selected' : 'Use This Admin'}
            </button>
          )}
        </div>

        {/* Account / Phone Number Display with Primary 1-Tap Copy */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-medium">EasyPaisa / JazzCash / Account Number</span>
            {/* Visual tooltip state */}
            {isPhoneCopied && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1 text-xs animate-in fade-in duration-150">
                <Check className="w-3.5 h-3.5" /> Copied to clipboard!
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xl sm:text-2xl font-bold text-stone-900 tracking-wider tabular-nums">
              {contact.phone}
            </span>

            {/* 1-Tap Copy Button: Prominent touch target >= 44px on mobile */}
            <button
              onClick={() => handleCopy(contact.phone, contact.phone)}
              type="button"
              className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                isPhoneCopied
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 shadow-xs'
              }`}
              title="Copy number to clipboard"
            >
              {isPhoneCopied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-600" />
                  <span>Copy No.</span>
                </>
              )}
            </button>
          </div>

          {/* Payment channels accepted */}
          <div className="mt-3 pt-3 border-t border-stone-200 flex flex-wrap items-center gap-2 text-xs text-stone-600">
            <span className="font-medium text-stone-500">Supported:</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              <Smartphone className="w-3 h-3 text-emerald-600" /> EasyPaisa
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              <CreditCard className="w-3 h-3 text-amber-600" /> JazzCash
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
              <Building2 className="w-3 h-3 text-blue-600" /> Bank Transfer
            </span>
          </div>
        </div>

        {/* Action Buttons: 1-Tap WhatsApp Verification & 1-Tap Call */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* 1-Tap WhatsApp Verification Chat button */}
          <a
            href={contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-sm transition-all text-center focus:ring-2 focus:ring-emerald-500/30"
          >
            <MessageSquare className="w-4 h-4 text-white shrink-0" />
            <span className="truncate">WhatsApp Verification</span>
          </a>

          {/* 1-Tap Call Dialer button */}
          <a
            href={contact.telUrl}
            className="min-h-[48px] w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-900 font-semibold text-sm border border-stone-200 transition-all text-center"
          >
            <PhoneCall className="w-4 h-4 text-stone-700 shrink-0" />
            <span>Call {contact.name.split(' ')[0]}</span>
          </a>
        </div>

        {/* Expandable Direct Bank Account Details */}
        {contact.bankDetails && (
          <div className="pt-1">
            <button
              onClick={() => setShowBankDetails(!showBankDetails)}
              type="button"
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{showBankDetails ? 'Hide Direct Bank IBAN' : 'View Direct Commercial Bank Details (IBAN)'}</span>
            </button>

            {showBankDetails && (
              <div className="mt-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex justify-between">
                  <span className="text-stone-500">Bank Name:</span>
                  <span className="font-semibold text-stone-900">{contact.bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Account Title:</span>
                  <span className="font-semibold text-stone-900">{contact.bankDetails.accountTitle}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                  <span className="text-stone-500">IBAN / A/C:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-stone-900 text-xs">
                      {contact.bankDetails.iban}
                    </span>
                    <button
                      onClick={() => handleCopy(contact.bankDetails!.iban, 'iban')}
                      className="text-emerald-700 hover:text-emerald-800 p-1 font-medium"
                      title="Copy IBAN"
                    >
                      {copiedField === 'iban' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

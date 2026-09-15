import { AlertTriangle, Info, X } from "lucide-react";

const DisclaimerModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 bordertw border-blue-500/30 rounded-xl max-w-2xl w-full shadow-2xl shadow-blue-500/20 max-h-[60vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-slate-900/90 backdrop-blur-xl">
          <h3 className="text-xl font-bold text-white">Terms and Conditions</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Impermanent Loss */}
          <div className="">
            <div className="flex items-start gap-3">
              <div>
                <h4 className="text-sm font-bold text-orange-300 mb-2">
                  Early Access Pricing
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  Your entry basis:
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  DYP: $0.004
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  iDYP: $0.00008
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Anyone who claims early access before February 23, 2026 locks
                  in a minimum $1 DYP/iDYP : $1 ALLOX rate, based on the entry
                  basis above.
                </p>
              </div>
            </div>
          </div>
          {/* Reward Adjustments */}
          <div className="">
            <div className="flex items-start gap-3">
              {/* <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" /> */}
              <div>
                <h4 className="text-sm font-bold text-yellow-300 my-2">
                  Early access closes: February 23, 2027
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  DYP or iDYP purchased on a CEX or DEX after February 23, 2026
                  will not qualify for early access pricing.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  To lock in the $1 : $1 minimum rate, you must claim before
                  February 23, 2026.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  DYP or iDYP purchased or moved after the pricing cutoff
                  (February 23, 2026, 00:00 UTC) will not be eligible for early
                  access pricing. Eligibility is based strictly on balances
                  recorded at the cutoff time. Keep your DYP or iDYP in the same
                  wallet after the cutoff (February 23, 2026, 00:00 UTC). Only
                  the recorded wallet gets credited with early access pricing.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If you're staking in an active or expired pool, no action
                  needed. We'll calculate your early access allocation based on
                  your deposits and pending rewards at the cutoff.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;

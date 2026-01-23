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
                  Snapshot and Eligibility
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  DYP: $0.004
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  iDYP: $0.00008
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Anyone who migrates before 23 February 2026 will receive at
                  least a $1 DYP/iDYP : $1 New Token ratio based on the recorded
                  snapshot price.
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
                  Migration closes: 23 January 2027
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  Any DYP or iDYP purchased on CEX or DEX after 23 February 2026
                  will not qualify for migration.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  To guarantee that you receive at least a $1 DYP/iDYP : $1 New
                  Token ratio, you must migrate before 23 February 2026.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Any DYP or iDYP purchased or moved after the snapshot (23
                  February 2026 00:00 UTC) will not be eligible for migration.
                  Eligibility is based strictly on balances recorded at the
                  snapshot time.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Please ensure your DYP or iDYP remains in the same wallet
                  after the snapshot (23 February 2026 00:00 UTC) and do not
                  move it to another wallet, as only the recorded wallet will be
                  credited during migration.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Users that are staking in active or expired pools don't need
                  to take any action. We will make a snapshot based on their
                  deposits and pending rewards and allocation of the new token
                  will be done automatically for them.
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

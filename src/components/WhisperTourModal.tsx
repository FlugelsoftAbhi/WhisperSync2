import React from 'react';
import { Eye, Shield, Users, ArrowRight, X, Sparkles, MessageSquareLock, Check } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const WhisperTourModal: React.FC = () => {
  const { showWhisperExplainer, setShowWhisperExplainer, allUsers, setCurrentUser, activeChat } = useChat();

  if (!showWhisperExplainer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-r from-violet-950/80 via-indigo-950/60 to-slate-900 border-b border-slate-800">
          <button
            onClick={() => setShowWhisperExplainer(false)}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-400">
              <Sparkles className="w-3.5 h-3.5" />
              Core Innovation
            </span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquareLock className="w-6 h-6 text-violet-400" />
            In-Thread Private Whispers
          </h3>
          <p className="text-sm text-slate-300 mt-1">
            Privately text specific people inside a group conversation without leaving the shared thread or fragmenting into separate 1-on-1 DMs.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-sm text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-slate-100 text-sm mb-1">Stay in Context</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No need to exit the group or search for private DMs. Side remarks & confidential questions stay synchronized in time.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-2">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-slate-100 text-sm mb-1">Dual-Lens Privacy</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Only the sender and chosen recipient(s) see the whisper. For everyone else in the group, it's 100% ghost-invisible.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-2">
                <Eye className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-slate-100 text-sm mb-1">Multi-Lens Demo</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Switch between Alex, Liam, and Maya at the top of the screen to immediately verify what each person sees in real time!
              </p>
            </div>
          </div>

          {/* Quick interactive test switchers */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-violet-500/20">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Try Switching Perspectives Now:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setCurrentUser(allUsers[0]);
                  setShowWhisperExplainer(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  AR
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-white truncate">Alex (You)</div>
                  <div className="text-[10px] text-slate-400 truncate">Sender of whisper</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setCurrentUser(allUsers[1]);
                  setShowWhisperExplainer(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  LC
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-white truncate">Liam Chen</div>
                  <div className="text-[10px] text-emerald-400 truncate">Whisper Recipient</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setCurrentUser(allUsers[2]);
                  setShowWhisperExplainer(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-rose-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  ML
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-white truncate">Maya Lin</div>
                  <div className="text-[10px] text-slate-400 truncate">Bystander (Shielded)</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Current chat: <span className="text-slate-200 font-medium">{activeChat?.name || 'Group Chat'}</span>
          </span>
          <button
            onClick={() => setShowWhisperExplainer(false)}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-violet-600/20 transition-all"
          >
            Explore Messenger <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

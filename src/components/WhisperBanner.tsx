import React from 'react';
import {
  Lock,
  Globe,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Eye,
  Zap,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const WhisperBanner: React.FC = () => {
  const {
    activeChat,
    currentUser,
    allUsers,
    setCurrentUser,
    whisperFilter,
    setWhisperFilter,
    messages,
    setShowWhisperExplainer,
    triggerSimulatedWhisperReply,
    triggerSimulatedPublicReply,
  } = useChat();

  if (!activeChat || activeChat.type !== 'group') return null;

  // Count whispers vs public in this group
  const totalCount = messages.length;

  return (
    <div className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setWhisperFilter('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              whisperFilter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>All Stream</span>
          </button>

          <button
            onClick={() => setWhisperFilter('whispers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              whisperFilter === 'whispers'
                ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40'
                : 'text-slate-400 hover:text-violet-300'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-violet-400" />
            <span>Private Whispers</span>
          </button>

          <button
            onClick={() => setWhisperFilter('public')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              whisperFilter === 'public'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Public Only</span>
          </button>
        </div>

        {/* Quick Testing Tools for the Evaluator */}
        <div className="flex items-center gap-2">
          {/* Quick Perspective Lens Button */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Lens:</span>
            <span className="text-slate-200 font-semibold truncate max-w-[90px]">
              {currentUser.name.split(' ')[0]}
            </span>
            <span className="text-slate-600">·</span>
            {currentUser.id === 'user-alex' ? (
              <button
                onClick={() => setCurrentUser(allUsers[2])} // Switch to Maya
                className="text-violet-400 hover:text-violet-300 underline font-medium"
                title="Switch to Maya (bystander) to see how whispers disappear"
              >
                Inspect as Maya
              </button>
            ) : (
              <button
                onClick={() => setCurrentUser(allUsers[0])} // Switch back to Alex
                className="text-emerald-400 hover:text-emerald-300 underline font-medium"
              >
                Return to Alex
              </button>
            )}
          </div>

          {/* Simulate actions */}
          <button
            onClick={() => triggerSimulatedWhisperReply()}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-violet-300 bg-violet-950/40 hover:bg-violet-900/60 border border-violet-700/50 rounded-lg transition-colors"
            title="Simulate Liam whispering to you inside this thread"
          >
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden md:inline">Simulate</span> Whisper
          </button>

          <button
            onClick={() => setShowWhisperExplainer(true)}
            className="p-1.5 text-slate-400 hover:text-violet-300 hover:bg-slate-800 rounded-lg transition-colors"
            title="How In-Thread Whispers work"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

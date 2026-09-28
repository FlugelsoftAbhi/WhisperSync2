import React from 'react';
import {
  X,
  Users,
  Lock,
  Shield,
  Palette,
  Clock,
  Star,
  FileText,
  UserPlus,
  LogOut,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { ChatTheme } from '../types';

export const GroupInfoDrawer: React.FC = () => {
  const {
    activeChat,
    infoDrawerOpen,
    setInfoDrawerOpen,
    currentUser,
    setWhisperMode,
    setChatTheme,
    setWhisperPrivacySetting,
  } = useChat();

  if (!infoDrawerOpen || !activeChat) return null;

  const isGroup = activeChat.type === 'group';

  const themes: { id: ChatTheme; name: string; color: string }[] = [
    { id: 'whatsapp-emerald', name: 'WhatsApp Emerald', color: 'bg-emerald-600' },
    { id: 'messenger-blue', name: 'Messenger Blue', color: 'bg-blue-600' },
    { id: 'cyber-purple', name: 'Cyber Amethyst', color: 'bg-violet-600' },
    { id: 'sunset-rose', name: 'Sunset Rose', color: 'bg-rose-600' },
    { id: 'amber-gold', name: 'Amber Gold', color: 'bg-amber-600' },
  ];

  return (
    <div className="w-80 border-l border-slate-800 bg-slate-900/98 flex flex-col h-full overflow-y-auto custom-scrollbar animate-fadeIn shrink-0">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
        <h3 className="font-semibold text-slate-100 text-sm">
          {isGroup ? 'Group Information' : 'Contact Details'}
        </h3>
        <button
          onClick={() => setInfoDrawerOpen(false)}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-20 h-20 rounded-3xl ${activeChat.avatarBg} flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-slate-950/60 mb-3`}
          >
            {isGroup ? (
              <Users className="w-9 h-9 text-white/90" />
            ) : (
              activeChat.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <h2 className="text-base font-bold text-white leading-snug">{activeChat.name}</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">{activeChat.description}</p>
        </div>

        {/* IN-THREAD WHISPER CONTROLS (Group Only) */}
        {isGroup && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-900 to-indigo-950/40 border border-violet-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-violet-400" />
              <h4 className="text-xs font-semibold text-slate-100">
                In-Thread Whisper Privacy
              </h4>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              Control how private whispers appear to bystanders in this group:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setWhisperPrivacySetting(activeChat.id, 'ghost')}
                className={`p-2 rounded-xl text-left border transition-all ${
                  activeChat.whisperPrivacySetting === 'ghost'
                    ? 'border-violet-500 bg-violet-600/20 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
                  <EyeOff className="w-3.5 h-3.5 text-violet-400" />
                  <span>Ghost Mode</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">
                  100% invisible to bystanders. No trace left behind.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setWhisperPrivacySetting(activeChat.id, 'notice')}
                className={`p-2 rounded-xl text-left border transition-all ${
                  activeChat.whisperPrivacySetting === 'notice'
                    ? 'border-violet-500 bg-violet-600/20 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Notice Mode</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">
                  Shows locked stealth badge without leaking content.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Group Members List */}
        {isGroup && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Group Members ({activeChat.members.length})
              </span>
            </div>

            <div className="space-y-1.5">
              {activeChat.members.map((member) => {
                const isMe = member.id === currentUser.id;
                const isAdmin = activeChat.adminIds.includes(member.id);

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full ${member.avatarBg} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                      >
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-100 truncate">
                            {member.name} {isMe && '(You)'}
                          </span>
                          {isAdmin && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1 rounded">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {member.role || member.status}
                        </span>
                      </div>
                    </div>

                    {!isMe && (
                      <button
                        onClick={() => {
                          setWhisperMode(true, [member]);
                          setInfoDrawerOpen(false);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-violet-300 bg-violet-950/50 hover:bg-violet-900/60 border border-violet-700/50 rounded-lg transition-colors shrink-0"
                        title={`Send private whisper to ${member.name} within this group`}
                      >
                        <Lock className="w-3 h-3 text-violet-400" />
                        <span>Whisper</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat Customization Theme */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Theme Palette
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setChatTheme(activeChat.id, t.id)}
                className={`h-8 rounded-xl ${t.color} flex items-center justify-center transition-all ${
                  activeChat.theme === t.id
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-105'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title={t.name}
              />
            ))}
          </div>
        </div>

        {/* Disappearing Messages */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-200">Disappearing Messages</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono">
              {activeChat.disappearingTimer === 'off' ? 'Off' : activeChat.disappearingTimer}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            For more privacy, new messages can disappear from this chat after the chosen duration.
          </p>
        </div>

        {/* Media, Links & Docs count */}
        <div className="space-y-1">
          <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 text-xs transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Media, Links and Docs</span>
            </div>
            <span className="text-slate-500 font-mono">14</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 text-xs transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Starred Messages</span>
            </div>
            <span className="text-slate-500 font-mono">3</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 text-xs transition-colors cursor-pointer">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Encryption</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

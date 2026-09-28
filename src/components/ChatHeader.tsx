import React, { useState } from 'react';
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  Users,
  Shield,
  Lock,
  Sparkles,
  Info,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const ChatHeader: React.FC = () => {
  const {
    activeChat,
    currentUser,
    allUsers,
    setCurrentUser,
    startCall,
    infoDrawerOpen,
    setInfoDrawerOpen,
    setShowWhisperExplainer,
  } = useChat();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  if (!activeChat) return null;

  const isGroup = activeChat.type === 'group';

  return (
    <div className="relative h-16 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 z-20">
      {/* Left Chat Details */}
      <div
        className="flex items-center gap-3 cursor-pointer group min-w-0"
        onClick={() => setInfoDrawerOpen(!infoDrawerOpen)}
      >
        <div className="relative">
          <div
            className={`w-10 h-10 rounded-2xl ${activeChat.avatarBg} flex items-center justify-center text-white text-sm font-bold shadow-md shadow-slate-950/40`}
          >
            {isGroup ? (
              <Users className="w-5 h-5 text-white/90" />
            ) : (
              activeChat.name.substring(0, 2).toUpperCase()
            )}
          </div>
          {!isGroup && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-100 truncate group-hover:text-emerald-400 transition-colors">
              {activeChat.name}
            </h2>
            {isGroup && (
              <span className="text-[10px] text-violet-400 font-medium px-1.5 py-0.2 bg-violet-950/60 border border-violet-800/40 rounded-md flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Whisper Enabled
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 truncate">
            {isGroup
              ? `${activeChat.members.length} members · ${activeChat.members
                  .map((m) => m.name.split(' ')[0])
                  .join(', ')}`
              : 'Online · Tap for contact details'}
          </p>
        </div>
      </div>

      {/* Right Controls & Multi-User Perspective Lens Switcher */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Multi-Perspective Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-all shadow-sm"
            title="Switch User Lens to see how in-thread whispers look for other members"
          >
            <div
              className={`w-4 h-4 rounded-full ${currentUser.avatarBg} flex items-center justify-center text-[8px] font-bold text-white shrink-0`}
            >
              {currentUser.name.substring(0, 1)}
            </div>
            <span className="hidden md:inline text-slate-400">Viewing as:</span>
            <span className="font-semibold text-slate-100 truncate max-w-[80px]">
              {currentUser.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Perspective Lens Dropdown */}
          {showPersonaMenu && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-40 animate-fadeIn">
              <div className="px-2 py-1.5 border-b border-slate-800 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch User Perspective
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  See how private in-thread whispers render for different participants vs bystanders!
                </p>
              </div>

              <div className="space-y-1">
                {allUsers.map((user) => {
                  const isActive = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setShowPersonaMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                        isActive
                          ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full ${user.avatarBg} flex items-center justify-center text-[10px] font-bold text-white`}
                        >
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white truncate">
                            {user.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {user.role || user.username}
                          </div>
                        </div>
                      </div>

                      {isActive && <UserCheck className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Audio Call */}
        <button
          onClick={() => startCall(activeChat.id, 'audio')}
          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-colors"
          title="Voice Call"
        >
          <Phone className="w-4 h-4" />
        </button>

        {/* Video Call */}
        <button
          onClick={() => startCall(activeChat.id, 'video')}
          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-colors"
          title="Video Call"
        >
          <Video className="w-4 h-4" />
        </button>

        {/* Info Drawer Toggle */}
        <button
          onClick={() => setInfoDrawerOpen(!infoDrawerOpen)}
          className={`p-2 rounded-xl transition-colors ${
            infoDrawerOpen
              ? 'text-emerald-400 bg-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Group Info & Settings"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  MessageSquare,
  Radio,
  Phone,
  Settings,
  Search,
  Plus,
  Pin,
  Lock,
  CheckCheck,
  Check,
  Users,
  Sparkles,
  ChevronDown,
  UserCheck,
  CircleDot,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { Chat } from '../types';

export const Sidebar: React.FC = () => {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    currentUser,
    allUsers,
    setCurrentUser,
    statusStories,
    openStory,
    setShowWhisperExplainer,
    startCall,
  } = useChat();

  const [activeTab, setActiveTab] = useState<'chats' | 'stories' | 'calls' | 'settings'>('chats');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'groups'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Filter chats by search and category
  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'unread') return chat.unreadCount > 0;
    if (filterType === 'groups') return chat.type === 'group';
    return true;
  });

  const unseenStoriesCount = statusStories.filter((s) => !s.seen).length;

  return (
    <div className="w-80 sm:w-96 h-full flex flex-col bg-slate-900 border-r border-slate-800 shrink-0 select-none">
      {/* 1. Top App Header Bar */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
        {/* Current User Identity & Quick Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 p-1.5 -ml-1 rounded-xl hover:bg-slate-800 transition-colors text-left"
          >
            <div className="relative">
              <div
                className={`w-9 h-9 rounded-2xl ${currentUser.avatarBg} flex items-center justify-center text-white text-xs font-bold shadow-md shadow-slate-950/40`}
              >
                {currentUser.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-100 truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                {currentUser.role || 'Active User'}
              </span>
            </div>
          </button>

          {/* User Switcher Dropdown */}
          {showUserDropdown && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
              <div className="px-2 py-1.5 border-b border-slate-800 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Persona
                </span>
              </div>
              <div className="space-y-1">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowUserDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                      u.id === currentUser.id
                        ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full ${u.avatarBg} flex items-center justify-center text-[10px] font-bold text-white`}
                      >
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{u.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{u.role}</div>
                      </div>
                    </div>
                    {u.id === currentUser.id && (
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feature Explainer & Brand Badge */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowWhisperExplainer(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-violet-300 bg-violet-950/60 hover:bg-violet-900/60 border border-violet-800/50 rounded-xl transition-all shadow-sm"
            title="In-Thread Private Whispers info"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden sm:inline">Whisper Info</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Navigation Tabs (WhatsApp / Messenger Dock) */}
      <div className="flex items-center justify-around px-2 py-2 border-b border-slate-800/80 bg-slate-950/50">
        <button
          onClick={() => setActiveTab('chats')}
          className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'chats'
              ? 'bg-slate-800 text-emerald-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chats</span>
        </button>

        <button
          onClick={() => setActiveTab('stories')}
          className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'stories'
              ? 'bg-slate-800 text-emerald-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CircleDot className="w-4 h-4" />
          <span>Status</span>
          {unseenStoriesCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('calls')}
          className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'calls'
              ? 'bg-slate-800 text-emerald-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Calls</span>
        </button>
      </div>

      {/* Tab View: STORIES */}
      {activeTab === 'stories' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Status Updates
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium cursor-pointer">
              My Status
            </span>
          </div>

          <div className="space-y-2">
            {statusStories.map((story, idx) => (
              <div
                key={story.id}
                onClick={() => openStory(idx)}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all"
              >
                <div className="relative">
                  <div
                    className={`w-11 h-11 rounded-full ${
                      story.userAvatarBg
                    } flex items-center justify-center text-white text-xs font-bold ring-2 ${
                      story.seen ? 'ring-slate-700' : 'ring-emerald-500 ring-offset-2 ring-offset-slate-900'
                    }`}
                  >
                    {story.userName.substring(0, 2).toUpperCase()}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-100 truncate">
                      {story.userName}
                    </h4>
                    <span className="text-[10px] text-slate-500">{story.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">"{story.caption}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab View: CALLS */}
      {activeTab === 'calls' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Calls
            </h3>
          </div>

          {chats.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl ${c.avatarBg} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {c.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white truncate max-w-[140px]">
                    {c.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">Incoming call · Yesterday</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => startCall(c.id, 'audio')}
                  className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab View: CHATS (Default) */}
      {activeTab === 'chats' && (
        <>
          {/* 3. Search Bar */}
          <div className="px-3 pt-3 pb-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search chats, whispers, or contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-colors"
              />
            </div>
          </div>

          {/* 4. Filter Buttons */}
          <div className="flex items-center gap-1 px-3 pb-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                filterType === 'unread'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilterType('groups')}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                filterType === 'groups'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
              }`}
            >
              Groups
            </button>
          </div>

          {/* 5. Chat List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
            {filteredChats.map((chat) => {
              const isActive = chat.id === activeChatId;
              const isGroup = chat.type === 'group';
              const lastMsg = chat.lastMessage;
              const isWhisperLast = lastMsg?.whisper?.isWhisper;

              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                    isActive
                      ? 'bg-slate-800/90 text-white shadow-sm ring-1 ring-slate-700/50'
                      : 'hover:bg-slate-850/50 text-slate-300'
                  }`}
                >
                  {/* Chat Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 rounded-2xl ${chat.avatarBg} flex items-center justify-center text-white text-xs font-bold shadow-md shadow-slate-950/30`}
                    >
                      {isGroup ? (
                        <Users className="w-5 h-5 text-white/90" />
                      ) : (
                        chat.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    {!isGroup && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                    )}
                  </div>

                  {/* Chat Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`text-xs font-bold truncate ${
                          isActive ? 'text-white' : 'text-slate-200'
                        }`}
                      >
                        {chat.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1">
                        {lastMsg ? lastMsg.timestamp : ''}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                        {chat.typingUsers.length > 0 ? (
                          <span className="text-emerald-400 font-medium italic">
                            typing...
                          </span>
                        ) : isWhisperLast ? (
                          <span className="flex items-center gap-1 text-violet-400 font-medium truncate">
                            <Lock className="w-3 h-3 shrink-0" />
                            <span>Whisper: {lastMsg?.content}</span>
                          </span>
                        ) : (
                          <span className="truncate">{lastMsg?.content || 'No messages yet'}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {chat.pinned && <Pin className="w-3 h-3 text-slate-500 fill-current" />}
                        {chat.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center shadow-sm">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

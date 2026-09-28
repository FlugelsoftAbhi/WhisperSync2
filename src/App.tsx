import React from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { WhisperBanner } from './components/WhisperBanner';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { GroupInfoDrawer } from './components/GroupInfoDrawer';
import { StatusViewer } from './components/StatusViewer';
import { CallModal } from './components/CallModal';
import { WhisperTourModal } from './components/WhisperTourModal';
import { MessageSquare, Sparkles } from 'lucide-react';

const ChatArea: React.FC = () => {
  const { activeChat } = useChat();

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-4 shadow-xl">
          <MessageSquare className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">WhisperSync Messenger</h3>
        <p className="text-sm text-slate-400 max-w-sm">
          Select a chat on the left to start messaging, or test in-thread private whispering in group conversations.
        </p>
      </div>
    );
  }

  // Get theme gradient styling for the chat background
  const getThemeBackground = () => {
    switch (activeChat.theme) {
      case 'messenger-blue':
        return 'from-slate-950 via-blue-950/20 to-slate-950';
      case 'cyber-purple':
        return 'from-slate-950 via-violet-950/20 to-slate-950';
      case 'sunset-rose':
        return 'from-slate-950 via-rose-950/20 to-slate-950';
      case 'amber-gold':
        return 'from-slate-950 via-amber-950/20 to-slate-950';
      case 'whatsapp-emerald':
      default:
        return 'from-slate-950 via-emerald-950/15 to-slate-950';
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b ${getThemeBackground()} relative`}>
      {/* Subtle chat background pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      <ChatHeader />
      <WhisperBanner />
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default function App() {
  return (
    <ChatProvider>
      <div className="flex h-screen w-screen bg-slate-950 overflow-hidden font-sans text-slate-100">
        <Sidebar />
        <ChatArea />
        <GroupInfoDrawer />

        {/* Global Overlays */}
        <StatusViewer />
        <CallModal />
        <WhisperTourModal />
      </div>
    </ChatProvider>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Smile,
  Paperclip,
  Image as ImageIcon,
  BarChart2,
  Lock,
  Globe,
  X,
  UserCheck,
  Shield,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { CreatePollModal } from './CreatePollModal';
import { User } from '../types';

export const MessageInput: React.FC = () => {
  const {
    activeChat,
    currentUser,
    sendMessage,
    replyingTo,
    setReplyingTo,
    isWhisperModeActive,
    whisperTargetUsers,
    setWhisperMode,
    toggleWhisperForUser,
    clearWhisperMode,
    stealthLevel,
    setStealthLevel,
  } = useChat();

  const [text, setText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showWhisperPicker, setShowWhisperPicker] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);

  // Voice recording state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Timer for voice note
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    // Check for whisper command prefix: e.g. /w @liam hello or /whisper
    if (trimmed.startsWith('/w ') || trimmed.startsWith('/whisper ')) {
      // Auto-detect whisper command
      const isGroup = activeChat?.type === 'group';
      if (isGroup && activeChat) {
        // default to first other member if not already set
        if (!isWhisperModeActive || whisperTargetUsers.length === 0) {
          const firstOther = activeChat.members.find((m) => m.id !== currentUser.id);
          if (firstOther) {
            setWhisperMode(true, [firstOther]);
          }
        }
      }
    }

    sendMessage(trimmed, { type: 'text' });
    setText('');
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
  };

  const handleSendVoiceNote = () => {
    if (recordingSeconds < 1) {
      setIsRecordingVoice(false);
      return;
    }

    // Generate simulated dynamic waveform
    const sampleWaveform = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 75 + 25)
    );

    sendMessage('', {
      type: 'voice',
      voiceNote: {
        duration: Math.max(2, recordingSeconds),
        waveform: sampleWaveform,
      },
    });

    setIsRecordingVoice(false);
  };

  const handleCancelVoiceNote = () => {
    setIsRecordingVoice(false);
    setRecordingSeconds(0);
  };

  const handleSendImageSample = (theme: string) => {
    sendMessage(`Shared a photo from the project gallery (${theme})`, {
      type: 'text',
    });
    setShowAttachmentMenu(false);
  };

  const handleSendDocSample = () => {
    sendMessage(`📄 Project_Roadmap_Q4.pdf (2.4 MB)`, {
      type: 'text',
    });
    setShowAttachmentMenu(false);
  };

  if (!activeChat) return null;

  const isGroup = activeChat.type === 'group';
  const otherMembers = activeChat.members.filter((m) => m.id !== currentUser.id);

  const emojiList = [
    '👍', '❤️', '🔥', '😂', '🎉', '👏', '✨', '🚀',
    '🤫', '👀', '💯', '🙌', '🙏', '😍', '☕', '💡',
    '⚡', '🏖️', '🌲', '🏔️', '🍕', '🌮', '💻', '🔒',
  ];

  return (
    <div className="relative border-t border-slate-800 bg-slate-900/95 backdrop-blur-md p-3 space-y-2">
      {/* 1. In-Thread Target Selector Bar (Exclusively for Group Chats) */}
      {isGroup && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          {/* Target Pill / Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Message Target:</span>

            {isWhisperModeActive && whisperTargetUsers.length > 0 ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowWhisperPicker(!showWhisperPicker)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-600/20 border border-violet-500/50 text-violet-300 text-xs font-semibold hover:bg-violet-600/30 transition-all shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5 text-violet-400" />
                  <span>
                    Whispering to:{' '}
                    <strong className="text-white">
                      {whisperTargetUsers.map((u) => u.name.split(' ')[0]).join(', ')}
                    </strong>
                  </span>
                  <span className="text-[10px] text-violet-400 ml-1">▾</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (otherMembers.length > 0) {
                    setWhisperMode(true, [otherMembers[0]]);
                  }
                  setShowWhisperPicker(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Everyone (Public)</span>
                <span className="text-[10px] text-slate-400 ml-0.5">· Click to Whisper</span>
              </button>
            )}

            {isWhisperModeActive && (
              <button
                type="button"
                onClick={clearWhisperMode}
                className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors text-xs"
                title="Switch back to Public message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Whisper Switcher Trigger */}
          <div className="flex items-center gap-1.5">
            {!isWhisperModeActive ? (
              <button
                type="button"
                onClick={() => {
                  if (otherMembers.length > 0) {
                    setWhisperMode(true, [otherMembers[0]]);
                  }
                  setShowWhisperPicker(true);
                }}
                className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 font-semibold px-2 py-0.5 rounded-lg hover:bg-violet-950/40 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-violet-400" />
                <span>Start In-Thread Whisper</span>
              </button>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-violet-300 font-mono">
                <Shield className="w-3 h-3 text-violet-400" />
                <span>Stealth Active</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Whisper Member Selection Popover */}
      {showWhisperPicker && isGroup && (
        <div className="absolute bottom-full mb-3 left-4 w-72 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-3 z-30 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-violet-400" />
              <h4 className="text-xs font-semibold text-slate-200">Whisper Audience</h4>
            </div>
            <button
              onClick={() => setShowWhisperPicker(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 mb-2.5">
            Select who can view and reply to this whisper within the thread:
          </p>

          <div className="space-y-1 max-h-48 overflow-y-auto">
            {otherMembers.map((member) => {
              const isSelected = whisperTargetUsers.some((u) => u.id === member.id);
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleWhisperForUser(member)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-violet-600/20 border border-violet-500/40 text-violet-200'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full ${member.avatarBg} flex items-center justify-center text-[10px] font-bold text-white`}
                    >
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium">{member.name}</span>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-violet-400 bg-violet-500 text-white'
                        : 'border-slate-600'
                    }`}
                  >
                    {isSelected && <UserCheck className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={clearWhisperMode}
              className="text-[11px] text-slate-400 hover:text-slate-200"
            >
              Cancel (Public)
            </button>
            <button
              type="button"
              onClick={() => setShowWhisperPicker(false)}
              className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded-lg shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 2. Quoted Reply Preview Bar */}
      {replyingTo && (
        <div
          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs animate-fadeIn ${
            replyingTo.whisper?.isWhisper
              ? 'bg-violet-950/40 border-violet-500/40 text-violet-200'
              : 'bg-slate-800/80 border-slate-700 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {replyingTo.whisper?.isWhisper ? (
              <Lock className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            ) : (
              <span className="w-1 h-8 rounded-full bg-emerald-500 shrink-0" />
            )}
            <div className="truncate">
              <span className="font-semibold text-slate-100">
                Replying to{' '}
                {replyingTo.senderId === currentUser.id
                  ? 'yourself'
                  : replyingTo.replyTo?.senderName || 'message'}
                :
              </span>
              <p className="text-[11px] text-slate-400 truncate italic">
                {replyingTo.content || '[Media attachment]'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Attachment Menu Popover */}
      {showAttachmentMenu && (
        <div className="absolute bottom-full mb-3 left-4 p-2 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-30 flex flex-col gap-1 w-48 animate-fadeIn">
          <button
            type="button"
            onClick={() => handleSendImageSample('Design tokens')}
            className="flex items-center gap-2.5 p-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span>Photos & Videos</span>
          </button>

          {isGroup && (
            <button
              type="button"
              onClick={() => {
                setShowPollModal(true);
                setShowAttachmentMenu(false);
              }}
              className="flex items-center gap-2.5 p-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <BarChart2 className="w-4 h-4" />
              </div>
              <span>Create Poll</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSendDocSample}
            className="flex items-center gap-2.5 p-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span>Document</span>
          </button>
        </div>
      )}

      {/* 4. Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-3 left-12 p-3 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-30 grid grid-cols-6 gap-1 w-64 animate-fadeIn">
          {emojiList.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setText((prev) => prev + emoji)}
              className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-lg hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* 5. Main Input Bar */}
      {isRecordingVoice ? (
        <div className="flex items-center justify-between p-2 bg-slate-950 border border-emerald-500/40 rounded-2xl animate-pulse">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-sm font-mono text-emerald-400">
              Recording Voice Note: 0:
              {recordingSeconds.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancelVoiceNote}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendVoiceNote}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Send Voice
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* Attachment Icon */}
          <button
            type="button"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            title="Attach Media or Poll"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Emoji Icon */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            title="Emojis"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Text Input Box */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                isGroup && isWhisperModeActive && whisperTargetUsers.length > 0
                  ? `🔒 Whisper privately to ${whisperTargetUsers
                      .map((u) => u.name.split(' ')[0])
                      .join(', ')}...`
                  : 'Type a message (or type /whisper)...'
              }
              className={`w-full px-4 py-2.5 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                isWhisperModeActive
                  ? 'bg-slate-950 border border-violet-500/60 focus:border-violet-400 ring-1 ring-violet-500/20'
                  : 'bg-slate-950 border border-slate-700/80 focus:border-emerald-500'
              }`}
            />
          </div>

          {/* Send or Voice Note Button */}
          {text.trim() ? (
            <button
              type="submit"
              className={`p-2.5 rounded-2xl text-white shadow-lg transition-all active:scale-95 ${
                isWhisperModeActive
                  ? 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              }`}
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsRecordingVoice(true)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 rounded-2xl transition-colors"
              title="Hold/Click to record voice note"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </form>
      )}

      {/* Poll Modal */}
      <CreatePollModal
        isOpen={showPollModal}
        onClose={() => setShowPollModal(false)}
      />
    </div>
  );
};

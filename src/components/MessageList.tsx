import React, { useState, useRef, useEffect } from 'react';
import {
  Lock,
  Check,
  CheckCheck,
  Play,
  Pause,
  Reply,
  Smile,
  Star,
  Trash2,
  Share2,
  Shield,
  Volume2,
  BarChart2,
  CornerDownRight,
  MoreVertical,
  Radio,
} from 'lucide-react';
import { Message, User } from '../types';
import { useChat } from '../context/ChatContext';

export const MessageList: React.FC = () => {
  const {
    messages,
    currentUser,
    allUsers,
    activeChat,
    addReaction,
    votePoll,
    toggleStarMessage,
    deleteMessage,
    setReplyingTo,
    setWhisperMode,
  } = useChat();

  const bottomRef = useRef<HTMLDivElement>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceProgress, setVoiceProgress] = useState<Record<string, number>>({});
  const [voiceSpeed, setVoiceSpeed] = useState<Record<string, number>>({});
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [activeReactionPickerId, setActiveReactionPickerId] = useState<string | null>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Voice note simulated player
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playingVoiceId) {
      interval = setInterval(() => {
        setVoiceProgress((prev) => {
          const current = prev[playingVoiceId] || 0;
          const speed = voiceSpeed[playingVoiceId] || 1;
          const next = current + 4 * speed;
          if (next >= 100) {
            setPlayingVoiceId(null);
            return { ...prev, [playingVoiceId]: 0 };
          }
          return { ...prev, [playingVoiceId]: next };
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [playingVoiceId, voiceSpeed]);

  const toggleVoicePlayback = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(msgId);
    }
  };

  const cycleVoiceSpeed = (msgId: string) => {
    setVoiceSpeed((prev) => {
      const current = prev[msgId] || 1;
      const next = current === 1 ? 1.5 : current === 1.5 ? 2 : 1;
      return { ...prev, [msgId]: next };
    });
  };

  const getSender = (senderId: string): User => {
    return (
      allUsers.find((u) => u.id === senderId) || {
        id: senderId,
        name: 'Group Member',
        username: 'member',
        avatarColor: 'text-slate-300',
        avatarBg: 'bg-slate-700',
        status: '',
        isOnline: false,
      }
    );
  };

  const quickEmojis = ['❤️', '👍', '😂', '😮', '😢', '🙏', '🤫', '🔥'];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar">
      {/* End-to-End Encryption / Privacy Notice */}
      <div className="flex justify-center my-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 max-w-md text-center leading-tight shadow-sm">
          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Messages & In-Thread Whispers are protected with end-to-end encryption.</span>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500">
          <p className="text-sm">No messages in this stream.</p>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser.id;
          const sender = getSender(msg.senderId);
          const isWhisper = !!msg.whisper?.isWhisper;

          // Check if current user is participant in this whisper
          const isWhisperParticipant =
            !isWhisper ||
            msg.senderId === currentUser.id ||
            msg.whisper?.targetUserIds.includes(currentUser.id);

          // If outsider and reached here, it's a locked hint
          const isOutsiderHint = isWhisper && !isWhisperParticipant;

          // Format target names for whisper header
          const whisperPartnerName = isWhisper
            ? msg.whisper?.targetNames?.find((n) => n !== currentUser.name) ||
              msg.whisper?.targetNames?.join(', ') ||
              'Member'
            : '';

          return (
            <div
              key={msg.id}
              className={`group relative flex flex-col ${
                isMe ? 'items-end' : 'items-start'
              }`}
              onMouseEnter={() => setHoveredMessageId(msg.id)}
              onMouseLeave={() => {
                setHoveredMessageId(null);
                setActiveReactionPickerId(null);
              }}
            >
              {/* Outsider Encrypted Whisper Placeholder (if privacy mode set to notice) */}
              {isOutsiderHint ? (
                <div className="my-1.5 flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-500 italic max-w-sm">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Discreet whisper between participants (encrypted)</span>
                </div>
              ) : (
                <div
                  className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 shadow-md transition-all ${
                    isWhisper
                      ? isMe
                        ? 'bg-gradient-to-br from-violet-950/80 via-slate-900 to-violet-950/90 border border-violet-500/50 shadow-violet-950/40 text-slate-100 ring-1 ring-violet-500/30'
                        : 'bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-violet-500/40 shadow-violet-950/30 text-slate-100 ring-1 ring-violet-500/20'
                      : isMe
                      ? 'bg-emerald-600/90 text-white rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/50'
                  }`}
                >
                  {/* Whisper Header Badge */}
                  {isWhisper && (
                    <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-violet-500/30 text-[11px]">
                      <div className="flex items-center gap-1.5 font-semibold text-violet-300">
                        <Lock className="w-3.5 h-3.5 text-violet-400" />
                        <span>In-Thread Private Whisper</span>
                      </div>
                      <span className="text-[10px] text-violet-300/80 font-mono">
                        {isMe ? `With ${whisperPartnerName}` : `From ${sender.name.split(' ')[0]}`}
                      </span>
                    </div>
                  )}

                  {/* Sender Name for group chats when not sent by me and not whisper */}
                  {!isMe && !isWhisper && activeChat?.type === 'group' && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-xs font-semibold ${
                          sender.avatarColor || 'text-emerald-400'
                        }`}
                      >
                        {sender.name}
                      </span>
                      {sender.role && (
                        <span className="text-[10px] text-slate-400">· {sender.role.split(' ')[0]}</span>
                      )}
                    </div>
                  )}

                  {/* Quoted Message preview if reply */}
                  {msg.replyTo && (
                    <div
                      className={`mb-2 p-2 rounded-lg text-xs border-l-4 ${
                        msg.replyTo.isWhisper
                          ? 'bg-violet-950/40 border-violet-400 text-violet-200'
                          : isMe
                          ? 'bg-emerald-700/60 border-emerald-300 text-emerald-100'
                          : 'bg-slate-900/60 border-emerald-500 text-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-[11px] flex items-center gap-1 mb-0.5">
                        {msg.replyTo.isWhisper && <Lock className="w-3 h-3 text-violet-400" />}
                        <span>{msg.replyTo.senderName}</span>
                      </div>
                      <p className="line-clamp-2 italic text-[11px] opacity-90">{msg.replyTo.text}</p>
                    </div>
                  )}

                  {/* Message Content by type */}
                  {msg.type === 'voice' && msg.voiceNote ? (
                    <div className="flex items-center gap-3 py-1 min-w-[220px]">
                      <button
                        onClick={() => toggleVoicePlayback(msg.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
                          isMe
                            ? 'bg-white text-emerald-700'
                            : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        }`}
                      >
                        {playingVoiceId === msg.id ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      <div className="flex-1 space-y-1">
                        {/* Waveform bars */}
                        <div className="flex items-center gap-0.5 h-6">
                          {msg.voiceNote.waveform.map((height, wIdx) => {
                            const currentProgress = voiceProgress[msg.id] || 0;
                            const barProgress = (wIdx / msg.voiceNote!.waveform.length) * 100;
                            const isPassed = barProgress <= currentProgress;

                            return (
                              <div
                                key={wIdx}
                                className={`w-1 rounded-full transition-colors ${
                                  isPassed
                                    ? isMe
                                      ? 'bg-white'
                                      : 'bg-emerald-400'
                                    : isMe
                                    ? 'bg-emerald-300/40'
                                    : 'bg-slate-600'
                                }`}
                                style={{ height: `${Math.max(20, height)}%` }}
                              />
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                          <span>
                            0:
                            {Math.floor(
                              (msg.voiceNote.duration * (voiceProgress[msg.id] || 0)) / 100
                            )
                              .toString()
                              .padStart(2, '0')}
                          </span>
                          <span>0:{msg.voiceNote.duration}</span>
                        </div>
                      </div>

                      {/* Playback speed toggle */}
                      <button
                        onClick={() => cycleVoiceSpeed(msg.id)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono transition-colors ${
                          isMe
                            ? 'bg-emerald-700/80 text-white'
                            : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                        }`}
                      >
                        {voiceSpeed[msg.id] || 1}x
                      </button>
                    </div>
                  ) : msg.type === 'poll' && msg.poll ? (
                    <div className="space-y-3 py-1 min-w-[260px]">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <h4 className="font-semibold text-sm text-slate-100">{msg.poll.question}</h4>
                      </div>

                      <div className="space-y-2">
                        {msg.poll.options.map((option) => {
                          const totalVotes = msg.poll!.options.reduce(
                            (acc, o) => acc + o.voterIds.length,
                            0
                          );
                          const percentage =
                            totalVotes > 0 ? Math.round((option.voterIds.length / totalVotes) * 100) : 0;
                          const hasVoted = option.voterIds.includes(currentUser.id);

                          return (
                            <button
                              key={option.id}
                              onClick={() => votePoll(msg.id, option.id)}
                              className={`w-full text-left p-2.5 rounded-xl border relative overflow-hidden transition-all active:scale-[0.99] ${
                                hasVoted
                                  ? 'border-emerald-500 bg-emerald-950/30'
                                  : 'border-slate-700/80 bg-slate-900/40 hover:bg-slate-800/60'
                              }`}
                            >
                              {/* Progress bar background */}
                              <div
                                className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ${
                                  hasVoted ? 'bg-emerald-500/25' : 'bg-slate-700/30'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />

                              <div className="relative z-10 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                      hasVoted
                                        ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                                        : 'border-slate-500'
                                    }`}
                                  >
                                    {hasVoted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </div>
                                  <span className="font-medium text-slate-200">{option.text}</span>
                                </div>
                                <span className="font-mono text-slate-400 tabular-nums">
                                  {percentage}% ({option.voterIds.length})
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-slate-400 text-right">
                        {msg.poll.isMultipleChoice ? 'Select one or more' : 'Select one'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  )}

                  {/* Message Footer: Timestamp, Star, Read Status */}
                  <div
                    className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] ${
                      isWhisper
                        ? 'text-violet-300/80'
                        : isMe
                        ? 'text-emerald-100/80'
                        : 'text-slate-400'
                    }`}
                  >
                    {msg.starred && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                    <span>{msg.timestamp}</span>

                    {isMe && (
                      <span className="ml-0.5">
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-300 stroke-[2.5]" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-slate-300" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-slate-300" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Whisper Quick Action: "Reply in Whisper" */}
                  {isWhisper && !isMe && (
                    <button
                      onClick={() => {
                        setWhisperMode(true, [sender]);
                        setReplyingTo(msg);
                      }}
                      className="mt-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-[11px] font-semibold text-violet-200 transition-colors w-full justify-center"
                    >
                      <Lock className="w-3 h-3 text-violet-400" />
                      <span>Reply Privately in Whisper</span>
                    </button>
                  )}
                </div>
              )}

              {/* Reactions Bar below bubble */}
              {Object.keys(msg.reactions).length > 0 && !isOutsiderHint && (
                <div className="flex flex-wrap gap-1 mt-1 -mb-1 px-1">
                  {Object.entries(msg.reactions).map(([emoji, userIds]) => {
                    const hasMyReaction = userIds.includes(currentUser.id);
                    return (
                      <button
                        key={emoji}
                        onClick={() => addReaction(msg.id, emoji)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors border ${
                          hasMyReaction
                            ? 'bg-emerald-950/60 border-emerald-500/60 text-white'
                            : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{emoji}</span>
                        <span className="text-[10px] font-mono tabular-nums">{userIds.length}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Floating Action Menu on Message Hover */}
              {hoveredMessageId === msg.id && !isOutsiderHint && (
                <div
                  className={`absolute top-0 -translate-y-1/2 flex items-center gap-0.5 p-1 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-xl backdrop-blur-md z-20 ${
                    isMe ? 'right-0' : 'left-0'
                  }`}
                >
                  {/* Emoji Quick Tray Trigger */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveReactionPickerId(
                          activeReactionPickerId === msg.id ? null : msg.id
                        )
                      }
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Add reaction"
                    >
                      <Smile className="w-4 h-4" />
                    </button>

                    {/* Popover Emoji Palette */}
                    {activeReactionPickerId === msg.id && (
                      <div className="absolute left-0 bottom-full mb-1 flex items-center gap-1 p-1.5 bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl z-30">
                        {quickEmojis.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              addReaction(msg.id, emoji);
                              setActiveReactionPickerId(null);
                            }}
                            className="w-7 h-7 flex items-center justify-center hover:scale-125 transition-transform text-sm"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reply Button */}
                  <button
                    onClick={() => setReplyingTo(msg)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Reply"
                  >
                    <Reply className="w-4 h-4" />
                  </button>

                  {/* Quick Whisper button for group messages from others */}
                  {!isMe && activeChat?.type === 'group' && (
                    <button
                      onClick={() => {
                        setWhisperMode(true, [sender]);
                        setReplyingTo(msg);
                      }}
                      className="p-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-950/60 rounded-lg transition-colors"
                      title={`Whisper privately to ${sender.name}`}
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  )}

                  {/* Star */}
                  <button
                    onClick={() => toggleStarMessage(msg.id)}
                    className={`p-1.5 hover:bg-slate-800 rounded-lg transition-colors ${
                      msg.starred
                        ? 'text-amber-400'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title={msg.starred ? 'Unstar' : 'Star message'}
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  {isMe && (
                    <button
                      onClick={() => deleteMessage(msg.id, true)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete for everyone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Typing indicator */}
      {activeChat && activeChat.typingUsers.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-400 italic">
          <div className="flex items-center gap-1 p-2 bg-slate-800/80 rounded-2xl rounded-tl-none border border-slate-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
            <span className="ml-1 text-[11px] not-italic text-slate-300">
              {activeChat.typingUsers
                .map((id) => allUsers.find((u) => u.id === id)?.name.split(' ')[0])
                .filter(Boolean)
                .join(', ')}{' '}
              is typing...
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export interface User {
  id: string;
  name: string;
  username: string;
  avatarColor: string;
  avatarBg: string;
  status: string;
  isOnline: boolean;
  lastSeen?: string;
  role?: string;
}

export interface VoiceNoteData {
  duration: number; // in seconds
  waveform: number[];
  audioUrl?: string;
}

export interface PollOption {
  id: string;
  text: string;
  voterIds: string[];
}

export interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  isMultipleChoice?: boolean;
  isAnonymous?: boolean;
  createdBy: string;
}

export type WhisperStealthLevel = 'stealth' | 'hint';

export interface WhisperConfig {
  isWhisper: boolean;
  targetUserIds: string[]; // Group member IDs who can see and reply
  targetNames?: string[];
  stealthLevel: WhisperStealthLevel; // 'stealth' = 100% invisible to others; 'hint' = shows discreet locked placeholder
  parentMessageId?: string;
}

export interface MessageReaction {
  emoji: string;
  userIds: string[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string; // ISO or formatted
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'voice' | 'poll' | 'whisper' | 'system';
  mediaUrl?: string;
  mediaCaption?: string;
  voiceNote?: VoiceNoteData;
  poll?: PollData;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
    isWhisper?: boolean;
  };
  reactions: Record<string, string[]>; // emoji -> array of userIds
  whisper?: WhisperConfig;
  starred?: boolean;
  isPinned?: boolean;
}

export type ChatTheme = 'whatsapp-emerald' | 'messenger-blue' | 'cyber-purple' | 'sunset-rose' | 'amber-gold';

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatarColor: string;
  avatarBg: string;
  description?: string;
  members: User[];
  adminIds: string[];
  unreadCount: number;
  lastMessage?: Message;
  pinned?: boolean;
  theme: ChatTheme;
  disappearingTimer: 'off' | '24h' | '7d' | '90d';
  whisperPrivacySetting: 'ghost' | 'notice'; // ghost = no trace for non-members, notice = subtle locked icon
  typingUsers: string[]; // user IDs currently typing
}

export interface StatusStory {
  id: string;
  userId: string;
  userName: string;
  userAvatarBg: string;
  caption: string;
  timestamp: string;
  seen: boolean;
  mediaType: 'text' | 'image';
  bgColor: string;
  imageUrl?: string;
}

export interface CallSession {
  id: string;
  chatId: string;
  chatName: string;
  type: 'audio' | 'video';
  status: 'incoming' | 'outgoing' | 'connected' | 'ended' | 'ringing';
  participants: User[];
  duration: number; // in seconds
  isMuted: boolean;
  isVideoOff: boolean;
}

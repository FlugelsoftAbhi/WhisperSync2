import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Chat,
  Message,
  StatusStory,
  CallSession,
  ChatTheme,
  WhisperStealthLevel,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_STATUS_STORIES,
} from '../mockData';

interface ChatContextType {
  currentUser: User;
  allUsers: User[];
  setCurrentUser: (user: User) => void;
  chats: Chat[];
  activeChatId: string | null;
  activeChat: Chat | null;
  setActiveChatId: (id: string | null) => void;
  messages: Message[];
  whisperFilter: 'all' | 'whispers' | 'public';
  setWhisperFilter: (filter: 'all' | 'whispers' | 'public') => void;
  
  // Whisper composer state
  whisperTargetUsers: User[];
  isWhisperModeActive: boolean;
  setWhisperMode: (active: boolean, targetUsers?: User[]) => void;
  toggleWhisperForUser: (user: User) => void;
  clearWhisperMode: () => void;
  stealthLevel: WhisperStealthLevel;
  setStealthLevel: (level: WhisperStealthLevel) => void;
  
  // Replying state
  replyingTo: Message | null;
  setReplyingTo: (msg: Message | null) => void;

  // Search in chat
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Actions
  sendMessage: (
    content: string,
    options?: {
      type?: 'text' | 'image' | 'voice' | 'poll';
      mediaUrl?: string;
      mediaCaption?: string;
      voiceNote?: { duration: number; waveform: number[] };
      poll?: { question: string; options: string[]; isMultipleChoice?: boolean };
    }
  ) => void;
  addReaction: (messageId: string, emoji: string) => void;
  votePoll: (messageId: string, optionId: string) => void;
  toggleStarMessage: (messageId: string) => void;
  deleteMessage: (messageId: string, forEveryone: boolean) => void;
  setChatTheme: (chatId: string, theme: ChatTheme) => void;
  setWhisperPrivacySetting: (chatId: string, setting: 'ghost' | 'notice') => void;

  // Stories
  statusStories: StatusStory[];
  activeStoryIndex: number | null;
  openStory: (index: number) => void;
  closeStory: () => void;
  markStorySeen: (id: string) => void;
  createStory: (caption: string, bgColor: string) => void;

  // Calls
  callSession: CallSession | null;
  startCall: (chatId: string, type: 'audio' | 'video') => void;
  endCall: () => void;
  toggleMuteCall: () => void;
  toggleVideoCall: () => void;

  // Drawer
  infoDrawerOpen: boolean;
  setInfoDrawerOpen: (open: boolean) => void;

  // Interactive Demo Helpers
  triggerSimulatedWhisperReply: (targetUserId?: string) => void;
  triggerSimulatedPublicReply: () => void;
  showWhisperExplainer: boolean;
  setShowWhisperExplainer: (show: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const saved = localStorage.getItem('ws_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = INITIAL_USERS.find((u) => u.id === parsed.id);
        if (match) return match;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS[0]; // Alex Rivera by default
  });

  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('ws_chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CHATS;
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    return 'chat-group-launch'; // Default to the launch crew group with whispers
  });

  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('ws_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MESSAGES;
  });

  const [whisperFilter, setWhisperFilter] = useState<'all' | 'whispers' | 'public'>('all');
  const [whisperTargetUsers, setWhisperTargetUsers] = useState<User[]>([]);
  const [isWhisperModeActive, setIsWhisperModeActive] = useState(false);
  const [stealthLevel, setStealthLevel] = useState<WhisperStealthLevel>('stealth');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);
  const [showWhisperExplainer, setShowWhisperExplainer] = useState(false);

  // Status stories
  const [statusStories, setStatusStories] = useState<StatusStory[]>(() => {
    const saved = localStorage.getItem('ws_stories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_STATUS_STORIES;
  });
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // Calling
  const [callSession, setCallSession] = useState<CallSession | null>(null);

  // Save changes
  useEffect(() => {
    localStorage.setItem('ws_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ws_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('ws_messages', JSON.stringify(messagesMap));
  }, [messagesMap]);

  useEffect(() => {
    localStorage.setItem('ws_stories', JSON.stringify(statusStories));
  }, [statusStories]);

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callSession && callSession.status === 'connected') {
      interval = setInterval(() => {
        setCallSession((prev) => (prev ? { ...prev, duration: prev.duration + 1 } : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callSession?.status]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const rawMessages = activeChatId ? messagesMap[activeChatId] || [] : [];

  // Filter messages based on viewer perspective and whisper visibility
  const messages = rawMessages.filter((msg) => {
    if (!msg.whisper || !msg.whisper.isWhisper) {
      // Normal public message
      if (whisperFilter === 'whispers') return false;
      return true;
    }

    // It's a whisper message!
    // Check if the current user is part of the whisper conversation (sender or target)
    const isParticipant =
      msg.senderId === currentUser.id ||
      msg.whisper.targetUserIds.includes(currentUser.id);

    if (isParticipant) {
      if (whisperFilter === 'public') return false;
      return true;
    }

    // Current user is an outsider to this whisper!
    // If stealth level is stealth, hide it completely!
    if (msg.whisper.stealthLevel === 'stealth') {
      return false;
    }

    // If stealth level is 'hint' or chat setting is 'notice', we can show a locked stealth hint
    if (activeChat?.whisperPrivacySetting === 'notice') {
      if (whisperFilter === 'public') return false;
      return true;
    }

    return false;
  });

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    // If whisper target was previously self or invalidated, clear
    setWhisperTargetUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const setWhisperMode = (active: boolean, targetUsers?: User[]) => {
    setIsWhisperModeActive(active);
    if (targetUsers) {
      // Exclude current user from targets
      const filtered = targetUsers.filter((u) => u.id !== currentUser.id);
      setWhisperTargetUsers(filtered);
    } else if (!active) {
      setWhisperTargetUsers([]);
    }
  };

  const toggleWhisperForUser = (user: User) => {
    if (user.id === currentUser.id) return;
    setWhisperTargetUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      if (exists) {
        const next = prev.filter((u) => u.id !== user.id);
        if (next.length === 0) setIsWhisperModeActive(false);
        return next;
      } else {
        setIsWhisperModeActive(true);
        return [...prev, user];
      }
    });
  };

  const clearWhisperMode = () => {
    setIsWhisperModeActive(false);
    setWhisperTargetUsers([]);
  };

  const sendMessage = (
    content: string,
    options?: {
      type?: 'text' | 'image' | 'voice' | 'poll';
      mediaUrl?: string;
      mediaCaption?: string;
      voiceNote?: { duration: number; waveform: number[] };
      poll?: { question: string; options: string[]; isMultipleChoice?: boolean };
    }
  ) => {
    if (!activeChatId) return;

    const isGroup = activeChat?.type === 'group';
    const isWhisper = isGroup && isWhisperModeActive && whisperTargetUsers.length > 0;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsgId = `msg-${Date.now()}`;
    const newMsg: Message = {
      id: newMsgId,
      chatId: activeChatId,
      senderId: currentUser.id,
      content,
      timestamp: timeStr,
      status: 'sent',
      type: isWhisper ? 'whisper' : options?.type || 'text',
      reactions: {},
      mediaUrl: options?.mediaUrl,
      mediaCaption: options?.mediaCaption,
      voiceNote: options?.voiceNote,
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            senderName:
              allUsers.find((u) => u.id === replyingTo.senderId)?.name || 'Someone',
            text: replyingTo.content.substring(0, 80),
            isWhisper: !!replyingTo.whisper?.isWhisper,
          }
        : undefined,
      whisper: isWhisper
        ? {
            isWhisper: true,
            targetUserIds: [currentUser.id, ...whisperTargetUsers.map((u) => u.id)],
            targetNames: [currentUser.name, ...whisperTargetUsers.map((u) => u.name)],
            stealthLevel: stealthLevel,
          }
        : undefined,
      poll: options?.poll
        ? {
            id: `poll-${Date.now()}`,
            question: options.poll.question,
            options: options.poll.options.map((optText, idx) => ({
              id: `opt-${idx}`,
              text: optText,
              voterIds: [],
            })),
            isMultipleChoice: options.poll.isMultipleChoice,
            createdBy: currentUser.id,
          }
        : undefined,
    };

    // Update message state
    setMessagesMap((prev) => {
      const currentList = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: [...currentList, newMsg],
      };
    });

    // Update last message in chat list
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              lastMessage: newMsg,
            }
          : c
      )
    );

    // Reset reply state
    setReplyingTo(null);

    // Simulate delivery & read ticks
    setTimeout(() => {
      setMessagesMap((prev) => {
        const list = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: list.map((m) => (m.id === newMsgId ? { ...m, status: 'delivered' } : m)),
        };
      });
    }, 600);

    setTimeout(() => {
      setMessagesMap((prev) => {
        const list = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: list.map((m) => (m.id === newMsgId ? { ...m, status: 'read' } : m)),
        };
      });
    }, 1400);

    // If it was a whisper, let's trigger an automatic witty whisper reply from the target after 2.5s!
    if (isWhisper && whisperTargetUsers.length > 0) {
      const recipient = whisperTargetUsers[0];
      setTimeout(() => {
        triggerSimulatedWhisperResponse(activeChatId, recipient, newMsg);
      }, 2400);
    }
  };

  const triggerSimulatedWhisperResponse = (
    chatId: string,
    recipient: User,
    originalMsg: Message
  ) => {
    // Show typing indicator
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, typingUsers: [...c.typingUsers, recipient.id] } : c
      )
    );

    setTimeout(() => {
      const whisperReplies = [
        `Got it! Whispering right back inside the group thread. Super clean how Maya & others can't see this 🤫`,
        `Received privately! Agree, let's keep this between us until we finalize the details.`,
        `100% on board. Love this in-thread private channel feature—no need to switch to 1-on-1 DMs!`,
        `Haha perfect, staying discrete. Sending you the file link shortly.`,
      ];
      const replyText =
        whisperReplies[Math.floor(Math.random() * whisperReplies.length)];

      const now = new Date();
      const replyMsg: Message = {
        id: `msg-${Date.now()}`,
        chatId: chatId,
        senderId: recipient.id,
        content: replyText,
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        type: 'whisper',
        reactions: {},
        replyTo: {
          id: originalMsg.id,
          senderName: currentUser.name,
          text: originalMsg.content.substring(0, 60),
          isWhisper: true,
        },
        whisper: {
          isWhisper: true,
          targetUserIds: [recipient.id, currentUser.id],
          targetNames: [recipient.name, currentUser.name],
          stealthLevel: 'stealth',
        },
      };

      setMessagesMap((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), replyMsg],
      }));

      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                lastMessage: replyMsg,
                typingUsers: c.typingUsers.filter((id) => id !== recipient.id),
              }
            : c
        )
      );
    }, 1800);
  };

  const triggerSimulatedWhisperReply = (targetUserId?: string) => {
    if (!activeChatId) return;
    const target =
      allUsers.find((u) => u.id === (targetUserId || 'user-liam')) || allUsers[1];
    
    // Simulate user sending whisper to current user
    const prompts = [
      `Hey ${currentUser.name.split(' ')[0]}, secret whisper: Check the metrics dashboard when you can, numbers are through the roof!`,
      `Private whisper just for you: What's our backup plan if the deploy gets pushed to Monday?`,
      `Quick discreet check-in: Are we ready to present the new design to Sophia?`,
    ];
    const text = prompts[Math.floor(Math.random() * prompts.length)];

    const now = new Date();
    const whisperMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChatId,
      senderId: target.id,
      content: text,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
      type: 'whisper',
      reactions: {},
      whisper: {
        isWhisper: true,
        targetUserIds: [target.id, currentUser.id],
        targetNames: [target.name, currentUser.name],
        stealthLevel: 'stealth',
      },
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), whisperMsg],
    }));

    setChats((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, lastMessage: whisperMsg } : c))
    );
  };

  const triggerSimulatedPublicReply = () => {
    if (!activeChatId) return;
    const available = allUsers.filter((u) => u.id !== currentUser.id);
    const sender = available[Math.floor(Math.random() * available.length)];

    const publicReplies = [
      'Just tested the latest build, the animations feel buttery smooth!',
      'All unit tests passing on staging branch now. Ready for review.',
      'Looks awesome! Shall we do a quick sync before lunch?',
      'Awesome work everyone! Almost at the finish line 🚀',
    ];
    const text = publicReplies[Math.floor(Math.random() * publicReplies.length)];

    const now = new Date();
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChatId,
      senderId: sender.id,
      content: text,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
      type: 'text',
      reactions: { '👍': [currentUser.id] },
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    setChats((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, lastMessage: newMsg } : c))
    );
  };

  const addReaction = (messageId: string, emoji: string) => {
    if (!activeChatId) return;
    setMessagesMap((prev) => {
      const list = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: list.map((msg) => {
          if (msg.id !== messageId) return msg;
          const reactions = { ...msg.reactions };
          const existingList = reactions[emoji] || [];
          if (existingList.includes(currentUser.id)) {
            // Remove user reaction
            reactions[emoji] = existingList.filter((uid) => uid !== currentUser.id);
            if (reactions[emoji].length === 0) delete reactions[emoji];
          } else {
            // Add user reaction
            reactions[emoji] = [...existingList, currentUser.id];
          }
          return { ...msg, reactions };
        }),
      };
    });
  };

  const votePoll = (messageId: string, optionId: string) => {
    if (!activeChatId) return;
    setMessagesMap((prev) => {
      const list = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: list.map((msg) => {
          if (msg.id !== messageId || !msg.poll) return msg;
          const poll = msg.poll;
          const updatedOptions = poll.options.map((opt) => {
            const hasVoted = opt.voterIds.includes(currentUser.id);
            if (opt.id === optionId) {
              return {
                ...opt,
                voterIds: hasVoted
                  ? opt.voterIds.filter((id) => id !== currentUser.id)
                  : [...opt.voterIds, currentUser.id],
              };
            }
            if (!poll.isMultipleChoice && !hasVoted) {
              // Remove vote from other options if single choice
              return {
                ...opt,
                voterIds: opt.voterIds.filter((id) => id !== currentUser.id),
              };
            }
            return opt;
          });
          return {
            ...msg,
            poll: {
              ...poll,
              options: updatedOptions,
            },
          };
        }),
      };
    });
  };

  const toggleStarMessage = (messageId: string) => {
    if (!activeChatId) return;
    setMessagesMap((prev) => {
      const list = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: list.map((msg) =>
          msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
        ),
      };
    });
  };

  const deleteMessage = (messageId: string, forEveryone: boolean) => {
    if (!activeChatId) return;
    setMessagesMap((prev) => {
      const list = prev[activeChatId] || [];
      if (forEveryone) {
        return {
          ...prev,
          [activeChatId]: list.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  content: '🚫 This message was deleted',
                  type: 'system',
                  mediaUrl: undefined,
                  voiceNote: undefined,
                  poll: undefined,
                }
              : msg
          ),
        };
      }
      return {
        ...prev,
        [activeChatId]: list.filter((msg) => msg.id !== messageId),
      };
    });
  };

  const setChatTheme = (chatId: string, theme: ChatTheme) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, theme } : c)));
  };

  const setWhisperPrivacySetting = (chatId: string, setting: 'ghost' | 'notice') => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, whisperPrivacySetting: setting } : c))
    );
  };

  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    if (statusStories[index]) {
      markStorySeen(statusStories[index].id);
    }
  };

  const closeStory = () => setActiveStoryIndex(null);

  const markStorySeen = (storyId: string) => {
    setStatusStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, seen: true } : s))
    );
  };

  const createStory = (caption: string, bgColor: string) => {
    const newStory: StatusStory = {
      id: `story-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatarBg: currentUser.avatarBg,
      caption,
      timestamp: 'Just now',
      seen: false,
      mediaType: 'text',
      bgColor,
    };
    setStatusStories((prev) => [newStory, ...prev]);
  };

  const startCall = (chatId: string, type: 'audio' | 'video') => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;
    setCallSession({
      id: `call-${Date.now()}`,
      chatId,
      chatName: chat.name,
      type,
      status: 'ringing',
      participants: chat.members,
      duration: 0,
      isMuted: false,
      isVideoOff: false,
    });

    // Simulate answer after 2.5s
    setTimeout(() => {
      setCallSession((prev) => (prev ? { ...prev, status: 'connected' } : null));
    }, 2500);
  };

  const endCall = () => {
    setCallSession(null);
  };

  const toggleMuteCall = () => {
    setCallSession((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  };

  const toggleVideoCall = () => {
    setCallSession((prev) => (prev ? { ...prev, isVideoOff: !prev.isVideoOff } : null));
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        allUsers,
        setCurrentUser,
        chats,
        activeChatId,
        activeChat,
        setActiveChatId,
        messages,
        whisperFilter,
        setWhisperFilter,
        whisperTargetUsers,
        isWhisperModeActive,
        setWhisperMode,
        toggleWhisperForUser,
        clearWhisperMode,
        stealthLevel,
        setStealthLevel,
        replyingTo,
        setReplyingTo,
        searchQuery,
        setSearchQuery,
        sendMessage,
        addReaction,
        votePoll,
        toggleStarMessage,
        deleteMessage,
        setChatTheme,
        setWhisperPrivacySetting,
        statusStories,
        activeStoryIndex,
        openStory,
        closeStory,
        markStorySeen,
        createStory,
        callSession,
        startCall,
        endCall,
        toggleMuteCall,
        toggleVideoCall,
        infoDrawerOpen,
        setInfoDrawerOpen,
        triggerSimulatedWhisperReply,
        triggerSimulatedPublicReply,
        showWhisperExplainer,
        setShowWhisperExplainer,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};

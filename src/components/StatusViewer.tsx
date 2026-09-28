import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Heart } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const StatusViewer: React.FC = () => {
  const { statusStories, activeStoryIndex, closeStory, openStory, sendMessage } = useChat();
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');

  const currentStory = activeStoryIndex !== null ? statusStories[activeStoryIndex] : null;

  useEffect(() => {
    if (activeStoryIndex === null) return;
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story if available
          if (activeStoryIndex < statusStories.length - 1) {
            openStory(activeStoryIndex + 1);
          } else {
            closeStory();
          }
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, statusStories.length]);

  if (activeStoryIndex === null || !currentStory) return null;

  const handleNext = () => {
    if (activeStoryIndex < statusStories.length - 1) {
      openStory(activeStoryIndex + 1);
    } else {
      closeStory();
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      openStory(activeStoryIndex - 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    // Sends as a message in the direct chat with the story owner
    sendMessage(`Replied to story: "${replyText.trim()}"`);
    setReplyText('');
    closeStory();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl select-none">
      <div className="relative w-full max-w-md h-[92vh] max-h-[780px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800">
        {/* Top Progress Segment Bars */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 space-y-3 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-1.5 w-full">
            {statusStories.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{
                    width:
                      idx < activeStoryIndex
                        ? '100%'
                        : idx === activeStoryIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full ${currentStory.userAvatarBg} flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/40`}
              >
                {currentStory.userName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">{currentStory.userName}</h4>
                <p className="text-[11px] text-white/70">{currentStory.timestamp}</p>
              </div>
            </div>

            <button
              onClick={closeStory}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story Content Canvas */}
        <div
          className={`flex-1 flex items-center justify-center p-8 bg-gradient-to-br ${currentStory.bgColor} relative cursor-pointer`}
          onClick={handleNext}
        >
          {/* Navigation Click zones */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white hover:bg-black/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white hover:bg-black/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-xs text-center">
            <p className="text-2xl font-bold text-white leading-relaxed tracking-tight drop-shadow-md">
              "{currentStory.caption}"
            </p>
          </div>
        </div>

        {/* Bottom Reply Bar */}
        <div className="p-4 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center gap-2">
          <form onSubmit={handleSendReply} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Reply to ${currentStory.userName.split(' ')[0]}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white/10 border border-white/15 rounded-full text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white rounded-full transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              sendMessage(`❤️ loved your story`);
              closeStory();
            }}
            className="p-2.5 text-white/80 hover:text-rose-400 hover:bg-white/10 rounded-full transition-colors"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

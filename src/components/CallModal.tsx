import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, Maximize2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const CallModal: React.FC = () => {
  const { callSession, endCall, toggleMuteCall, toggleVideoCall } = useChat();

  if (!callSession) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl h-[520px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Info Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 z-10 flex items-center justify-between bg-gradient-to-b from-slate-950/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base leading-tight">
                {callSession.chatName}
              </h3>
              <p className="text-xs text-emerald-400 font-mono">
                {callSession.status === 'ringing'
                  ? 'Connecting secure end-to-end line...'
                  : `In Call · ${formatDuration(callSession.duration)}`}
              </p>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Video / Visual Stage */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative">
          {callSession.type === 'video' && !callSession.isVideoOff ? (
            <div className="grid grid-cols-2 gap-4 w-full h-full pt-16 pb-12">
              <div className="relative rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center justify-center overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-2xl font-bold mb-3 ring-4 ring-indigo-500/20">
                  AR
                </div>
                <span className="text-xs font-medium text-slate-200">You (Alex Rivera)</span>
                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-emerald-400 font-mono">
                  HD 1080p
                </div>
              </div>

              <div className="relative rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center justify-center overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white text-2xl font-bold mb-3 ring-4 ring-emerald-500/20">
                  LC
                </div>
                <span className="text-xs font-medium text-slate-200">Liam Chen</span>
                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-emerald-400 font-mono">
                  Connected
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                  {callSession.chatName.substring(0, 2).toUpperCase()}
                </div>
                {callSession.status === 'ringing' && (
                  <span className="absolute -inset-2 rounded-full border-2 border-emerald-500/50 animate-ping"></span>
                )}
              </div>
              <h4 className="text-xl font-bold text-white mb-1">{callSession.chatName}</h4>
              <p className="text-sm text-slate-400">
                {callSession.status === 'ringing'
                  ? 'Ringing...'
                  : `${callSession.type === 'video' ? 'Video' : 'Voice'} Call in progress`}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="p-6 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-center gap-4">
          <button
            onClick={toggleMuteCall}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              callSession.isMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={callSession.isMuted ? 'Unmute' : 'Mute'}
          >
            {callSession.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {callSession.type === 'video' && (
            <button
              onClick={toggleVideoCall}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                callSession.isVideoOff
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={callSession.isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {callSession.isVideoOff ? (
                <VideoOff className="w-5 h-5" />
              ) : (
                <Video className="w-5 h-5" />
              )}
            </button>
          )}

          <button
            onClick={endCall}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

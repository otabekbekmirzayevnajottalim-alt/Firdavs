
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isHackerMode?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isHackerMode }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-5 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start message-enter`}>
      {/* Avatar / Icon */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 overflow-hidden ${
        isUser 
          ? (isHackerMode ? 'bg-red-600 shadow-[0_0_10px_#ff0000]' : 'bg-[#1a73e8]') 
          : (isHackerMode ? 'bg-black border border-red-600 shadow-[0_0_15px_#ff0000]' : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500')
      }`}>
        {isUser ? (
          <span className={`text-xs font-bold ${isHackerMode ? 'text-black' : 'text-white'}`}>U</span>
        ) : (
          isHackerMode ? (
            <span className="text-red-600 font-bold hacker-font text-[10px]">AI</span>
          ) : (
            <div className="w-full h-full gemini-sparkle scale-75" />
          )
        )}
      </div>
      
      {/* Content Area */}
      <div className={`flex-1 flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
        <div className={`text-[16px] leading-relaxed whitespace-pre-wrap transition-all ${
          isUser 
            ? (isHackerMode 
                ? 'px-5 py-3 rounded-2xl bg-red-950/20 text-red-500 border border-red-900/50 shadow-[0_0_10px_rgba(255,0,0,0.2)] hacker-font' 
                : 'px-5 py-3 rounded-2xl bg-[#f0f4f9] text-[#1f1f1f]') 
            : (isHackerMode 
                ? 'bg-[#0a0000] text-red-600 border border-red-600/30 px-5 py-4 rounded-2xl shadow-[inset_0_0_10px_rgba(255,0,0,0.1)] hacker-font' 
                : 'text-[#1f1f1f] pt-1.5')
        }`}>
          {isHackerMode && !isUser && <span className="block text-[10px] opacity-40 mb-2">[RECEIVED_DATA_STREAM]</span>}
          {message.content}
          {isHackerMode && !isUser && <span className="inline-block w-2 h-4 bg-red-600 ml-1 animate-pulse align-middle" />}
        </div>
        
        {/* Media (Images/Video) */}
        {message.mediaUrl && (
          <div className={`mt-4 rounded-3xl overflow-hidden shadow-md border ${isHackerMode ? 'border-red-900 shadow-[0_0_20px_rgba(255,0,0,0.3)]' : 'border-gray-100'} max-w-full`}>
            {message.type === 'image' ? (
              <img src={message.mediaUrl} alt="AI Generated" className="w-full h-auto object-cover max-h-[600px] transition-transform hover:scale-[1.02] duration-500" />
            ) : (
              <video src={message.mediaUrl} controls className="w-full max-h-[600px]" />
            )}
          </div>
        )}
        
        {/* Timestamp */}
        <span className={`mt-2 px-1 text-[11px] font-medium tracking-wide ${isHackerMode ? 'text-red-900 hacker-font' : 'text-gray-400'}`}>
          {isHackerMode ? `TS_${message.timestamp}` : new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

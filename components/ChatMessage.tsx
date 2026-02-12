
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isHackerMode?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isHackerMode }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-500 ${
        isUser 
          ? (isHackerMode ? 'bg-red-800 text-black shadow-[0_0_10px_#ff0000]' : 'bg-blue-600 text-white') 
          : (isHackerMode ? 'bg-black border border-red-600 text-red-600 shadow-[0_0_10px_#ff0000]' : 'bg-gradient-to-tr from-blue-500 to-purple-600')
      }`}>
        {isUser ? 'U' : (isHackerMode ? 'Σ' : 'G')}
      </div>
      
      <div className={`flex-1 space-y-2 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block px-5 py-3 rounded-3xl text-[15px] leading-relaxed transition-all duration-500 ${
          isUser 
            ? (isHackerMode ? 'bg-red-950/20 text-red-500 border border-red-900/50 hacker-font rounded-tr-none' : 'bg-blue-50 text-gray-800 rounded-tr-none') 
            : (isHackerMode ? 'text-red-600 hacker-font' : 'text-gray-800')
        }`}>
          {isHackerMode && !isUser ? `> ${message.content}` : message.content}
        </div>
        
        {message.mediaUrl && (
          <div className={`mt-4 rounded-2xl overflow-hidden shadow-md border transition-all duration-500 max-w-lg ${
            isHackerMode ? 'border-red-600 shadow-[0_0_20px_rgba(255,0,0,0.3)]' : 'border-gray-100'
          }`}>
            {message.type === 'image' && (
              <img 
                src={message.mediaUrl} 
                alt="Generated content" 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            )}
            {message.type === 'video' && (
              <video 
                src={message.mediaUrl} 
                controls 
                className="w-full"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

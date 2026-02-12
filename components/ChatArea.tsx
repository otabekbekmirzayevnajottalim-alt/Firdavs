
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  isHackerMode?: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading, isHackerMode }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
        <div className="max-w-2xl w-full">
          <h1 className={`text-5xl font-semibold mb-12 transition-all ${
            isHackerMode ? 'neon-red-text hacker-font' : 'animated-gradient-text'
          }`}>
            {isHackerMode ? '> HOW_CAN_I_SERVE_THE_SHADOW?' : 'Qanday yordam bera olaman?'}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: isHackerMode ? "CODE_INJECTION" : "Kod yozish", icon: "💻", prompt: "React'da timer komponenti yozib ber" },
              { title: isHackerMode ? "GENERATE_VISUAL" : "Rasm yaratish", icon: "🎨", prompt: "Futuristik shahar rasmini yarat" },
              { title: isHackerMode ? "SEARCH_DATA" : "Ma'lumot topish", icon: "🔍", prompt: "Eng baland tog' haqida ma'lumot ber" },
              { title: isHackerMode ? "SHADOW_IDEAS" : "G'oyalar", icon: "💡", prompt: "YouTube kanal uchun 5ta g'oya ber" }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-3xl cursor-pointer transition-all border group ${
                  isHackerMode 
                    ? 'bg-red-950/10 hover:bg-red-900/20 border-red-900/30' 
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-100'
                }`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className={`font-medium ${isHackerMode ? 'text-red-500 hacker-font' : 'text-gray-700'}`}>{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-12">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} isHackerMode={isHackerMode} />
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className={`w-8 h-8 rounded-full animate-spin ${
              isHackerMode ? 'bg-red-600 shadow-[0_0_15px_#ff0000]' : 'bg-gradient-to-tr from-blue-400 to-purple-500'
            }`} />
            <div className="space-y-2 flex-1">
              <div className={`h-4 rounded-full w-3/4 animate-pulse ${isHackerMode ? 'bg-red-950/30' : 'bg-gray-100'}`} />
              <div className={`h-4 rounded-full w-1/2 animate-pulse ${isHackerMode ? 'bg-red-950/30' : 'bg-gray-100'}`} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

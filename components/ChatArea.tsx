
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
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full text-left space-y-6">
          <h1 className={`text-5xl font-medium ${isHackerMode ? 'text-green-500 font-mono' : 'gemini-gradient'}`}>
            {isHackerMode ? 'ACCESS_GRANTED' : 'Salom, foydalanuvchi'}
          </h1>
          <h2 className={`text-5xl font-medium ${isHackerMode ? 'text-green-700 font-mono' : 'text-[#444746]'}`}>
            {isHackerMode ? '> SHADOW_AI_ONLINE' : 'Bugun sizga qanday yordam bera olaman?'}
          </h2>
        </div>
        
        {/* Placeholder suggestion cards */}
        {!isHackerMode && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12 max-w-4xl w-full">
            {[
              { title: "Sayohat rejasini tuzish", desc: "Seul bo'ylab 3 kunlik reja", icon: "✈️" },
              { title: "Kod yozish", desc: "Python'da qisqa o'yin yarating", icon: "💻" },
              { title: "Xat yozish", desc: "Ishga kirish uchun xat", icon: "✉️" },
              { title: "Maslahat olish", desc: "Sog'lom ovqatlanish bo'yicha", icon: "🍎" }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#1e1f20] hover:bg-[#28292a] p-4 rounded-xl cursor-pointer transition-colors flex flex-col justify-between min-h-[160px]">
                <p className="text-sm text-gray-200">{item.title}</p>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-gray-400">{item.desc}</span>
                  <span className="p-2 bg-[#131314] rounded-full text-lg">{item.icon}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto px-4 py-8 ${isHackerMode ? 'font-mono' : ''}`}>
      <div className="max-w-3xl mx-auto space-y-12">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} isHackerMode={isHackerMode} />
        ))}
        {isLoading && (
          <div className="flex gap-4">
             <div className={`w-8 h-8 rounded-full shrink-0 animate-pulse ${isHackerMode ? 'bg-green-900' : 'bg-[#1e1f20]'}`} />
             <div className="space-y-2 flex-1">
                <div className={`h-4 rounded w-3/4 animate-pulse ${isHackerMode ? 'bg-green-900' : 'bg-[#1e1f20]'}`} />
                <div className={`h-4 rounded w-1/2 animate-pulse ${isHackerMode ? 'bg-green-900' : 'bg-[#1e1f20]'}`} />
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

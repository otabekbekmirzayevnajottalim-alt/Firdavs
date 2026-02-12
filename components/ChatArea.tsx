
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  isHackerMode?: boolean;
  onSelectPrompt?: (text: string, type: 'text' | 'image' | 'video') => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading, isHackerMode, onSelectPrompt }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    const suggestions = [
      { 
        title: "Kod yozish", 
        desc: "Dasturlash bo'yicha yordam va kod namunalar",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
        ),
        color: "from-blue-500 via-cyan-400 to-blue-600",
        prompt: "Menga Python tilida Telegram bot yaratish uchun asosiy kodni yozib ber",
        type: 'text' as const
      },
      { 
        title: "Rasm yaratish", 
        desc: "Matnli tavsif asosida sifatli rasmlar",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        ),
        color: "from-purple-500 via-pink-500 to-rose-500",
        prompt: "Futuristik uslubdagi Toshkent shahri manzarasi, neon chiroqlar bilan",
        type: 'image' as const
      },
      { 
        title: "Ma'lumot topish", 
        desc: "Har qanday mavzuda keng qamrovli javoblar",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        ),
        color: "from-green-500 via-emerald-400 to-teal-500",
        prompt: "Koinot qanday kengayadi va qorong'u energiya nima?",
        type: 'text' as const
      },
      { 
        title: "G'oyalar", 
        desc: "Kreativ fikrlar va strategik rejalar",
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        ),
        color: "from-orange-500 via-amber-400 to-yellow-500",
        prompt: "IT sohasida o'zini rivojlantirmoqchi bo'lganlar uchun 5 ta foydali maslahat",
        type: 'text' as const
      }
    ];

    return (
      <div className="flex-1 flex flex-col items-center justify-start md:justify-center p-8 text-center relative overflow-y-auto">
        <div className="max-w-4xl w-full pt-20 pb-12 flex flex-col items-center">
          
          {/* 4-pointed star Logo */}
          <div className="mb-10 relative">
            <div className={`w-20 h-20 star-shape transition-all duration-700 animate-bounce-slow animated-gradient-box shadow-2xl ${
              isHackerMode ? 'bg-red-600 scale-110 shadow-[0_0_40px_rgba(255,0,0,0.6)]' : ''
            }`} />
            {!isHackerMode && (
              <div className="absolute inset-0 bg-blue-400/20 blur-3xl -z-10 animate-pulse" />
            )}
          </div>

          {/* Larger Greeting Text */}
          <div className="mb-14 text-center w-full">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight leading-[1.1]">
              <span className="animated-gradient-text">Bugun sizga qanday yordam bera olaman?</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {suggestions.map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => onSelectPrompt?.(item.prompt, item.type)}
                className="suggestion-card flex flex-col justify-between p-5 bg-[#f0f4f9] hover:bg-[#e1e6ed] rounded-[2rem] transition-all text-left h-[180px] group border border-transparent hover:border-blue-200 active:scale-95 shadow-sm"
              >
                <div className="flex flex-col gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-md ${
                    isHackerMode 
                      ? 'bg-red-900/20 text-red-500 border border-red-900/50' 
                      : `bg-gradient-to-br ${item.color} text-white`
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#1f1f1f] mb-1">{item.title}</h3>
                    <p className="text-[12px] text-gray-500 leading-snug line-clamp-2 font-medium">{item.desc}</p>
                  </div>
                </div>
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <span className="text-blue-600 text-lg font-bold">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto px-6 py-8 ${isHackerMode ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-3xl mx-auto space-y-12">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} isHackerMode={isHackerMode} />
        ))}
        {isLoading && (
          <div className="flex gap-5 message-enter">
             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center shrink-0 animate-pulse shadow-sm">
               <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
             </div>
            <div className="space-y-4 flex-1 pt-1">
              <div className="h-3.5 bg-[#f0f4f9] rounded-full w-full animate-pulse" />
              <div className="h-3.5 bg-[#f0f4f9] rounded-full w-[90%] animate-pulse" />
              <div className="h-3.5 bg-[#f0f4f9] rounded-full w-[60%] animate-pulse" />
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-20" />
      </div>
    </div>
  );
};

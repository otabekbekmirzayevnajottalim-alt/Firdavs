
import React from 'react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isHackerMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, currentId, onSelect, onNewChat, onDelete, isOpen, onToggle, isHackerMode 
}) => {
  const bgClass = isHackerMode ? 'bg-[#050000] border-r border-red-900/30' : 'bg-[#f0f4f9]';
  const itemHoverClass = isHackerMode ? 'hover:bg-red-900/10 text-red-700' : 'hover:bg-[#e1e6ed] text-[#1f1f1f]';
  const itemActiveClass = isHackerMode ? 'bg-red-900/20 text-red-500 border border-red-500/30' : 'bg-[#dde3ea] text-[#1f1f1f] font-medium';

  return (
    <div className={`flex flex-col h-full transition-all duration-300 ease-in-out ${isOpen ? 'w-[280px]' : 'w-0 overflow-hidden'} ${bgClass} z-30`}>
      <div className="p-4 flex flex-col h-full">
        <button 
          onClick={onToggle} 
          className={`p-3 mb-6 rounded-full self-start transition-colors ${isHackerMode ? 'hover:bg-red-900/20' : 'hover:bg-[#e1e6ed]'}`}
          title="Menyuni yopish"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isHackerMode ? '#ff0000' : '#444746'} strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>

        <button 
          onClick={onNewChat}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-full font-medium transition-all mb-8 group shadow-sm ${
            isHackerMode 
              ? 'bg-red-950/20 border border-red-900/50 text-red-500 hover:bg-red-900/30 hacker-font' 
              : 'bg-[#dde3ea] text-[#444746] hover:bg-[#d3dae3]'
          }`}
        >
          <span className={`text-2xl transition-transform group-hover:rotate-90 ${isHackerMode ? 'text-red-600' : 'text-[#1a73e8]'}`}>+</span>
          <span className="text-sm">{isHackerMode ? 'NEW_LINK' : 'Yangi suhbat'}</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-1">
          <p className={`px-4 text-[13px] font-semibold mb-3 ${isHackerMode ? 'text-red-900 hacker-font' : 'text-[#1f1f1f]'}`}>
            {isHackerMode ? 'ACTIVE_TERMINALS' : 'Oxirgi suhbatlar'}
          </p>
          {sessions.map((session) => (
            <div 
              key={session.id}
              className={`group flex items-center justify-between px-4 py-2.5 cursor-pointer rounded-full transition-all ${
                currentId === session.id 
                  ? itemActiveClass 
                  : itemHoverClass
              }`}
              onClick={() => onSelect(session.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 opacity-70">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                <span className={`text-[14px] truncate ${isHackerMode ? 'hacker-font' : ''}`}>
                  {isHackerMode ? `> ${session.title}` : session.title}
                </span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(session.id);
                }}
                className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-black/5 transition-all ${isHackerMode ? 'hover:text-red-400' : 'hover:text-red-500'}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          ))}
        </div>

        <div className={`pt-4 text-center mt-auto flex flex-col items-center justify-center gap-1 ${isHackerMode ? 'border-t border-red-900/30 text-red-900 hacker-font' : 'text-[#444746]'}`}>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isHackerMode ? 'bg-red-600 animate-pulse' : 'bg-green-500'}`} />
            <span className="text-[10px]">{isHackerMode ? 'SECURE_API_ACTIVE' : 'NeyroPlan AI v3.0'}</span>
          </div>
          {isHackerMode && <div className="text-[7px] opacity-30">[VAULT_ACCESS_GRANTED]</div>}
        </div>
      </div>
    </div>
  );
};


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
  const bgClass = isHackerMode ? 'bg-[#050000] border-red-900/30' : 'bg-[#f0f4f9] border-gray-200';
  const itemHoverClass = isHackerMode ? 'hover:bg-red-900/10 text-red-700' : 'hover:bg-gray-200 text-gray-600';
  const itemActiveClass = isHackerMode ? 'bg-red-900/20 text-red-500 border border-red-500/30' : 'bg-blue-100/50 text-blue-700';

  return (
    <div className={`flex flex-col border-r transition-all duration-300 ${isOpen ? 'w-[300px]' : 'w-0 overflow-hidden'} ${bgClass}`}>
      <div className="p-4 flex flex-col h-full">
        <button onClick={onToggle} className={`p-2 mb-4 rounded-full self-start transition-colors ${isHackerMode ? 'hover:bg-red-900/20' : 'hover:bg-gray-200'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isHackerMode ? '#ff0000' : '#444746'} strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>

        <button 
          onClick={onNewChat}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all mb-8 shadow-sm border group ${
            isHackerMode 
              ? 'bg-red-950/20 border-red-900/50 text-red-500 hover:bg-red-900/30 hacker-font' 
              : 'bg-white/50 border-gray-100 text-gray-700 hover:bg-white'
          }`}
        >
          <span className={`text-2xl transition-transform group-hover:scale-110 ${isHackerMode ? 'text-red-600' : 'text-blue-600'}`}>+</span>
          <span className="text-sm">{isHackerMode ? 'INITIALIZE_NEW_LINK' : 'Yangi chat'}</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-1">
          <p className={`px-4 text-[11px] font-semibold uppercase tracking-wider mb-2 ${isHackerMode ? 'text-red-900 hacker-font' : 'text-gray-500'}`}>
            {isHackerMode ? 'ACTIVE_TERMINALS' : 'Suhbatlar'}
          </p>
          {sessions.map((session) => (
            <div 
              key={session.id}
              className={`group flex items-center justify-between px-4 py-3 cursor-pointer rounded-2xl transition-all ${
                currentId === session.id 
                  ? itemActiveClass 
                  : itemHoverClass
              }`}
              onClick={() => onSelect(session.id)}
            >
              <span className={`text-sm truncate pr-4 font-medium ${isHackerMode ? 'hacker-font' : ''}`}>
                {isHackerMode ? `> ${session.title}` : session.title}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(session.id);
                }}
                className={`opacity-0 group-hover:opacity-100 p-1 transition-colors ${isHackerMode ? 'hover:text-red-400' : 'hover:text-red-500'}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          ))}
        </div>

        <div className={`pt-4 border-t text-center ${isHackerMode ? 'border-red-900/30 text-red-900 hacker-font text-[9px]' : 'border-gray-200 text-gray-400 text-[10px]'}`}>
          {isHackerMode ? 'SYSTEM_STATUS: SECURE' : '© 2024 NeyroPlan AI'}
        </div>
      </div>
    </div>
  );
};

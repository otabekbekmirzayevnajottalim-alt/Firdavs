
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
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, currentId, onSelect, onNewChat, onDelete, isOpen, onToggle 
}) => {
  return (
    <div className={`flex flex-col bg-[#1e1f20] transition-all duration-300 ${isOpen ? 'w-[300px]' : 'w-0 overflow-hidden'}`}>
      <div className="p-4 flex flex-col h-full">
        {/* Toggle Button */}
        <button 
          onClick={onToggle}
          className="p-2 hover:bg-[#28292a] rounded-full text-gray-400 self-start mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* New Chat Button */}
        <button 
          onClick={onNewChat}
          className="flex items-center gap-3 bg-[#131314] hover:bg-[#28292a] text-gray-400 p-3 rounded-full mb-8 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="text-sm font-medium">Yangi suhbat</span>
        </button>

        {/* History List */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 px-3 mb-2 uppercase tracking-wider">Yaqindagi</h3>
          <div className="space-y-1">
            {sessions.map((session) => (
              <div 
                key={session.id}
                className={`group flex items-center gap-3 p-3 rounded-full cursor-pointer transition-colors ${
                  currentId === session.id ? 'bg-[#37393b] text-white' : 'hover:bg-[#28292a] text-gray-300'
                }`}
                onClick={() => onSelect(session.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h9m-9 3h3m-6.75 2.25h13.5A2.25 2.25 0 0021 14.25V6.25A2.25 2.25 0 0018.75 4H5.25A2.25 2.25 0 003 6.25v8.25A2.25 2.25 0 005.25 16.5z" />
                </svg>
                <span className="text-sm truncate flex-1">{session.title}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded-full transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Menu */}
        <div className="pt-4 mt-4 border-t border-[#3c3c3c] space-y-1">
          <button className="w-full flex items-center gap-3 p-3 hover:bg-[#28292a] rounded-full text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Yordam
          </button>
          <button className="w-full flex items-center gap-3 p-3 hover:bg-[#28292a] rounded-full text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Faoliyat
          </button>
          <button className="w-full flex items-center gap-3 p-3 hover:bg-[#28292a] rounded-full text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            Sozlamalar
          </button>
        </div>
      </div>
    </div>
  );
};

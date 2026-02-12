
import React, { useRef, useEffect, useState } from 'react';

interface ChatInputProps {
  text: string;
  setText: (text: string) => void;
  onSend: (text: string, type?: 'text' | 'image' | 'video') => void;
  disabled: boolean;
  isHackerMode?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ text, setText, onSend, disabled, isHackerMode }) => {
  const [mode, setMode] = useState<'text' | 'image' | 'video'>('text');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text, mode);
      setText('');
      setMode('text');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  return (
    <div className={`relative transition-all duration-300 ${
      isHackerMode 
        ? 'bg-black border border-red-600 shadow-[0_0_15px_rgba(255,0,0,0.2)]' 
        : 'bg-[#f0f4f9] border border-transparent focus-within:bg-[#e1e6ed] shadow-sm hover:shadow-md'
    } rounded-[32px] overflow-hidden`}>
      <div className="flex items-end gap-1.5 px-6 py-3">
        {/* Hacker Indicator */}
        {isHackerMode && (
          <div className="mb-2 text-red-600 font-bold hacker-font text-sm animate-pulse mr-2">></div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isHackerMode ? "ENTER_COMMAND..." : "Savol yozing..."}
          rows={1}
          disabled={disabled}
          className={`flex-1 bg-transparent border-none focus:ring-0 py-2.5 resize-none max-h-[200px] text-[16px] outline-none ${
            isHackerMode ? 'text-red-500 placeholder-red-900 hacker-font' : 'text-[#1f1f1f] placeholder-[#444746]'
          }`}
        />

        {/* Send Button */}
        <div className="flex items-center mb-0.5">
          <button 
            onClick={handleSend}
            disabled={!text.trim() || disabled}
            className={`p-3 rounded-full transition-all ${
              isHackerMode 
                ? 'bg-red-600 text-black hover:bg-red-500 shadow-[0_0_10px_#ff0000] disabled:bg-red-900/30 disabled:shadow-none' 
                : 'text-[#1a73e8] hover:bg-black/5 disabled:opacity-20'
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mode Indicator Line */}
      {mode !== 'text' && (
        <div className={`h-1 animate-pulse ${isHackerMode ? 'bg-red-600' : 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500'}`} />
      )}
    </div>
  );
};


import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string, type?: 'text' | 'image' | 'video') => void;
  disabled: boolean;
  isHackerMode?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, isHackerMode }) => {
  const [text, setText] = useState('');
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
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const containerClass = isHackerMode 
    ? 'bg-red-950/10 border-red-600 shadow-[0_0_15px_rgba(255,0,0,0.2)]' 
    : 'bg-gray-100 border-transparent focus-within:bg-gray-50 focus-within:shadow-md focus-within:border-gray-200';

  const btnClass = (active: boolean) => isHackerMode
    ? (active ? 'bg-red-600 text-black shadow-[0_0_10px_#ff0000]' : 'bg-black text-red-900 border border-red-900 hover:border-red-600 hover:text-red-600')
    : (active ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-200');

  return (
    <div className={`relative rounded-[32px] p-2 transition-all border ${containerClass}`}>
      <div className="flex gap-2 mb-2 px-2">
        {['text', 'image', 'video'].map((m) => (
          <button 
            key={m}
            onClick={() => setMode(m as any)}
            className={`px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider transition-all ${
              isHackerMode ? 'hacker-font' : ''
            } ${btnClass(mode === m)}`}
          >
            {m === 'text' ? (isHackerMode ? 'LINK' : 'Chat') : m === 'image' ? (isHackerMode ? 'VISUAL' : 'Rasm') : (isHackerMode ? 'STREAM' : 'Video')}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-2 px-2 pb-1">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isHackerMode ? "> ENTER_COMMAND_PROMPT..." : (mode === 'text' ? "Xabar yozing..." : "Tavsif yozing...")}
          rows={1}
          disabled={disabled}
          className={`flex-1 bg-transparent border-none focus:ring-0 py-2 px-2 resize-none max-h-[200px] text-[15px] outline-none transition-colors ${
            isHackerMode ? 'text-red-500 hacker-font placeholder:text-red-900' : 'text-gray-800'
          }`}
        />

        <button 
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className={`p-3 rounded-full transition-all shrink-0 ${
            isHackerMode 
              ? 'bg-red-600 text-black shadow-[0_0_15px_#ff0000] hover:bg-red-500 disabled:opacity-30' 
              : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-20'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isHackerMode ? (
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
            ) : (
              <>
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
};

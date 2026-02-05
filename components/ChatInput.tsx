
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

  const modeStyles = {
    text: isHackerMode ? 'border-green-800' : 'border-transparent',
    image: isHackerMode ? 'border-green-400' : 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    video: isHackerMode ? 'border-red-400' : 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 justify-center mb-1">
        <button 
          onClick={() => setMode('text')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            mode === 'text' 
              ? (isHackerMode ? 'bg-green-600 text-black' : 'bg-blue-600 text-white') 
              : (isHackerMode ? 'bg-black text-green-700 hover:text-green-500' : 'bg-[#1e1f20] text-gray-400 hover:text-gray-200')
          }`}
        >
          {isHackerMode ? 'ROOT_SHELL' : 'Chat'}
        </button>
        <button 
          onClick={() => setMode('image')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            mode === 'image' 
              ? (isHackerMode ? 'bg-green-400 text-black' : 'bg-purple-600 text-white') 
              : (isHackerMode ? 'bg-black text-green-700 hover:text-green-500' : 'bg-[#1e1f20] text-gray-400 hover:text-gray-200')
          }`}
        >
          {isHackerMode ? 'RENDER_IMG' : 'Rasm Yaratish'}
        </button>
        <button 
          onClick={() => setMode('video')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            mode === 'video' 
              ? (isHackerMode ? 'bg-red-400 text-black' : 'bg-red-600 text-white') 
              : (isHackerMode ? 'bg-black text-green-700 hover:text-green-500' : 'bg-[#1e1f20] text-gray-400 hover:text-gray-200')
          }`}
        >
          {isHackerMode ? 'GEN_VID' : 'Video Yaratish'}
        </button>
      </div>

      <div className={`rounded-[32px] p-2 pr-4 shadow-xl border-2 transition-all duration-300 ${isHackerMode ? 'bg-black' : 'bg-[#1e1f20]'} ${modeStyles[mode]} focus-within:ring-1 ${isHackerMode ? 'focus-within:ring-green-500' : 'focus-within:ring-gray-700'}`}>
        <div className="flex items-end gap-2 px-2">
          <button className={`p-3 rounded-full transition-colors ${isHackerMode ? 'hover:bg-green-950 text-green-500' : 'hover:bg-[#28292a] text-gray-300'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isHackerMode ? "sh-3.2# query_shadow_ai --input ..." : (mode === 'text' ? "Bu yerga so'rovingizni kiriting" : mode === 'image' ? "Qanday rasm chizib beray?" : "Qanday video yaratay?")}
            rows={1}
            disabled={disabled}
            className={`flex-1 bg-transparent border-none focus:ring-0 py-3 resize-none min-h-[48px] max-h-[200px] text-lg outline-none ${isHackerMode ? 'text-green-500 placeholder-green-900 font-mono' : 'text-gray-200 placeholder-gray-500'}`}
          />

          <div className="flex items-center gap-1 mb-1">
            <button className={`p-3 rounded-full transition-colors ${isHackerMode ? 'hover:bg-green-950 text-green-700' : 'hover:bg-[#28292a] text-gray-400'}`}>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
            </button>
            
            {(text.trim() || mode !== 'text') && (
              <button 
                onClick={handleSend}
                disabled={!text.trim() || disabled}
                className={`p-3 rounded-full text-white transition-all ml-1 shadow-md disabled:opacity-50 ${
                  isHackerMode 
                    ? 'bg-green-600 hover:bg-green-400 text-black' 
                    : (mode === 'text' ? 'bg-[#4285f4]' : mode === 'image' ? 'bg-purple-600' : 'bg-red-600')
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

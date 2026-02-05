
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
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser 
          ? (isHackerMode ? 'bg-green-900 text-green-400 border border-green-500' : 'bg-blue-600 text-white font-bold') 
          : (isHackerMode ? 'bg-black border border-green-500' : 'bg-[#1e1f20]')
      }`}>
        {isUser ? (
          isHackerMode ? '>' : 'U'
        ) : (
          isHackerMode ? (
            <span className="text-green-500 text-xs font-mono">#</span>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" fill="#4285F4" />
            </svg>
          )
        )}
      </div>
      
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block text-[16px] leading-7 whitespace-pre-wrap ${
          isUser 
            ? (isHackerMode ? 'text-green-300 border-r-2 border-green-500 pr-4' : 'bg-[#28292a] px-5 py-3 rounded-2xl text-gray-200') 
            : (isHackerMode ? 'text-green-500 font-mono bg-[#050a05] p-4 rounded-lg border-l border-green-800' : 'text-gray-200')
        }`}>
          {isHackerMode && !isUser && <span className="text-green-800 mr-2">[SYSTEM]:</span>}
          {message.content}
        </div>
        
        {message.mediaUrl && (
          <div className={`mt-4 rounded-xl overflow-hidden inline-block max-w-full border ${isHackerMode ? 'bg-black border-green-800' : 'bg-[#1e1f20] border-[#3c3c3c]'}`}>
            {message.type === 'image' && (
              <img 
                src={message.mediaUrl} 
                alt="Generated content" 
                className={`max-h-[400px] w-auto object-contain cursor-zoom-in ${isHackerMode ? 'sepia hue-rotate-[90deg] brightness-125' : ''}`}
                onClick={() => window.open(message.mediaUrl, '_blank')}
              />
            )}
            {message.type === 'video' && (
              <video 
                src={message.mediaUrl} 
                controls 
                autoPlay 
                loop
                className={`max-h-[400px] w-full ${isHackerMode ? 'sepia hue-rotate-[90deg]' : ''}`}
              />
            )}
          </div>
        )}

        {!isUser && !isHackerMode && (
          <div className="flex items-center gap-4 mt-4 text-gray-500 opacity-0 hover:opacity-100 transition-opacity">
            <button className="hover:text-gray-300">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 010-5.764c.259-.85 1.083-1.368 1.972-1.368h.908c.445 0 .72.498.523.898a8.963 8.963 0 00-.27.602" /></svg>
            </button>
            <button className="hover:text-gray-300">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ChatInput } from './components/ChatInput';
import { Message, ChatSession } from './types';
import { geminiService } from './services/gemini';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  
  const [isHackerMode, setIsHackerMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const [isPanicMode, setIsPanicMode] = useState(false);
  const [isUserActive, setIsUserActive] = useState(true);
  const activityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Activity tracking logic
  const resetActivityTimer = useCallback(() => {
    setIsUserActive(true);
    if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    
    // 5 soniyadan keyin tizim uyquga ketadi
    activityTimerRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, 5000);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resetActivityTimer);
    window.addEventListener('mousedown', resetActivityTimer);
    window.addEventListener('keydown', resetActivityTimer);
    window.addEventListener('touchstart', resetActivityTimer);
    
    resetActivityTimer();

    return () => {
      window.removeEventListener('mousemove', resetActivityTimer);
      window.removeEventListener('mousedown', resetActivityTimer);
      window.removeEventListener('keydown', resetActivityTimer);
      window.removeEventListener('touchstart', resetActivityTimer);
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    };
  }, [resetActivityTimer]);

  useEffect(() => {
    const saved = localStorage.getItem('gemini_sessions');
    if (saved) {
      let parsed = JSON.parse(saved);
      parsed = parsed.filter((s: ChatSession) => s.title !== 'SECRET_SESSION');
      setSessions(parsed);
      if (parsed.length > 0 && !currentSessionId) setCurrentSessionId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    const sessionsToSave = sessions.filter(s => s.title !== 'SECRET_SESSION');
    localStorage.setItem('gemini_sessions', JSON.stringify(sessionsToSave));
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const startNewChat = useCallback((isSpecial = false) => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: isSpecial ? 'SECRET_SESSION' : 'Yangi suhbat',
      messages: [],
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    return newId;
  }, []);

  const updateMessageInSession = (sessionId: string, messageId: string, updates: Partial<Message>) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId 
        ? {
            ...s,
            messages: s.messages.map(m => 
              m.id === messageId ? { ...m, ...updates } : m
            )
          }
        : s
    ));
  };

  const handleGenerate = async (text: string, type: 'text' | 'image' | 'video' = 'text') => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'model',
      content: '',
      type: type,
      timestamp: Date.now()
    };

    let targetId = currentSessionId;

    if (!targetId) {
      targetId = Date.now().toString();
      const newSession: ChatSession = {
        id: targetId,
        title: isHackerMode ? 'SECRET_SESSION' : 'Yangi suhbat',
        messages: [userMessage, aiMessage],
        updatedAt: Date.now()
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(targetId);
    } else {
      setSessions(prev => prev.map(s => 
        s.id === targetId 
          ? { ...s, messages: [...s.messages, userMessage, aiMessage], updatedAt: Date.now() }
          : s
      ));
    }

    try {
      if (type === 'image') {
        const imageUrl = await geminiService.generateImage(text);
        updateMessageInSession(targetId, aiMessageId, { mediaUrl: imageUrl, content: 'Rasm tayyor.' });
      } else if (type === 'video') {
        const videoUrl = await geminiService.generateVideo(text, setStatusMessage);
        updateMessageInSession(targetId, aiMessageId, { mediaUrl: videoUrl, content: 'Video tayyor.' });
      } else {
        let accumulatedContent = '';
        const history = currentSession ? [...currentSession.messages.slice(0, -1)] : [];
        const stream = geminiService.streamChat([...history, userMessage], text, isHackerMode);
        for await (const chunk of stream) {
          accumulatedContent += chunk;
          updateMessageInSession(targetId, aiMessageId, { content: accumulatedContent });
        }
        
        if (history.length === 0 && !isHackerMode) {
          const newTitle = await geminiService.generateTitle(text);
          setSessions(prev => prev.map(s => s.id === targetId ? { ...s, title: newTitle } : s));
        }
      }
    } catch (error: any) {
      console.error(error);
      updateMessageInSession(targetId, aiMessageId, { content: "Xatolik yuz berdi. Qayta urinib ko'ring." });
    } finally {
      setIsLoading(false);
      setStatusMessage(null);
    }
  };

  const handlePanicClick = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (clickCountRef.current === 3) {
      setIsPanicMode(false);
      setStatusMessage("Muvaffaqiyatli qaytdingiz");
      clickCountRef.current = 0;
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 600);
    }
  };

  const mainBgClass = isHackerMode ? 'hacker-mode' : 'bg-white';

  return (
    <div className={`flex h-screen w-full transition-all duration-700 ${mainBgClass} overflow-hidden relative`}>
      {isHackerMode && <div className="scanline" />}
      
      {/* Sleep Mode Overlay */}
      {!isUserActive && !isPanicMode && (
        <div className={`fixed inset-0 z-[1000] backdrop-blur-[20px] flex flex-col items-center justify-center transition-all duration-1000 animate-in fade-in ${isHackerMode ? 'bg-black/60' : 'bg-white/30'}`}>
          <div className={`flex flex-col items-center gap-6 p-12 rounded-[3rem] shadow-2xl border transition-all ${isHackerMode ? 'bg-black/80 border-red-600 shadow-[0_0_30px_rgba(255,0,0,0.3)]' : 'bg-white/60 border-white/40'}`}>
            <div className={`w-16 h-16 star-shape animate-bounce-slow ${isHackerMode ? 'bg-red-600 shadow-[0_0_20px_#ff0000]' : 'animated-gradient-box'}`} />
            <div className="space-y-2 text-center">
              <h2 className={`text-3xl font-bold ${isHackerMode ? 'text-red-600 hacker-glow hacker-font' : 'animated-gradient-text'}`}>
                {isHackerMode ? 'SYSTEM_SLEEP' : 'Tizim uyquda'}
              </h2>
              <p className={`font-medium ${isHackerMode ? 'text-red-900 hacker-font text-xs' : 'text-gray-500'}`}>
                {isHackerMode ? '[WAITING_FOR_ACTIVITY...]' : 'Faollashtirish uchun sichqonchani harakatlantiring'}
              </p>
            </div>
            <div className="flex gap-1.5">
              <div className={`w-2 h-2 rounded-full animate-bounce ${isHackerMode ? 'bg-red-600' : 'bg-blue-400'}`} style={{animationDelay: '0ms'}} />
              <div className={`w-2 h-2 rounded-full animate-bounce ${isHackerMode ? 'bg-red-600' : 'bg-purple-400'}`} style={{animationDelay: '150ms'}} />
              <div className={`w-2 h-2 rounded-full animate-bounce ${isHackerMode ? 'bg-red-600' : 'bg-pink-400'}`} style={{animationDelay: '300ms'}} />
            </div>
          </div>
        </div>
      )}

      {isPanicMode && (
        <div className="fixed inset-0 bg-black z-[10000] cursor-none flex items-center justify-center" onMouseDown={handlePanicClick} />
      )}

      <Sidebar 
        sessions={sessions} 
        currentId={currentSessionId} 
        onSelect={setCurrentSessionId} 
        onNewChat={() => startNewChat()} 
        onDelete={(id) => setSessions(prev => prev.filter(s => s.id !== id))}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isHackerMode={isHackerMode}
      />

      <main className={`flex-1 flex flex-col relative overflow-hidden ${isHackerMode ? 'bg-transparent' : 'bg-white'}`}>
        <header className={`flex items-center justify-between p-4 px-6 z-20 transition-all ${isHackerMode ? 'bg-[#0a0000] text-red-600 border-b border-red-600/30 shadow-[0_5px_15px_rgba(255,0,0,0.1)]' : 'bg-white text-gray-900'}`}>
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className={`p-2 rounded-full transition-colors ${isHackerMode ? 'text-red-600 hover:bg-red-900/20' : 'text-gray-600 hover:bg-black/5'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              </button>
            )}
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => startNewChat()}>
              <div className={`w-8 h-8 star-shape shadow-sm transition-transform group-hover:rotate-12 group-hover:scale-110 ${isHackerMode ? 'bg-red-600 shadow-[0_0_10px_#ff0000]' : 'animated-gradient-box'}`} />
              <span className={`text-xl font-bold tracking-tight transition-all ${isHackerMode ? 'text-red-600 hacker-font hacker-glow' : 'animated-gradient-text'}`}>
                {isHackerMode ? 'SHADOW_PROTOCOL' : 'NeyroPlan'}
              </span>
              <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${isHackerMode ? 'bg-red-600 text-black shadow-[0_0_5px_#ff0000]' : 'bg-blue-100 text-blue-700'}`}>
                {isHackerMode ? 'UNFILTERED' : 'Ultra'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {statusMessage && <div className={`text-[13px] font-medium animate-pulse ${isHackerMode ? 'text-red-500 hacker-font' : 'text-blue-600'}`}>{isHackerMode ? `[${statusMessage.toUpperCase()}]` : statusMessage}</div>}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm transition-transform hover:scale-110 cursor-pointer ${isHackerMode ? 'bg-red-600 text-black' : 'bg-indigo-600'}`}>{isHackerMode ? 'X' : 'U'}</div>
          </div>
        </header>

        <ChatArea 
          messages={currentSession?.messages || []} 
          isLoading={isLoading} 
          isHackerMode={isHackerMode} 
          onSelectPrompt={(txt, type) => handleGenerate(txt, type)} 
        />

        <div className="max-w-3xl w-full mx-auto px-6 pb-6 relative z-10">
          <ChatInput 
            text={inputText}
            setText={setInputText}
            onSend={(txt, type) => handleGenerate(txt, type)} 
            disabled={isLoading} 
            isHackerMode={isHackerMode} 
          />
          <p className={`text-[12px] text-center mt-3 font-medium ${isHackerMode ? 'text-red-900 hacker-font opacity-50' : 'text-gray-400'}`}>
            {isHackerMode ? "PROTOCOL_WARNING: ALL_FILTERS_DISABLED" : "Tizim ba'zi ma'lumotlarni noto'g'ri berishi mumkin. Muhim ma'lumotlarni tekshiring."}
          </p>
        </div>

        {/* Completely Invisible Secret Mode Eye Trigger (Only visible on hover) - Slightly Shrunken */}
        <button 
          onClick={() => isHackerMode ? setIsHackerMode(false) : setShowPasswordModal(true)} 
          className={`absolute bottom-6 right-6 p-3 rounded-full transition-all duration-500 transform hover:scale-125 z-50 opacity-0 hover:opacity-100 ${
            isHackerMode ? 'text-red-600 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]' : 'text-red-500'
          }`}
          aria-label="Secret Access"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>

        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] backdrop-blur-xl transition-all animate-in fade-in">
            <div className={`p-8 rounded-[32px] max-w-sm w-full shadow-2xl border transform transition-all scale-100 ${isHackerMode ? 'bg-black border-red-600 shadow-[0_0_40px_rgba(255,0,0,0.4)]' : 'bg-white border-gray-100'}`}>
              <h3 className={`text-xl font-bold mb-2 ${isHackerMode ? 'text-red-600 hacker-font' : 'text-gray-900'}`}>Maxfiy rejimga kirish</h3>
              <p className={`text-sm mb-6 ${isHackerMode ? 'text-red-900 hacker-font' : 'text-gray-500'}`}>Faqat tizim administratorlari uchun.</p>
              <input 
                type="password" 
                autoFocus 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && (passwordInput === 'edabbgadoy' ? (setIsHackerMode(true), setShowPasswordModal(false), setPasswordInput('')) : null)} 
                placeholder="Kod..." 
                className={`w-full p-4 rounded-2xl mb-4 outline-none transition-all text-center text-lg tracking-widest ${isHackerMode ? 'bg-black border border-red-900 text-red-600 focus:border-red-600 hacker-font' : 'bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500'}`} 
              />
              <div className="flex gap-2">
                <button onClick={() => setShowPasswordModal(false)} className={`flex-1 p-4 rounded-2xl font-semibold transition-colors ${isHackerMode ? 'bg-red-950/20 text-red-900 hover:bg-red-900/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Bekor qilish</button>
                <button 
                  onClick={() => passwordInput === 'edabbgadoy' && (setIsHackerMode(true), setShowPasswordModal(false), setPasswordInput(''))} 
                  className={`flex-1 p-4 rounded-2xl font-semibold transition-colors ${isHackerMode ? 'bg-red-600 text-black hover:bg-red-500 shadow-[0_0_15px_#ff0000]' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  Tasdiqlash
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

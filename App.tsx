
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
  
  const [isHackerMode, setIsHackerMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Panic Mode (Ekran o'chishi) holati
  const [isPanicMode, setIsPanicMode] = useState(false);
  const clickCountRef = useRef(0);
  // Using ReturnType<typeof setTimeout> instead of NodeJS.Timeout for better browser compatibility
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('gemini_sessions');
    if (saved) {
      let parsed = JSON.parse(saved);
      // Maxfiy sessiyalarni oddiy rejimda ko'rsatmaslik
      parsed = parsed.filter((s: ChatSession) => s.title !== 'SECRET_SESSION');
      setSessions(parsed);
      if (parsed.length > 0 && !currentSessionId) setCurrentSessionId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    // Faqat oddiy sessiyalarni saqlaymiz
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

  const clearAllHackerData = () => {
    if (!isHackerMode) return;
    setSessions([]);
    setCurrentSessionId(null);
    setStatusMessage("HISTORY_PURGED_SUCCESSFULLY");
    setTimeout(() => setStatusMessage(null), 3000);
  };

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
        const history = currentSession ? [...currentSession.messages, userMessage] : [userMessage];
        const stream = geminiService.streamChat(history, text, isHackerMode);
        for await (const chunk of stream) {
          accumulatedContent += chunk;
          updateMessageInSession(targetId, aiMessageId, { content: accumulatedContent });
        }
        
        if (history.length === 1 && !isHackerMode) {
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

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) setCurrentSessionId(null);
  };

  const handleAuth = () => {
    if (passwordInput === 'edabbgadoy') {
      setSessions(prev => prev.filter(s => s.title !== 'SECRET_SESSION'));
      setIsHackerMode(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      setStatusMessage("SHADOW TERMINAL ACTIVATED");
      startNewChat(true);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 1000);
    }
  };

  const handlePanicClick = (e: React.MouseEvent) => {
    // Faqat chap tugma (button 0)
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

  const mainBgClass = isHackerMode ? 'bg-black hacker-mode' : 'bg-white';
  const headerBgClass = isHackerMode ? 'bg-black/90 border-b border-red-900/50' : 'bg-white/80 border-b border-transparent';
  const textTitleClass = isHackerMode ? 'neon-red-text hacker-font' : 'animated-gradient-text font-bold';

  return (
    <div className={`flex h-screen w-full transition-colors duration-700 ${mainBgClass}`}>
      {isHackerMode && <div className="scanline" />}
      
      {/* Panic Overlay (O'chgan ekran) */}
      {isPanicMode && (
        <div 
          className="fixed inset-0 bg-black z-[10000] cursor-none flex items-center justify-center" 
          onMouseDown={handlePanicClick}
        >
          {/* Hech narsa ko'rinmaydi */}
        </div>
      )}

      {/* Wipe History Secret Trigger (Top Left Corner) */}
      {isHackerMode && (
        <div 
          onClick={clearAllHackerData}
          className="fixed top-0 left-0 w-12 h-12 z-[60] cursor-default opacity-0 hover:opacity-10 transition-opacity bg-red-500 rounded-br-full"
          title="PURGE_SYSTEM"
        />
      )}

      <Sidebar 
        sessions={sessions} 
        currentId={currentSessionId} 
        onSelect={setCurrentSessionId} 
        onNewChat={() => startNewChat()} 
        onDelete={deleteSession}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isHackerMode={isHackerMode}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className={`flex items-center justify-between p-4 backdrop-blur-md sticky top-0 z-20 transition-all ${headerBgClass}`}>
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className={`p-2 rounded-full transition-colors ${isHackerMode ? 'hover:bg-red-900/20 text-red-500' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className={`w-7 h-7 star-shape shadow-sm transition-all duration-700 ${isHackerMode ? 'neon-red-star' : 'animated-gradient-box'}`} />
              <div className={`text-xl transition-all tracking-tight ${textTitleClass}`}>
                {isHackerMode ? '> SHADOW_AI' : 'NeyroPlan'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {statusMessage && (
              <div className={`px-4 py-1.5 rounded-full text-xs font-medium border animate-pulse ${
                isHackerMode ? 'bg-red-900/10 text-red-500 border-red-500/30' : 'bg-blue-50 text-blue-600 border-blue-100'
              }`}>
                {statusMessage}
              </div>
            )}

            {/* Shutdown System Button (Ochirish tizimi) */}
            {isHackerMode && (
              <button 
                onClick={() => setIsPanicMode(true)}
                className="p-2 rounded-xl bg-red-950/20 border border-red-900/50 text-red-600 hover:bg-red-600 hover:text-black transition-all"
                title="TERMINATE_DISPLAY"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
              </button>
            )}

            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
              isHackerMode ? 'bg-red-600 ring-2 ring-red-400' : 'bg-blue-600'
            }`}>
              U
            </div>
          </div>
        </header>

        <ChatArea messages={currentSession?.messages || []} isLoading={isLoading} isHackerMode={isHackerMode} />

        <div className="max-w-3xl w-full mx-auto px-4 pb-6">
          <ChatInput onSend={(txt, type) => handleGenerate(txt, type)} disabled={isLoading} isHackerMode={isHackerMode} />
          <p className={`text-[11px] text-center mt-3 ${isHackerMode ? 'text-red-900 hacker-font' : 'text-gray-400'}`}>
            {isHackerMode ? '[WARNING] DATA BREACH PROTECTION ACTIVE' : "NeyroPlan xatolarga yo'l qo'yishi mumkin. Muhim ma'lumotlarni tekshirib ko'ring."}
          </p>
        </div>

        {/* Secret Mode Trigger Button (Bottom Right) */}
        <div className="absolute bottom-6 right-6 z-50">
          <button 
            onClick={() => isHackerMode ? setIsHackerMode(false) : setShowPasswordModal(true)} 
            className={`group p-3 rounded-full shadow-2xl transform active:scale-95 transition-all duration-500 opacity-0 hover:opacity-100 ${
              isHackerMode ? 'bg-red-600 ring-4 ring-red-900/80 scale-110 shadow-[0_0_20px_#ff0000]' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-8 h-8 ${isHackerMode ? 'animate-pulse' : ''}`}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>{isHackerMode && <line x1="1" y1="1" x2="23" y2="23" strokeWidth="3" opacity="0.8" />}</svg>
          </button>
        </div>

        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-md">
            <div className={`p-8 bg-black border border-red-600 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.3)] max-w-sm w-full transition-all ${authError ? 'animate-shake' : ''}`}>
              <h2 className="text-xl font-semibold text-red-500 mb-6 text-center hacker-font">ACCESS RESTRICTED</h2>
              <input type="password" autoFocus value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAuth()} placeholder="ENTER_PASS_KEY" className="w-full bg-red-900/10 border border-red-900 rounded-2xl px-4 py-3 text-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 mb-6 text-center hacker-font placeholder:text-red-900" />
              <div className="flex gap-3"><button onClick={() => setShowPasswordModal(false)} className="flex-1 px-4 py-2 text-red-900 hacker-font hover:text-red-500">ABORT</button><button onClick={handleAuth} className="flex-1 bg-red-600 text-black px-4 py-2 rounded-xl font-bold hacker-font hover:bg-red-500 transition-colors">DECRYPT</button></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

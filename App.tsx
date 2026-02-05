
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

  const [isBlackout, setIsBlackout] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('gemini_clone_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSessions(parsed);
      if (parsed.length > 0) setCurrentSessionId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gemini_clone_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const handleKeySelection = async () => {
    try {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
      return true;
    } catch (e) {
      return false;
    }
  };

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

  const addMessageToSession = (sessionId: string, message: Message) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId 
        ? { ...s, messages: [...s.messages, message], updatedAt: Date.now() }
        : s
    ));
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

    if (type === 'video') {
      const ok = await handleKeySelection();
      if (!ok) return;
    }

    let targetSessionId = currentSessionId;
    if (!targetSessionId) {
      targetSessionId = startNewChat(isHackerMode);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: type === 'text' ? text : `${type === 'image' ? 'Rasm' : 'Video'} so'rovi: ${text}`,
      timestamp: Date.now()
    };

    addMessageToSession(targetSessionId, userMessage);
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'model',
      content: type === 'text' ? '' : 'Tayyorlanmoqda...',
      type: type,
      timestamp: Date.now()
    };

    addMessageToSession(targetSessionId, aiMessage);

    try {
      if (type === 'image') {
        const imageUrl = await geminiService.generateImage(text);
        updateMessageInSession(targetSessionId, aiMessageId, { mediaUrl: imageUrl, content: 'Generatsiya yakunlandi.' });
      } else if (type === 'video') {
        const videoUrl = await geminiService.generateVideo(text, setStatusMessage);
        updateMessageInSession(targetSessionId, aiMessageId, { mediaUrl: videoUrl, content: 'Video muvaffaqiyatli yaratildi.' });
      } else {
        let accumulatedContent = '';
        const stream = geminiService.streamChat(currentSession?.messages || [], text, isHackerMode);
        for await (const chunk of stream) {
          accumulatedContent += chunk;
          updateMessageInSession(targetSessionId, aiMessageId, { content: accumulatedContent });
        }
      }
    } catch (error: any) {
      let errorMsg = "Xatolik yuz berdi.";
      if (error.message?.includes("Requested entity was not found")) {
        errorMsg = "Pullik API kaliti talab qilinadi. Billing yoqilganligini tekshiring.";
        // @ts-ignore
        window.aistudio.openSelectKey();
      }
      updateMessageInSession(targetSessionId, aiMessageId, { content: errorMsg });
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
      setIsHackerMode(true);
      setShowPasswordModal(false);
      setAuthError(false);
      setPasswordInput('');
      setStatusMessage("ACCESS_GRANTED");
      // Har doim yangi chat ochish
      startNewChat(true);
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 1000);
    }
  };

  const exitHackerMode = () => {
    // Chiqishda hamma hakerlik izlarini o'chirish
    if (currentSessionId) {
      deleteSession(currentSessionId);
    }
    setIsHackerMode(false);
    setStatusMessage("SYSTEM_CLEANED");
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleBlackoutClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (newCount === 3) {
      setIsBlackout(false);
      setClickCount(0);
      setStatusMessage("Xush kelibsiz");
      setTimeout(() => setStatusMessage(null), 3000);
    } else {
      clickTimer.current = setTimeout(() => setClickCount(0), 500);
    }
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 ${isHackerMode ? 'bg-black' : 'bg-[#131314]'}`}>
      <Sidebar 
        sessions={sessions} 
        currentId={currentSessionId} 
        onSelect={setCurrentSessionId} 
        onNewChat={() => startNewChat()} 
        onDelete={deleteSession}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 flex flex-col relative">
        <header className={`flex items-center justify-between p-4 sticky top-0 z-10 ${isHackerMode ? 'bg-black border-b border-green-900' : 'bg-[#131314]'}`}>
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-[#28292a] rounded-full text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            )}
            <div className={`text-xl font-medium transition-colors ${isHackerMode ? 'text-green-500 font-mono' : 'text-gray-200'}`}>
              {isHackerMode ? 'SHADOW_AI://TERMINAL' : 'NeyroPlan'}
            </div>
          </div>
          {statusMessage && (
            <div className={`absolute left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] animate-pulse border z-50 shadow-xl ${isHackerMode ? 'bg-green-950 text-green-400 border-green-700' : 'bg-[#1e1f20] text-blue-400 border-blue-900'}`}>
              {statusMessage}
            </div>
          )}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isHackerMode ? 'bg-green-900 text-green-400 border border-green-500' : 'bg-blue-600 text-white'}`}>
            {isHackerMode ? '?' : 'U'}
          </div>
        </header>

        <ChatArea messages={currentSession?.messages || []} isLoading={isLoading} isHackerMode={isHackerMode} />

        <div className={`max-w-4xl w-full mx-auto px-4 pb-8 sticky bottom-0 ${isHackerMode ? 'bg-black' : 'bg-[#131314]'}`}>
          <ChatInput onSend={(txt, type) => handleGenerate(txt, type)} disabled={isLoading} isHackerMode={isHackerMode} />
          <p className="text-[11px] text-gray-500 text-center mt-3 px-10">
            {isHackerMode ? 'SECURE_CHANNEL: ENCRYPTED' : 'NeyroPlan xatolarga yo\'l qo\'yishi mumkin.'}
          </p>
        </div>

        <div className="absolute bottom-4 right-4 z-50">
          <button 
            onClick={() => isHackerMode ? exitHackerMode() : setShowPasswordModal(true)}
            className={`w-6 h-6 rounded-full opacity-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer ${isHackerMode ? 'bg-blue-500 opacity-100' : 'bg-red-600'}`}
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          </button>
        </div>

        {isHackerMode && (
          <div className="absolute bottom-4 left-4 z-50">
            <button onClick={() => setIsBlackout(true)} className="w-8 h-8 rounded-full opacity-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-crosshair bg-black border border-green-900 group">
              <div className="w-1.5 h-1.5 bg-green-900 rounded-full group-hover:bg-red-600 animate-ping"></div>
            </button>
          </div>
        )}

        {isBlackout && (
          <div className="fixed inset-0 bg-black z-[200] cursor-none flex items-center justify-center" onClick={handleBlackoutClick}>
            <div className="opacity-0 text-green-900 font-mono text-[8px]">SYSTEM_OFFLINE</div>
          </div>
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] backdrop-blur-sm">
            <div className={`p-8 rounded-2xl border-2 max-w-sm w-full transition-all ${authError ? 'border-red-600 bg-red-950/20' : 'border-gray-800 bg-[#1e1f20]'}`}>
              <h2 className="text-xl font-medium text-white mb-6 text-center">Tizimga kirish</h2>
              <input 
                type="password"
                autoFocus
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                placeholder="Parol..."
                className="w-full bg-[#131314] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 mb-6 text-center"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowPasswordModal(false)} className="flex-1 px-4 py-2 text-gray-400 hover:text-white transition-colors">Bekor qilish</button>
                <button onClick={handleAuth} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-colors">Kirish</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

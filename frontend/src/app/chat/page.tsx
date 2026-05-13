'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, LogOut, MessageSquare, PlusCircle, History, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
};

type HistorySession = {
  [sessionId: string]: {
    id: number;
    user_message: string;
    bot_response: string;
    timestamp: string;
  }[];
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState<HistorySession>({});
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    // Generate a session ID on initial load
    if (!sessionId) {
      setSessionId(Date.now().toString());
    }
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await api.post('/chat', { 
        message: newUserMessage.text,
        session_id: sessionId 
      });
      
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: res.data.bot_response,
        sender: 'bot',
        timestamp: res.data.timestamp,
      };
      
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(Date.now().toString());
    setShowHistory(false);
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    setShowHistory(true);
    try {
      const res = await api.get('/chat/history');
      setHistoryData(res.data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadSession = (sid: string) => {
    const sessionMsgs = historyData[sid] || [];
    // Messages in history API are in descending order, we need ascending
    const ascendingMsgs = [...sessionMsgs].reverse();
    
    const loadedMessages: Message[] = [];
    ascendingMsgs.forEach((msg) => {
      loadedMessages.push({
        id: `u-${msg.id}`,
        text: msg.user_message,
        sender: 'user',
        timestamp: msg.timestamp
      });
      loadedMessages.push({
        id: `b-${msg.id}`,
        text: msg.bot_response,
        sender: 'bot',
        timestamp: msg.timestamp
      });
    });
    
    setMessages(loadedMessages);
    setSessionId(sid);
    setShowHistory(false);
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="chat-layout" style={{ position: 'relative' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
            <MessageSquare size={20} />
            ReplyZen
          </h2>
        </div>
        
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={handleNewChat}
            className="btn btn-primary"
          >
            <PlusCircle size={18} />
            New Chat
          </button>
          
          <button 
            onClick={loadHistory}
            className="btn btn-outline"
          >
            <History size={18} />
            Chat History
          </button>
        </div>
        
        <div style={{ flex: 1 }}></div>
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button 
            onClick={logout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <div className="chat-header">
          <h3>Chat Session</h3>
        </div>
        
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--muted)' }}>
              <h2>Welcome to ReplyZen!</h2>
              <p>Type a message to start a new conversation.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`message message-${msg.sender}`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="message message-bot">
              <div className="message-content" style={{ fontStyle: 'italic', color: 'var(--muted)' }}>
                Typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message ReplyZen..."
              rows={1}
            />
            <button 
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* History Modal Overlay */}
      {showHistory && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            background: 'var(--card)', width: '90%', maxWidth: '600px',
            maxHeight: '80vh', borderRadius: '16px', display: 'flex', flexDirection: 'column',
            border: '1px solid var(--border)', overflow: 'hidden'
          }}>
            <div style={{ 
              padding: '1.5rem', borderBottom: '1px solid var(--border)', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
            }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <History size={20} /> Your Chat History
              </h2>
              <button 
                onClick={() => setShowHistory(false)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {loadingHistory ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading history...</div>
              ) : Object.keys(historyData).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>No chat history found.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.entries(historyData).map(([sid, sessionMsgs]) => (
                    <div 
                      key={sid} 
                      onClick={() => loadSession(sid)}
                      className="history-card"
                    >
                      <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground)' }}>
                        {sessionMsgs[sessionMsgs.length - 1]?.user_message.substring(0, 50)}...
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                        {new Date(sessionMsgs[0]?.timestamp).toLocaleString()} • {sessionMsgs.length} messages
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/AdminSidebar';

type Message = {
  id: number;
  user_message: string;
  bot_response: string;
  timestamp: string;
};

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UserHistoryPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const { isAuthenticated, userRole, loading } = useAuth();
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || userRole !== 'admin') {
        router.push('/login');
      } else {
        fetchData();
      }
    }
  }, [loading, isAuthenticated, userRole, router, params.userId]);

  const fetchData = async () => {
    try {
      const [userRes, historyRes] = await Promise.all([
        api.get(`/admin/users/${params.userId}`),
        api.get(`/admin/users/${params.userId}/history`)
      ]);
      setUser(userRes.data);
      setMessages(historyRes.data);
      setFilteredMessages(historyRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    let result = messages;
    if (startDate) {
      result = result.filter(m => new Date(m.timestamp) >= new Date(startDate));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(m => new Date(m.timestamp) <= end);
    }
    setFilteredMessages(result);
  }, [startDate, endDate, messages]);

  const exportCSV = () => {
    if (!filteredMessages.length) return;
    
    const headers = ['Timestamp', 'User Message', 'Bot Response'];
    const csvContent = [
      headers.join(','),
      ...filteredMessages.map(m => `"${m.timestamp}","${m.user_message.replace(/"/g, '""')}","${m.bot_response.replace(/"/g, '""')}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${user?.name || 'user'}_chat_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || userRole !== 'admin') return null;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 0 }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Link href="/admin/users" style={{ color: 'var(--muted)' }}>
              <ArrowLeft size={24} />
            </Link>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
              Chat History: {user?.name}
            </h1>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'var(--muted)' }}>{user?.email}</div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="date" 
                  className="form-input" 
                  style={{ padding: '0.5rem' }} 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
                <span style={{ color: 'var(--muted)' }}>to</span>
                <input 
                  type="date" 
                  className="form-input" 
                  style={{ padding: '0.5rem' }} 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>

              <button 
                onClick={exportCSV}
                className="btn btn-primary" 
                style={{ width: 'auto', padding: '0.5rem 1rem' }}
                disabled={filteredMessages.length === 0}
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="chat-messages" style={{ flex: 1, padding: '2rem' }}>
          {filteredMessages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '3rem' }}>
              No chat history found for the selected filter.
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="message message-user">
                  <div className="message-content">
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>
                      {format(new Date(msg.timestamp), 'MMM dd, HH:mm')}
                    </div>
                    {msg.user_message}
                  </div>
                </div>
                
                <div className="message message-bot">
                  <div className="message-content">
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>
                      Bot • {format(new Date(msg.timestamp), 'MMM dd, HH:mm')}
                    </div>
                    {msg.bot_response}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

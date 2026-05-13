'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/AdminSidebar';
import { Users, UserCheck, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_users: 0, verified_users: 0, active_users: 0 });
  const { isAuthenticated, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || userRole !== 'admin') {
        router.push('/login');
      } else {
        fetchStats();
      }
    }
  }, [loading, isAuthenticated, userRole, router]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || userRole !== 'admin') return null;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard Overview</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-title">Total Registered Users</div>
                <div className="stat-value">{stats.total_users}</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', color: 'var(--primary)' }}>
                <Users size={24} />
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-title">Verified Users</div>
                <div className="stat-value">{stats.verified_users}</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', color: 'var(--success)' }}>
                <UserCheck size={24} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="stat-title">Active Users Today</div>
                <div className="stat-value">{stats.active_users}</div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', color: 'var(--danger)' }}>
                <Activity size={24} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

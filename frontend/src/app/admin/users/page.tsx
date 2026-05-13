'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/AdminSidebar';
import { Search } from 'lucide-react';

type User = {
  id: number;
  name: string;
  email: string;
  is_verified: boolean;
  created_at: string;
  last_login: string | null;
  total_messages_sent: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || userRole !== 'admin') {
        router.push('/login');
      } else {
        fetchUsers();
      }
    }
  }, [loading, isAuthenticated, userRole, router]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isOnline = (lastLogin: string | null) => {
    if (!lastLogin) return false;
    const loginDate = new Date(lastLogin);
    const today = new Date();
    return loginDate.toDateString() === today.toDateString();
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || userRole !== 'admin') return null;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem' }}>Registered Users</h1>
          
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Joined Date</th>
                <th>Last Login</th>
                <th>Messages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 500 }}>{user.name}</td>
                    <td style={{ color: 'var(--muted)' }}>{user.email}</td>
                    <td>
                      {isOnline(user.last_login) ? (
                        <span className="badge badge-success">Online Today</span>
                      ) : (
                        <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--muted)' }}>Offline</span>
                      )}
                    </td>
                    <td>
                      {user.is_verified ? (
                        <span className="badge badge-primary">Yes</span>
                      ) : (
                        <span className="badge badge-danger">No</span>
                      )}
                    </td>
                    <td>{format(new Date(user.created_at), 'MMM dd, yyyy')}</td>
                    <td>{user.last_login ? format(new Date(user.last_login), 'MMM dd, yyyy HH:mm') : 'Never'}</td>
                    <td style={{ textAlign: 'center' }}>{user.total_messages_sent || 0}</td>
                    <td>
                      <Link href={`/admin/users/${user.id}/history`} className="btn" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        View History
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

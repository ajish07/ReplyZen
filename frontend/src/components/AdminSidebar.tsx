'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="admin-sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <LayoutDashboard size={24} className="text-primary" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Admin Panel</h2>
      </div>

      <nav className="admin-nav">
        <Link 
          href="/admin" 
          className={`admin-nav-link ${pathname === '/admin' ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link 
          href="/admin/users" 
          className={`admin-nav-link ${pathname.includes('/admin/users') ? 'active' : ''}`}
        >
          <Users size={20} />
          Users
        </Link>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <button 
          onClick={logout}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            background: 'none',
            border: 'none',
            color: 'var(--danger)',
            cursor: 'pointer',
            padding: '0.75rem 1rem',
            width: '100%',
            textAlign: 'left',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

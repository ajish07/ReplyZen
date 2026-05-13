'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const params = useParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await api.post(`/auth/reset-password/${params.token}`, { password });
      setStatus('success');
      setMessage('Password reset successful. You can now log in.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.detail || 'Invalid or expired reset link.');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="form-title">Set New Password</h1>
        
        {status === 'success' && <div className="alert alert-success">{message}</div>}
        {status === 'error' && <div className="alert alert-error">{message}</div>}

        <form onSubmit={handleSubmit} style={{ display: status === 'success' ? 'none' : 'block' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Saving...' : 'Reset Password'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <Link href="/login">Return to Login</Link>
        </div>
      </div>
    </div>
  );
}

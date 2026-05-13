'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function VerifyEmailTokenPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await api.get(`/auth/verify-email/${params.token}`);
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        setTimeout(() => router.push('/login'), 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.detail || 'Invalid or expired verification link.');
      }
    };

    if (params.token) {
      verifyToken();
    }
  }, [params.token, router]);

  return (
    <div className="container">
      <div className="form-container" style={{ textAlign: 'center' }}>
        <h1 className="form-title">Email Verification</h1>
        
        {status === 'loading' && <p>Verifying your email...</p>}
        
        {status === 'success' && (
          <div>
            <div className="alert alert-success">{message}</div>
            <p className="form-subtitle">Redirecting to login...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="alert alert-error">{message}</div>
            <Link href="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

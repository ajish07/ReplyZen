'use client';

import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="container">
      <div className="form-container" style={{ textAlign: 'center' }}>
        <h1 className="form-title">Check Your Email</h1>
        <p className="form-subtitle">
          We've sent a verification link to your email address. Please click the link to verify your account.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <Link href="/login" className="btn btn-primary">
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

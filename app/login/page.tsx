'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex" style={{ height: "100vh"}}>
      <div className="flex flex-col items-center justify-center" style={{ width: 632, background: 'var(--background)' }}>

        <Header />
        <form onSubmit={handleSubmit} className="bg-white p-10 flex flex-col gap-6" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', width: '400px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 600 , color: 'var(--bluesportsee)'}}>Transformez vos stats en résultats</h2>
          <p style={{ fontSize: '22px', fontWeight: 500}}>Se connecter</p>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--grissportsee)' }}>Adresse email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ border: '1px solid var(--blueclairsportsee)', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--grissportsee)' }}>Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ border: '1px solid var(--blueclairsportsee)', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            style={{ background: 'var(--bluesportsee)', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '16px', fontWeight: 500, cursor: 'pointer', marginTop: '8px' }}
          >
            Se connecter
          </button>

          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--grissportsee)', fontSize: '14px', textAlign: 'center', marginTop: '4px' }}>
            Mot de passe oublié ?
          </a>
        </form>
      </div>
      <div style={{flex: 1}}>
        <Image src="/assets/home_login.jpg" alt="Home Login" width={808} height={1024} style={{ height: '100%', objectFit: 'cover'}} />
      </div>

    </div>
  );
}

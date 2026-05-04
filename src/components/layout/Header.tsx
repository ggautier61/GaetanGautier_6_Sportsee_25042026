'use client';

import styles from './Header.module.css';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/home');
  };

  return (
    <header
        className="flex justify-between relative w-full overflow-hidden"
        style={{ height: "49px" }}
      >
        <div className="relative z-10 h-full flex items-center">
          <Image src="/assets/logo_Sportsee.png" alt="Sportsee" height={23} width={157} />
        </div>

        {isAuthenticated ? (
          <nav className='p-3 px-6' style={{backgroundColor: 'white',height: '100%', borderRadius: '25px'}}>
            <ul className="flex gap-8">
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/coach-ai">Coach AI</Link>
              </li>
              <li>
                <Link href="/profil">Mon profil</Link>
              </li>
              <li>|</li>
              <li style={{color: 'blue', cursor: 'pointer'}} onClick={handleLogout}>Se déconnecter</li>
            </ul>
          </nav>
        ) : (
          <nav className='p-3 px-6' style={{backgroundColor: 'white',height: '100%', borderRadius: '25px'}}>
            <Link href="/home">Se connecter</Link>
          </nav>
        )}
      </header>
    
  );
}

export default Header;

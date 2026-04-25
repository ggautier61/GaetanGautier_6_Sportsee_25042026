import styles from './Header.module.css';
import Image from "next/image";


interface HeaderProps {
  firstName?: string;
}

export function Header() {
  // export function Header({ firstName = 'utilisateur' }: HeaderProps) {
  return (
    <header
        className="flex justify-between relative w-full overflow-hidden"
        style={{ height: "49px" }}
      >
        <div className="relative z-10 h-full flex items-center">
          <Image src="/assets/logo_Sportsee.png" alt="Les Petits Plats" height={23} width={157} />
        </div>

        <nav className='p-3 px-6' style={{backgroundColor: 'white',height: '100%', borderRadius: '25px'}}>
          <ul className="flex gap-8">
            <li>Dashboard</li>
            <li>Coach AI</li>
            <li>Mon profil</li>
            <hr></hr>
            <li>Se déconnecter</li>
          </ul>
        </nav>
      </header>
    
  );
}

export default Header;
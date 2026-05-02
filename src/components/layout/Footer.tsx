import Link from "next/link";
import Image from "next/image";



export function Footer() {

    return (
    <footer className="flex justify-between items-center w-full px-[100px] py-[12px]" style={{height: '40px', fontFamily: 'Inter', fontSize: 14, fontWeight: 400, backgroundColor: 'white'}}>
        <div style={{fontFamily: "Inter", fontWeight: 400, fontSize: 14}}>© Sportsee  Tous droits réservés</div>
        <div className="flex">
            <Link href="/" className="ml-4">
                Conditions générales
            </Link>
            <Link href="/" className="ml-4">
                Contact
            </Link>
            <Image src="/assets/Logo_Sportsee_simple.png" alt="Sportsee" height={20} width={19} className="ml-4" />
        </div>
    </footer>
    )
}
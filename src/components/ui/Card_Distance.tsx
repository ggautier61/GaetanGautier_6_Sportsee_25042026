import Image from "next/image";


interface Card_DistanceProps {
  distance: number;
}

const Card_Distance: React.FC<Card_DistanceProps> = ({ distance }) => {
  return (
    <div className='flex items-center gap-4' style={{ height: '90px' }}>
      <p style={{color: 'var(--grissoprtsee)', fontSize: '14px'}}>Distance totale parcourue</p>
      <div className="flex items-center gap-4 h-full" 
        style={{ backgroundColor: 'var(--bluesportsee)', color: 'white', borderRadius: '10px', padding: '28px', fontFamily: 'Inter', fontSize: '22px' }}>
        <Image src="/assets/Icon_Distance.png" alt="Icon Distance" width={34} height={34} />
        <p className="distance-value">{distance} km</p>

      </div>
    </div>
  );
};

export default Card_Distance;

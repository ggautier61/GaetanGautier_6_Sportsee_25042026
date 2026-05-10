

const CustomLegend = (props: any) => {
  const { payload } = props;

  const order = ["min", "max", "average"];

  const sorted = [...payload].sort(
    (a, b) => order.indexOf(a.dataKey) - order.indexOf(b.dataKey)
  );

  sorted.map((entry: any, index: number) => (
    console.log(`Entry ${index}: dataKey=${entry.dataKey}, value=${entry.value}, color=${entry.color}`)
  ));

  return (

      <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', padding: 0 }}>
      {sorted.map((entry: any, index: number) => {
        // On détermine si c'est la série de type Line (par exemple via son ID ou type)
        const isLine = entry.type === 'line' || entry.value === 'Série Ligne'; // Adapte selon tes dataKeys

        return (
          <li key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Rendu de l'icône */}
            {isLine ? (
              <svg width="24" height="12" style={{ display: 'block' }}>
                <line x1="0" y1="6" x2="24" y2="6" stroke={entry.color} strokeWidth="2" />
                <circle cx="12" cy="6" r="4" fill={'var(--bluesportsee)'}  />
              </svg>
            ) : (
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: entry.color
              }} />
            )}
            
            {/* Texte du label en gris clair */}
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>
              {entry.value}
            </span>
          </li>
        );
      })}
    </ul>



    // <ul className="flex gap-6 list-none p-0 m-0">
    //   {sorted.map((entry: any, index: number) => (
    //     <li key={index} className="flex items-center gap-2">
    //       <svg></svg>
    //       <span
    //         style={{
    //           // backgroundColor: entry.color, 
    //           backgroundColor: entry.dataKey == "average" ? "var(--bluesportsee)" : entry.color, 

    //           // backgroundColor: `${entry.dataKey} == "average" ? "blue" : ${entry.color}`, 
    //           width: 8,
    //           height: 8,
    //           borderRadius: "50%",
    //           display: "inline-block",
    //         }}
    //       />
    //       <span style={{ color: 'var(--grissportsee)', fontSize: 12, fontWeight: 400 }}>{entry.value}</span>
    //     </li>
    //   ))}
    // </ul>
  );
};

export default CustomLegend;
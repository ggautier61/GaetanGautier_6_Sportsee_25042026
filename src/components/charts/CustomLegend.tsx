const CustomLegend = (props: any) => {
  const { payload } = props;

  const order = ["min", "max", "average"];

  const sorted = [...payload].sort(
    (a, b) => order.indexOf(a.dataKey) - order.indexOf(b.dataKey)
  );

  return (
    <ul className="flex gap-6 list-none p-0 m-0">
      {sorted.map((entry: any, index: number) => (
        <li key={index} className="flex items-center gap-2">
          <span
            style={{
              backgroundColor: entry.color,
              width: 8,
              height: 8,
              borderRadius: "50%",
              display: "inline-block",
            }}
          />
          <span style={{ color: '#707070', fontFamily: 'Inter', fontSize: 12, fontWeight: 400 }}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;
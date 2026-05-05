import { Pie, PieChart, Sector, PieSectorDataItem, ResponsiveContainer } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';


interface CustomActiveShapePieChartProps {
  nbSessions: number;
}

// #endregion
const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  value,
}: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        radius={7}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.name === 'realisés' ? "var(--bluesportsee)" : "var(--blueclairsportsee)"}
      />
          {value > 0 && (
            <>
              <circle cx={textAnchor === 'start' ? ex - 12 : ex - 115} cy={ey - 5} r={6} 
                  fill={payload.name === 'realisés' ? "var(--bluesportsee)" : "var(--blueclairsportsee)"} stroke="none" />
              <text x={ex} y={ey} textAnchor={textAnchor} fill={fill} fontSize={22}>
                  {value} {payload.name}
              </text>
            </>
          )}
    </g>
  );
};

export default function CustomActiveShapePieChart({ nbSessions }: CustomActiveShapePieChartProps) {
  
  const data = [
  { name: 'restants', value: 6 - nbSessions },
  { name: 'realisés', value: nbSessions },
];

  return (
  
    <ResponsiveContainer width={500} height={500}>

      <PieChart
        style={{ width: '100%', maxWidth: '500px', maxHeight: '200px', aspectRatio: 3/1 }}
        responsive>

        <Pie
          cornerRadius={10}
          shape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="30%"
          outerRadius="60%"
          fill="var(--grissportsee)"
          dataKey="value"
          isAnimationActive={true}
        />
        {/* <Tooltip content={() => null} defaultIndex={defaultIndex} /> */}
        <RechartsDevtools />
      </PieChart>

    </ResponsiveContainer>

  );
}
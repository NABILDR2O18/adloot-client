
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for campaign breakdown
const data = [
  { name: 'Summer Game Promo', spend: 2420, clicks: 8240, impressions: 120500 },
  { name: 'New User Campaign', spend: 1930, clicks: 7120, impressions: 98700 },
  { name: 'Reward Program', spend: 1640, clicks: 6140, impressions: 82300 },
  { name: 'Holiday Special', spend: 2240, clicks: 7920, impressions: 114600 },
  { name: 'App Download', spend: 1890, clicks: 6930, impressions: 95400 },
];

const formatCurrency = (value: number) => {
  return `$${value.toFixed(2)}`;
};

export function PerformanceBreakdownChart() {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6B7280' }} 
            angle={-45} 
            textAnchor="end"
            height={70}
          />
          <YAxis 
            yAxisId="left" 
            tickFormatter={formatCurrency} 
            tick={{ fill: '#6B7280' }} 
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            tick={{ fill: '#6B7280' }} 
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'spend') {
                return [`$${Number(value).toFixed(2)}`, 'Ad Spend'];
              } else if (name === 'clicks') {
                return [value, 'Clicks'];
              }
              return [value, 'Impressions'];
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="spend" name="Ad Spend" fill="#3B82F6" />
          <Bar yAxisId="right" dataKey="clicks" name="Clicks" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

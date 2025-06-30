
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data - in a real app this would come from an API
const data = [
  { name: 'Apr 21', spend: 1200, conversions: 24 },
  { name: 'Apr 22', spend: 1300, conversions: 29 },
  { name: 'Apr 23', spend: 1000, conversions: 20 },
  { name: 'Apr 24', spend: 1278, conversions: 25 },
  { name: 'Apr 25', spend: 1189, conversions: 31 },
  { name: 'Apr 26', spend: 1239, conversions: 28 },
  { name: 'Apr 27', spend: 1349, conversions: 33 },
  { name: 'Apr 28', spend: 1329, conversions: 35 },
  { name: 'Apr 29', spend: 1450, conversions: 38 },
  { name: 'Apr 30', spend: 1390, conversions: 36 },
];

const formatCurrency = (value: number) => {
  return `$${value.toFixed(2)}`;
};

export function PerformanceChart() {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name"
            tick={{ fill: '#6B7280' }}
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
              }
              return [value, 'Conversions'];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="spend"
            stroke="#3B82F6"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            name="Ad Spend"
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="conversions" 
            stroke="#10B981" 
            strokeWidth={2}
            name="Conversions" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

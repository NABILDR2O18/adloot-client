import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data - in a real app this would come from an API
const data = [
  { name: "Apr 21", earnings: 400, users: 240 },
  { name: "Apr 22", earnings: 300, users: 139 },
  { name: "Apr 23", earnings: 200, users: 980 },
  { name: "Apr 24", earnings: 278, users: 390 },
  { name: "Apr 25", earnings: 189, users: 480 },
  { name: "Apr 26", earnings: 239, users: 380 },
  { name: "Apr 27", earnings: 349, users: 430 },
  { name: "Apr 28", earnings: 529, users: 590 },
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
            bottom: 100,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: "#6B7280" }} />
          <YAxis
            yAxisId="left"
            tickFormatter={formatCurrency}
            tick={{ fill: "#6B7280" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#6B7280" }}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "earnings") {
                return [`$${Number(value).toFixed(2)}`, "Earnings"];
              }
              return [value, "Active Users"];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="earnings"
            stroke="#8B5CF6"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            name="Earnings"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="users"
            stroke="#10B981"
            strokeWidth={2}
            name="Active Users"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

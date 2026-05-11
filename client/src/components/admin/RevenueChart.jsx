import React from 'react';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'rgba(15,12,42,0.95)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <p
          style={{
            color: '#a78bfa',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2" style={{ marginBottom: 4 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: entry.color,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <p style={{ color: '#d1d5db', fontSize: '13px' }}>
              <span style={{ color: '#9ca3af' }}>{entry.name}:</span>{' '}
              <span style={{ color: '#f0eeff', fontWeight: 600 }}>
                {entry.name === 'Revenue'
                  ? `$${Number(entry.value).toLocaleString()}`
                  : entry.value.toLocaleString()}
              </span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: '#6b7280' }}>No revenue data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={1} />
              <stop offset="100%" stopColor="#4c1d95" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
          />

          <YAxis
            yAxisId="revenue"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />

          <YAxis
            yAxisId="orders"
            orientation="right"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.08)' }} />

          <Legend
            wrapperStyle={{ fontSize: '13px', color: '#9ca3af' }}
            iconType="circle"
          />

          <Bar
            yAxisId="revenue"
            dataKey="revenue"
            name="Revenue"
            fill="url(#revenueBarGradient)"
            radius={[6, 6, 0, 0]}
            barSize={36}
          />

          <Line
            yAxisId="orders"
            type="monotone"
            dataKey="orders"
            name="Orders"
            stroke="#facc15"
            strokeWidth={2.5}
            dot={{ fill: '#facc15', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#fde68a', strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
import React from 'react';

const colorMap = {
  blue:   { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa', shadow: 'rgba(59,130,246,0.25)' },
  green:  { bg: 'rgba(34,197,94,0.12)',   color: '#4ade80', shadow: 'rgba(34,197,94,0.25)' },
  purple: { bg: 'rgba(124,58,237,0.15)',  color: '#a78bfa', shadow: 'rgba(124,58,237,0.3)' },
  orange: { bg: 'rgba(249,115,22,0.12)',  color: '#fb923c', shadow: 'rgba(249,115,22,0.25)' },
  red:    { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', shadow: 'rgba(239,68,68,0.25)' },
  indigo: { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8', shadow: 'rgba(99,102,241,0.25)' },
  pink:   { bg: 'rgba(236,72,153,0.12)',  color: '#f472b6', shadow: 'rgba(236,72,153,0.25)' },
  yellow: { bg: 'rgba(234,179,8,0.12)',   color: '#facc15', shadow: 'rgba(234,179,8,0.25)' },
};

const StatsCards = ({ stats }) => {
  if (!stats || Object.keys(stats).length === 0) return null;

  const entries = Array.isArray(stats) ? stats : Object.values(stats);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {entries.map((stat, index) => {
        const Icon = stat.icon;
        const palette = colorMap[stat.color] || colorMap.blue;

        return (
          <div
            key={index}
            className="rounded-2xl p-6 transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(12px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
              e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.2)`;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: '#6b7280' }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-2xl font-extrabold mt-2 tracking-tight"
                  style={{ color: '#f0eeff' }}
                >
                  {typeof stat.value === 'number'
                    ? stat.value.toLocaleString()
                    : stat.value}
                </p>
              </div>

              {Icon && (
                <div
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{
                    background: palette.bg,
                    boxShadow: `0 4px 16px ${palette.shadow}`,
                  }}
                >
                  <Icon size={22} style={{ color: palette.color }} />
                </div>
              )}
            </div>

            {/* subtle bottom accent line */}
            <div
              className="mt-5 h-px rounded-full"
              style={{
                background: `linear-gradient(90deg, ${palette.color}40, transparent)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
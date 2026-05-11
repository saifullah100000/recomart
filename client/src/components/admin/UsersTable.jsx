import React from 'react';

const roleBadgeStyles = {
  admin:  { background: 'rgba(239,68,68,0.12)',   color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' },
  seller: { background: 'rgba(59,130,246,0.12)',  color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' },
  user:   { background: 'rgba(156,163,175,0.12)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.2)' },
};

const avatarColors = [
  'linear-gradient(135deg, #7c3aed, #6d28d9)',
  'linear-gradient(135deg, #2563eb, #1d4ed8)',
  'linear-gradient(135deg, #059669, #047857)',
  'linear-gradient(135deg, #d97706, #b45309)',
  'linear-gradient(135deg, #db2777, #be185d)',
];

const UsersTable = ({ users, onToggleStatus }) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg" style={{ color: '#6b7280' }}>No users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {[
              { label: 'Name', cls: '' },
              { label: 'Email', cls: 'hidden sm:table-cell' },
              { label: 'Role', cls: '' },
              { label: 'Status', cls: '' },
              { label: 'Joined', cls: 'hidden md:table-cell' },
              { label: 'Actions', cls: '' },
            ].map(({ label, cls }) => (
              <th
                key={label}
                className={`px-5 py-4 text-xs font-semibold uppercase tracking-widest ${cls}`}
                style={{ color: '#6b7280' }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {users.map((user, idx) => {
            const userId = user._id || user.id;
            const role = user.role || 'user';
            const isActive = user.isActive !== false;
            const joinedDate = user.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })
              : '-';

            const badgeStyle = roleBadgeStyles[role] || roleBadgeStyles.user;
            const avatarGradient = avatarColors[idx % avatarColors.length];
            const initials = (user.name || '?')
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <tr
                key={userId}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Name */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0"
                      style={{
                        width: 34,
                        height: 34,
                        background: avatarGradient,
                        color: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      }}
                    >
                      {initials}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: '#f0eeff' }}>
                      {user.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-5 py-4 hidden sm:table-cell">
                  <span className="text-sm" style={{ color: '#9ca3af' }}>
                    {user.email}
                  </span>
                </td>

                {/* Role */}
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    style={badgeStyle}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={
                      isActive
                        ? { background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }
                        : { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }
                    }
                  >
                    <span
                      className="rounded-full"
                      style={{
                        width: 6, height: 6,
                        background: isActive ? '#4ade80' : '#f87171',
                        display: 'inline-block',
                      }}
                    />
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Joined */}
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-sm" style={{ color: '#6b7280' }}>
                    {joinedDate}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <button
                    onClick={() => onToggleStatus && onToggleStatus(userId)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                    style={
                      isActive
                        ? { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }
                        : { background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isActive
                        ? 'rgba(239,68,68,0.22)'
                        : 'rgba(34,197,94,0.22)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isActive
                        ? 'rgba(239,68,68,0.12)'
                        : 'rgba(34,197,94,0.12)';
                    }}
                  >
                    {isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
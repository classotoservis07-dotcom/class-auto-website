'use client';

import Link from 'next/link';

interface Stat {
  label: string;
  value: number;
  icon: string;
  href: string;
  color: string;
}

interface QuickAction {
  label: string;
  href: string;
  icon: string;
}

interface Props {
  stats: Stat[];
  quickActions: QuickAction[];
}

export default function DashboardCards({ stats, quickActions }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '0' }}>
      {/* İstatistik Kartları */}
      <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
            <div
              className="admin-card admin-stat-card"
              data-color={stat.color}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = stat.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#374151';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>{stat.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Hızlı İşlemler */}
      <div className="admin-card">
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#f9fafb', marginBottom: '16px' }}>Hızlı İşlemler</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                background: '#111827',
                border: '1px solid #374151',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#d1d5db',
                fontSize: '13px',
                fontWeight: 500,
                transition: 'border-color 0.15s, color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#dc2626';
                e.currentTarget.style.color = '#f9fafb';
                e.currentTarget.style.background = '#1a0a0a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#374151';
                e.currentTarget.style.color = '#d1d5db';
                e.currentTarget.style.background = '#111827';
              }}
            >
              <span style={{ fontSize: '18px' }}>{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Boş sağ alan — son talepler server component'te render ediliyor */}
      <div />
    </div>
  );
}

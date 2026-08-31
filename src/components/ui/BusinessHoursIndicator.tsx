'use client';

/**
 * BusinessHoursIndicator — Client Component
 * Shows "Şu an açık" or "Şu an kapalı" based on current time.
 * Mon-Sat 08:00-18:00 open, Sunday closed.
 */

export default function BusinessHoursIndicator() {
  const now = new Date();
  const day = now.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeInMinutes = hour * 60 + minute;

  // Mon-Sat (1-6), 08:00-18:00
  const isOpen =
    day >= 1 && day <= 6 &&
    timeInMinutes >= 8 * 60 &&
    timeInMinutes < 18 * 60;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        fontWeight: 600,
        color: isOpen ? '#22c55e' : '#ef4444',
      }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: isOpen ? '#22c55e' : '#ef4444',
          animation: isOpen ? 'pulse-dot 2s ease-in-out infinite' : 'none',
          display: 'inline-block',
        }}
        aria-hidden="true"
      />
      {isOpen ? 'Şu an açık' : 'Şu an kapalı'}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes pulse-dot { 0%, 100% { opacity: 1; } }
        }
      `}</style>
    </span>
  );
}

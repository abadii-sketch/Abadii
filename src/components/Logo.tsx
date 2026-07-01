type LogoProps = {
  className?: string;
  withWordmark?: boolean;
  locale?: 'en' | 'ar';
};

/**
 * Abadii mark: a sun disc with radiating heat, resting on a raised
 * horizon line that doubles as a raised hand / "ready to work" gesture.
 * Reads at 24px favicon size as well as full lockups.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Abadii"
    >
      <defs>
        <linearGradient id="abadiiSun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7C878" />
          <stop offset="55%" stopColor="#F2A93B" />
          <stop offset="100%" stopColor="#E1622F" />
        </linearGradient>
      </defs>
      {/* rays */}
      <g stroke="#F2A93B" strokeWidth="3.2" strokeLinecap="round">
        <line x1="32" y1="4" x2="32" y2="12" />
        <line x1="12.7" y1="12.7" x2="18.2" y2="18.2" />
        <line x1="51.3" y1="12.7" x2="45.8" y2="18.2" />
        <line x1="6" y1="27" x2="14" y2="27" />
        <line x1="50" y1="27" x2="58" y2="27" />
      </g>
      {/* sun disc, slightly cropped by horizon */}
      <circle cx="32" cy="30" r="14" fill="url(#abadiiSun)" />
      {/* horizon / raised-arm ground line */}
      <path
        d="M4 46 L24 46 L30 38 L36 50 L41 46 L60 46"
        fill="none"
        stroke="#14192B"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({ className, withWordmark = true, locale = 'en' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoMark className="h-9 w-9 shrink-0" />
      {withWordmark && (
        <span className="flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-night">
            Abadii
          </span>
          <span className="font-arabic text-xl font-semibold text-night" dir="rtl">
            عبادي
          </span>
        </span>
      )}
    </div>
  );
}

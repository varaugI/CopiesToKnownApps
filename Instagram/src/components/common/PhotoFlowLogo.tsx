interface PhotoFlowLogoProps {
  size?: number;
  className?: string;
}

export function PhotoFlowLogo({ size = 28, className = "" }: PhotoFlowLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ minWidth: size }}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" stroke="#8b5cf6" strokeWidth="2" />
      <path
        d="M4.8 14.2c2.1-3.2 4.2-3.2 6.3 0s4.2 3.2 6.3 0c.7-1.1 1.4-1.8 2.1-2.2"
        stroke="#ec4899"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="1.4" fill="#f59e0b" />
    </svg>
  );
}

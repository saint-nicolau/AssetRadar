interface Props {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#22bcf0" />
          <stop offset="100%" stopColor="#06a3d6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="10" fill="#0e1020" stroke="url(#logoGrad)" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="11" stroke="url(#logoGrad)" strokeWidth="2.2" opacity="0.5" />
      <circle cx="20" cy="20" r="6" stroke="url(#logoGrad)" strokeWidth="2.2" />
      <path d="M20 6 L20 11 M20 29 L20 34 M6 20 L11 20 M29 20 L34 20" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="20" r="2" fill="#ff9a1f" />
    </svg>
  );
}

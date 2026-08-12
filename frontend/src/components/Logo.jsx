// Small gradient monogram used in the nav (matches the favicon).
export default function Logo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" style={{ display: "block" }}>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F2B84B" />
          <stop offset="0.6" stopColor="#A98CFF" />
          <stop offset="1" stopColor="#7C8CFF" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#logoGrad)" />
      <text x="32" y="34" fontFamily="Bricolage Grotesque, Poppins, sans-serif"
        fontSize="40" fontWeight="800" fill="#0D0B14" textAnchor="middle"
        dominantBaseline="central">A</text>
    </svg>
  );
}

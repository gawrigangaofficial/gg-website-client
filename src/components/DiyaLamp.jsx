/**
 * Small brass diya with a flickering flame, drawn to sit on top of the "Need help?" button (see ShopAssistant).
 * The wick and flame are on the left side of the lamp, facing into the page. SVG + CSS only (.gg-lamp in index.css);
 * decorative and click-through.
 */
const DiyaLamp = ({ className = '' }) => (
  <svg
    viewBox="0 0 80 52"
    width="80"
    height="52"
    className={`gg-lamp pointer-events-none overflow-visible ${className}`}
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="gg-diya-brass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#a8731f" />
        <stop offset="0.35" stopColor="#f0c36b" />
        <stop offset="0.7" stopColor="#c98a2b" />
        <stop offset="1" stopColor="#8a5a17" />
      </linearGradient>
      <radialGradient id="gg-diya-glow-grad">
        <stop offset="0" stopColor="#ffd27a" stopOpacity="0.7" />
        <stop offset="0.5" stopColor="#ff9a3c" stopOpacity="0.28" />
        <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Warm glow around the flame */}
    <circle className="gg-lamp-glow" cx="13" cy="17" r="20" fill="url(#gg-diya-glow-grad)" />

    {/* Foot and bowl */}
    <ellipse cx="40" cy="47.5" rx="15" ry="3" fill="#82541a" />
    <path d="M6 32 Q40 60 74 32 Z" fill="url(#gg-diya-brass)" />
    <ellipse cx="40" cy="32" rx="34" ry="6" fill="#e9b85a" />
    <ellipse cx="40" cy="33" rx="26" ry="3.8" fill="#8f5f1a" opacity="0.6" />

    {/* Wick holder on the left lip, with the flame above it */}
    <path d="M3 32 Q5 26 14 27 Q10 34 3 34 Z" fill="url(#gg-diya-brass)" />
    <g className="gg-lamp-flame">
      <path d="M13 5 C 8 14, 8 23, 13 27 C 18 23, 18 14, 13 5 Z" fill="#ffb347" />
      <path d="M13 12 C 10.5 18, 10.5 23, 13 25 C 15.5 23, 15.5 18, 13 12 Z" fill="#fff1b8" />
    </g>
  </svg>
)

export default DiyaLamp

/**
 * Decorative incense holder with three dhoop battis, fixed at the bottom-left on wide screens
 * (xl and up; scaled down below 2xl so it covers less of the page). Each stick has a glowing tip and its own column of soft smoke
 * that billows, sways and drifts up most of the page before fading.
 *
 * Pure SVG and CSS (keyframes gg-puff and gg-ember-glow in index.css; the diya lives in DiyaLamp), no images. Clicks pass through
 * everything. Still for visitors whose device is set to reduce motion.
 */

const W = 170
const H = 230

/** Three sticks fanned out from the bowl. Angles in degrees from vertical, lengths in px, base on the sand. */
const STICKS = [
  { bx: 70, by: 168, angle: -15, len: 128 },
  { bx: 85, by: 170, angle: 3, len: 142 },
  { bx: 100, by: 168, angle: 17, len: 118 },
]

/** Where a stick's tip is, in the SVG's pixel space. */
const tipOf = ({ bx, by, angle, len }) => {
  const r = (angle * Math.PI) / 180
  return { x: bx + len * Math.sin(r), y: by - len * Math.cos(r) }
}

// Per-puff variation: sideways drift (px), final size multiplier. Stick order flips the drift direction.
const DRIFT = [-22, 30, -34, 18, -28, 36, -14, 24, -30, 16]
const GROW = [2.6, 3.0, 2.4, 3.2, 2.7, 3.0, 2.5, 3.1, 2.6, 2.9]
const PUFFS = DRIFT.length
const BASE_DURATION = 11

const DhoopDecor = () => (
  <div
    className="gg-dhoop pointer-events-none fixed bottom-1.5 left-2 z-110 hidden xl:block"
    style={{ width: W, height: H }}
    aria-hidden="true"
  >
    {/* Smoke: one column of puffs per stick, rising from its tip */}
    {STICKS.map((stick, s) => {
      const tip = tipOf(stick)
      const duration = BASE_DURATION + s * 0.9
      return (
        <div key={s} className="absolute" style={{ left: tip.x, top: tip.y }}>
          {DRIFT.map((dx, i) => (
            <i
              key={i}
              className="gg-puff"
              style={{
                '--dx': `${s % 2 ? -dx : dx}px`,
                '--grow': GROW[i],
                animationDuration: `${duration}s`,
                animationDelay: `${-(i * duration) / PUFFS - s * 1.1}s`,
              }}
            />
          ))}
        </div>
      )
    })}

    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="absolute inset-0 overflow-visible" focusable="false">
      <defs>
        <linearGradient id="gg-brass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6cf7e" />
          <stop offset="0.5" stopColor="#c98a2b" />
          <stop offset="1" stopColor="#82541a" />
        </linearGradient>
        <linearGradient id="gg-brass-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a8731f" />
          <stop offset="0.35" stopColor="#f0c36b" />
          <stop offset="0.7" stopColor="#c98a2b" />
          <stop offset="1" stopColor="#8a5a17" />
        </linearGradient>
        <radialGradient id="gg-ember-grad">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="0.45" stopColor="#ff9a3c" />
          <stop offset="1" stopColor="#ff6a00" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="85" cy="216" rx="70" ry="8" fill="#000" opacity="0.12" />

      {/* Sticks: unburnt wood, burnt ash near the tip, glowing ember */}
      {STICKS.map(({ bx, by, angle, len }, i) => (
        <g key={i} transform={`rotate(${angle} ${bx} ${by})`}>
          <line x1={bx} y1={by} x2={bx} y2={by - len} stroke="#5b3a23" strokeWidth="3" strokeLinecap="round" />
          <line x1={bx} y1={by} x2={bx} y2={by - len * 0.32} stroke="#c9a46a" strokeWidth="2" strokeLinecap="round" />
          <line x1={bx} y1={by - len + 9} x2={bx} y2={by - len} stroke="#a09a95" strokeWidth="3.2" strokeLinecap="round" />
          <circle className="gg-ember" cx={bx} cy={by - len} r="7" fill="url(#gg-ember-grad)" style={{ animationDelay: `${-i * 0.8}s` }} />
          <circle cx={bx} cy={by - len} r="1.8" fill="#fff6d8" />
        </g>
      ))}

      {/* Brass incense bowl (urli) with sand */}
      <path d="M60 205 L110 205 L104 215 L66 215 Z" fill="#82541a" />
      <path d="M18 166 C 22 198, 58 210, 85 210 C 112 210, 148 198, 152 166 Z" fill="url(#gg-brass-side)" />
      <path d="M26 180 C 50 190, 120 190, 144 180" fill="none" stroke="#7a4d12" strokeWidth="1.4" opacity="0.55" />
      <path d="M30 188 C 54 197, 116 197, 140 188" fill="none" stroke="#f6d792" strokeWidth="1" opacity="0.5" />
      <ellipse cx="85" cy="166" rx="67" ry="13" fill="#e9b85a" />
      <ellipse cx="85" cy="167" rx="59" ry="10" fill="#8c6a38" />
      <ellipse cx="85" cy="168" rx="52" ry="7" fill="#a58450" opacity="0.8" />
    </svg>
  </div>
)

export default DhoopDecor

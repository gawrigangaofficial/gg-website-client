import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'

const STORAGE_KEY = 'gg-dhoop-hidden'

/** Smoke wisps rising from the stick tip. Each is drawn twice: a pale halo (shows on dark pages) under a grey core (shows on cream pages). */
const WISPS = [
  { cls: 'gg-smoke-1', d: 'M47 128 C 36 108, 58 92, 46 72 S 34 38, 50 16 S 60 -14, 44 -40', w: 5 },
  { cls: 'gg-smoke-2', d: 'M47 128 C 58 110, 38 90, 50 70 S 62 36, 44 14 S 32 -18, 50 -44', w: 4 },
  { cls: 'gg-smoke-3', d: 'M47 128 C 40 112, 54 96, 44 78 S 40 44, 54 22 S 46 -10, 52 -36', w: 3 },
]

function readHidden() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Decorative dhoop batti with rising smoke and a small diya flame, fixed at the bottom-left on wide screens (xl and up),
 * where the page margins leave room for it. Clicks pass through everything except the small hide button.
 * SVG + CSS only (keyframes gg-smoke-*, gg-ember, gg-diya-flame in index.css); still for reduced-motion users.
 * Visitors can hide it; the choice is remembered in this browser.
 */
const DhoopDecor = () => {
  const [hidden, setHidden] = useState(readHidden)
  if (hidden) return null

  const hide = () => {
    setHidden(true)
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* private mode: hide for this visit only */
    }
  }

  return (
    <div className="gg-dhoop pointer-events-none fixed bottom-4 left-3 z-110 hidden xl:block">
      <button
        type="button"
        onClick={hide}
        className="pointer-events-auto absolute -right-3 bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-[10px] text-stone-500 opacity-70 shadow transition-opacity hover:text-stone-800 hover:opacity-100 focus:opacity-100"
        aria-label="Hide the incense decoration"
        tabIndex={0}
      >
        <FaTimes />
      </button>
      <svg viewBox="0 0 90 320" width="72" height="256" className="overflow-visible" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="gg-smoke-core" gradientUnits="userSpaceOnUse" x1="0" y1="128" x2="0" y2="-40">
            <stop offset="0" stopColor="#7d716a" stopOpacity="0.75" />
            <stop offset="1" stopColor="#7d716a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gg-smoke-halo" gradientUnits="userSpaceOnUse" x1="0" y1="128" x2="0" y2="-40">
            <stop offset="0" stopColor="#fff6e6" stopOpacity="0.7" />
            <stop offset="1" stopColor="#fff6e6" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="gg-ember-grad">
            <stop offset="0" stopColor="#fff3c4" />
            <stop offset="0.45" stopColor="#ff9a3c" />
            <stop offset="1" stopColor="#ff6a00" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gg-brass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f2c36b" />
            <stop offset="0.55" stopColor="#c98a2b" />
            <stop offset="1" stopColor="#8a5a17" />
          </linearGradient>
          <filter id="gg-smoke-blur" x="-50%" y="-20%" width="200%" height="140%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>

        {/* Smoke: three wisps rising from the tip at staggered times */}
        <g filter="url(#gg-smoke-blur)" fill="none" strokeLinecap="round">
          {WISPS.map((w) => (
            <g key={w.cls} className={`gg-smoke ${w.cls}`}>
              <path d={w.d} stroke="url(#gg-smoke-halo)" strokeWidth={w.w + 5} />
              <path d={w.d} stroke="url(#gg-smoke-core)" strokeWidth={w.w} />
            </g>
          ))}
        </g>

        {/* Incense stick, slightly tilted, with a glowing tip */}
        <g transform="rotate(6 47 250)">
          <line x1="47" y1="250" x2="47" y2="136" stroke="#5b3a23" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="47" y1="250" x2="47" y2="212" stroke="#c9a46a" strokeWidth="2" strokeLinecap="round" />
          <line x1="47" y1="140" x2="47" y2="131" stroke="#9a9089" strokeWidth="3" strokeLinecap="round" />
          <circle className="gg-ember" cx="47" cy="131" r="6" fill="url(#gg-ember-grad)" />
          <circle cx="47" cy="131" r="1.8" fill="#fff6d8" />
        </g>

        {/* Brass stand with a small diya flame */}
        <ellipse cx="45" cy="296" rx="38" ry="9" fill="#000" opacity="0.08" />
        <path d="M10 272 Q45 300 80 272 L74 284 Q45 304 16 284 Z" fill="url(#gg-brass)" />
        <ellipse cx="45" cy="272" rx="35" ry="7" fill="#e7b25a" />
        <ellipse cx="45" cy="271" rx="27" ry="4.5" fill="#a86d1f" opacity="0.45" />
        {/* Diya wick and flame at the right lip of the bowl, clear of the stick */}
        <path d="M66 270 Q70 264 76 266 Q72 272 66 273 Z" fill="url(#gg-brass)" />
        <g className="gg-diya-flame">
          <path d="M73 245 C 69 252, 69 260, 73 264 C 77 260, 77 252, 73 245 Z" fill="#ffb347" />
          <path d="M73 251 C 71 256, 71 260, 73 262 C 75 260, 75 256, 73 251 Z" fill="#fff1b8" />
        </g>
      </svg>
    </div>
  )
}

export default DhoopDecor

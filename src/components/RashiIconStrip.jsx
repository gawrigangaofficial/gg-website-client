import { Link } from 'react-router-dom';

const ZODIAC_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const zodiacImageModules = import.meta.glob('../assets/Zodiac/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

const ZODIAC_IMAGES = Object.entries(zodiacImageModules).reduce((acc, [path, src]) => {
  const fileName = path.split('/').pop() || '';
  const baseName = fileName.split('.')[0].toLowerCase();
  acc[baseName === 'vigro' ? 'virgo' : baseName] = src;
  return acc;
}, {});

const RashiIconStrip = () => (
  <div className="gg-rashi-strip" aria-label="Shop by rashi">
    <ul className="flex snap-x gap-4 overflow-x-auto px-4 py-1 [scrollbar-width:none]">
      {ZODIAC_ORDER.map((sign) => (
        <li key={sign} className="shrink-0">
          <Link
            to={`/rashi?sign=${encodeURIComponent(sign)}`}
            className="flex w-16 snap-start flex-col items-center gap-1.5"
          >
            <span className="h-14 w-14 overflow-hidden rounded-full bg-[#FFF3E6] ring-2 ring-white/80">
              <img
                src={ZODIAC_IMAGES[sign.toLowerCase()]}
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
            <span className="max-w-16 truncate text-[11px] font-semibold text-[#fff6e4]">{sign}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default RashiIconStrip;

import { Link } from 'react-router-dom';
import Heading from '../../assets/Sprayelem/Header.webp';
import AmratBindu from '../../assets/Sprayelem/AmratBindu.webp';
import ChakraBalance from '../../assets/Sprayelem/ChakraBalance.webp';
import Maitri from '../../assets/Sprayelem/Maitri.webp';
import Shuddhi from '../../assets/Sprayelem/Shuddhi.webp';

const sprays = [
  {
    image: AmratBindu,
    title: 'Amrat Bindu',
    note: 'Lavender mist for calm evenings and a quieter room.',
    path: '/sprays/amrat-bindu',
  },
  {
    image: ChakraBalance,
    title: 'Chakra Balance',
    note: 'Hibiscus spray for a brighter, steadier mood.',
    path: '/sprays/chakra-balance',
  },
  {
    image: Maitri,
    title: 'Maitri',
    note: 'A warm floral mist for home and quiet work.',
    path: '/sprays/maitri',
  },
  {
    image: Shuddhi,
    title: 'Shuddhi',
    note: 'Mogra and kewda to freshen a puja or practice space.',
    path: '/sprays/shuddhi',
  },
];

const SpraySection = () => (
  <section className="bg-[#FFFAEB] py-6 md:py-10">
    <img src={Heading} alt="" className="w-full" />
    <div className="mx-auto w-[92%] max-w-7xl pt-5 md:pt-8">
      <header className="mb-4 text-center md:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">Aura sprays</p>
        <h2 className="mt-1 font-heading text-2xl font-bold text-stone-900 md:text-4xl">Pre-order now</h2>
      </header>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {sprays.map((item) => (
          <article key={item.title} className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-orange-100">
            <Link to={item.path} className="block aspect-4/5 overflow-hidden bg-[#FFF3E6]">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
            </Link>
            <div className="flex flex-1 flex-col px-2.5 py-3 md:px-3">
              <h3 className="font-heading text-sm font-bold text-stone-900 md:text-base">{item.title}</h3>
              <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-stone-600 md:text-sm">{item.note}</p>
              <Link
                to={item.path}
                className="mt-3 inline-flex w-fit rounded-full bg-[#ff914d] px-3 py-1.5 text-[11px] font-semibold text-white md:text-xs"
              >
                View spray
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default SpraySection;

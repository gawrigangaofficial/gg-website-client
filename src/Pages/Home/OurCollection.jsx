import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import rudrakshaImg from '../../assets/HomePage/Our-collection/rudraksha.webp';
import spraysImg from '../../assets/HomePage/Our-collection/Maitri.webp';
import accessoriesImg from '../../assets/HomePage/Our-collection/Accessories.webp';
import tulsiImg from '../../assets/HomePage/Our-collection/Tulsi.webp';
import braceletImg from '../../assets/HomePage/Our-collection/braclet1.webp';
import malaImg from '../../assets/HomePage/Our-collection/Mala.webp';
import combosImg from '../../assets/HomePage/Our-collection/COMBO.webp';

const collections = [
  { id: 1, name: 'Rudraksha', image: rudrakshaImg, link: '/rudraksha' },
  { id: 2, name: 'Sprays', image: spraysImg, link: '/sprays' },
  { id: 3, name: 'Accessories', image: accessoriesImg, link: '/accessories' },
  { id: 4, name: 'Tulsi Products', image: tulsiImg, link: '/tulsimala' },
  { id: 5, name: 'Bracelet', image: braceletImg, link: '/accessories?subcategory=Bracelet' },
  { id: 6, name: 'Mala', image: malaImg, link: '/accessories?subcategory=Mala' },
  { id: 7, name: 'Combos', image: combosImg, link: '/combos' }
];

const OurCollection = () => {
  return (
    <section className="bg-[#FFFAEB] py-8 md:py-10" aria-labelledby="our-collections-heading">
      <div className="mx-auto w-[92%] max-w-7xl">
        <div className="mb-6 text-center md:mb-8">
          <h2
            id="our-collections-heading"
            className="font-heading text-2xl font-bold tracking-tight text-stone-800 sm:text-3xl md:text-4xl"
          >
            Gawri Ganga Collections
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-stone-600 sm:text-base">
            Explore handpicked spiritual essentials curated for your daily practice.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:gap-2 md:grid-cols-7 md:gap-5 lg:gap-6">
          {collections.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group overflow-hidden rounded-xl border border-primary/20 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <div className="relative aspect-4/5 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/25 to-transparent p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white sm:text-base">{item.name}</span>
                    <FaArrowRight className="shrink-0 text-xs text-white/90 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurCollection;
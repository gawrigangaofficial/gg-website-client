import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import ExploreSectionsBlock from '../../components/ExploreSectionsBlock';
import Heading from '../../assets/Sprayelem/Header.webp';
import { pricingFromProduct } from '../../utils/productPricing';
import { getCardReviewCount } from '../../utils/reviewDisplayCount.js';
import { fetchAllProductsByCategory } from '../../utils/shopProductFetch';
import { CategoryFaq, CollectionSchema } from '../../components/CategorySeo';
import RelatedGuides from '../../components/RelatedGuides';

const SPRAY_FAQS = [
  {
    question: 'How do aura sprays freshen a room without dhoop or sage smoke?',
    answer:
      'They are room mists. Shake the bottle and spray a short arc into the air. The fragrance settles in a few minutes, which is useful in apartments, offices, and while travelling, where smoke is not practical.',
  },
  {
    question: 'Which Gawri Ganga spray should I start with?',
    answer:
      'Amrat Bindu is a lavender mist for quieter evenings. Maitri is warm and floral. Chakra Balance is a brighter hibiscus spray. Shuddhi uses mogra and kewda when you want a fresher puja or practice space.',
  },
  {
    question: 'Can I spray these on Rudraksha or wood malas?',
    answer:
      'Spray into the air around you, not onto beads, fabric, or the face. Wood malas and Rudraksha stay in better shape when they are kept dry.',
  },
];

const Spray = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const list = await fetchAllProductsByCategory('Sprays');
        setProducts(list);
      } catch (_error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFAEB] py-4 sm:py-6 lg:py-8">
      <CollectionSchema
        name="Sacred aura and energy cleansing sprays"
        description="Smoke-free aura sprays for home, puja, and travel. Amrat Bindu, Maitri, Chakra Balance, and Shuddhi from Gawri Ganga."
        path="/sprays"
        faqs={SPRAY_FAQS}
      />
      <div className="mx-auto w-full max-w-[1920px] px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <img src={Heading} alt="Gawri Ganga aura sprays" className="mb-4 w-full rounded-3xl sm:mb-6" />
        <header className="mb-4 max-w-3xl sm:mb-6">
          <h1 className="font-heading text-2xl font-bold text-stone-900 sm:text-3xl">Sacred aura and energy cleansing sprays</h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
            A smoke-free way to freshen a room when dhoop, camphor, or sage is not practical. Shake the bottle, spray a short arc into the air, and set one intention. Amrat Bindu, Maitri, Chakra Balance, and Shuddhi are the four mists in this collection.
          </p>
          <Link to="/guides/smoke-free-aura-cleansing-sprays" className="mt-3 inline-flex text-sm font-semibold text-primary">
            How to use an aura spray
          </Link>
        </header>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-stone-600">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="spray"
                calculatePricing={pricingFromProduct}
                getReviewCount={getCardReviewCount}
              />
            ))}
          </div>
        )}
        <CategoryFaq faqs={SPRAY_FAQS} />
        <RelatedGuides
          slugs={['smoke-free-aura-cleansing-sprays', 'why-rudraksha-karungali-and-tulsi-matter']}
        />
      </div>
      <ExploreSectionsBlock excludeCategory="Sprays" />
    </div>
  );
};

export default Spray;

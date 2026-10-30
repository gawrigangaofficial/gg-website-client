import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaWhatsapp } from 'react-icons/fa';
import Breadcrumbs, { ExploreLinks } from '../../components/Breadcrumbs';
import { WHATSAPP_NUMBER } from '../../config/site';
import { articleJsonLd, faqJsonLd, guidePageMeta } from '../../seo/meta';
import { usePageSeo } from '../../seo/SeoContext';
import { pricingFromProduct } from '../../utils/productPricing';
import BlogExploreProductsSection from '../Blog/BlogExploreProductsSection';
import { relatedCards } from '../../content/guides/lookup';
import ShopStrip from '../../components/ShopStrip';
import { linkedProductSlugs, useProductsBySlug } from '../../hooks/useProductsBySlug';

const TOKEN = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\{\{(?:price|amount):[a-z0-9-]+\}\})/g;
const inr = (n) => `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9\p{Script=Devanagari}]+/gu, '-').replace(/^-|-$/g, '');

function RichText({ text, products }) {
  const parts = String(text).split(TOKEN).filter(Boolean);
  return parts.map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (href === 'wa:') {
        return (
          <a key={i} href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Namaste! I read your guide and have a question.')}`} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        );
      }
      if (/^https?:/.test(href)) {
        return (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        );
      }
      return (
        <Link key={i} to={href}>
          {label}
        </Link>
      );
    }
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    const price = part.match(/^\{\{(price|amount):([a-z0-9-]+)\}\}$/);
    if (price) {
      const product = products[price[2]];
      if (!product) return null;
      const amount = inr(pricingFromProduct(product).currentPrice);
      return <Fragment key={i}>{price[1] === 'price' ? ` (${amount})` : amount}</Fragment>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Block({ block, products }) {
  if (typeof block === 'string') {
    return (
      <p>
        <RichText text={block} products={products} />
      </p>
    );
  }
  if (block?.ul) {
    return (
      <ul>
        {block.ul.map((li) => (
          <li key={li}>
            <RichText text={li} products={products} />
          </li>
        ))}
      </ul>
    );
  }
  if (block?.table) {
    return (
      <div className="my-6 overflow-x-auto rounded-xl border border-stone-200 bg-white" role="region" aria-label="Table" tabIndex={0}>
        <table className="w-full min-w-[480px] border-collapse text-left text-[15px]">
          <thead className="bg-orange-50">
            <tr>
              {block.table.head.map((h) => (
                <th key={h} scope="col" className="border-b border-stone-200 px-3 py-2 font-semibold text-stone-900">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.table.rows.map((row, r) => (
              <tr key={r} className="odd:bg-white even:bg-stone-50">
                {row.map((cell, c) => (
                  <td key={c} className={`border-b border-stone-100 px-3 py-2 align-top ${c === 0 ? 'font-semibold text-stone-900' : 'text-stone-700'}`}>
                    <RichText text={cell} products={products} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

const PROSE =
  '[&_h2]:scroll-mt-24 text-[17px] leading-8 text-stone-700 [&_h2]:mt-10 [&_h2]:border-b [&_h2]:border-stone-200 [&_h2]:pb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-primary [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-stone-900 [&_p]:my-4 [&_a]:font-semibold [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_strong]:text-stone-900';

/** Long-form guide from src/content/guides, at /guides/<slug>. */
const GuidePage = ({ guide }) => {
  const products = useProductsBySlug();
  usePageSeo({ ...guidePageMeta(guide), image: guide.heroImage });

  const ctaAfter = Math.max(0, Math.ceil(guide.sections.length / 2) - 1);
  // Products to shop from this guide: the chosen ones first, then any product the text links to.
  const shopSlugs = [...new Set([...(guide.related?.productSlugs || []), ...linkedProductSlugs(JSON.stringify(guide.sections))])];
  const shop = shopSlugs.map((slug) => products[slug]).filter(Boolean);
  const hi = guide.lang === 'hi';
  const more = relatedCards(guide.slug, 3);
  const article = articleJsonLd({
    path: `/guides/${guide.slug}`,
    title: guide.title,
    description: guide.description,
    image: guide.heroImage,
    published: guide.published,
    updated: guide.updated,
  });
  const faqLd = faqJsonLd(guide.faqs || []);

  return (
    <div className="bg-[#FFFAEB]" lang={guide.lang || undefined}>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(article)}</script>
        {faqLd ? <script type="application/ld+json">{JSON.stringify(faqLd)}</script> : null}
      </Helmet>
      <article className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-8 sm:py-10">
        <Breadcrumbs items={[{ name: 'Guides', href: '/guides' }, { name: guide.title, href: `/guides/${guide.slug}` }]} />
        <ExploreLinks />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          <Link to={`/guides?topic=${encodeURIComponent(guide.category)}`} className="hover:underline">
            {guide.category}
          </Link>
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">{guide.title}</h1>
        <p className="mt-3 text-sm text-stone-500">
          Gawri Ganga · Updated{' '}
          {new Date(guide.updated || guide.published).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          {guide.readMinutes ? ` · ${guide.readMinutes} min read` : ''}
        </p>
        {guide.heroImage ? (
          <img src={guide.heroImage} alt={guide.heroAlt || guide.title} className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover" loading="eager" />
        ) : null}
        <p className="mt-6 rounded-xl bg-orange-50 px-4 py-3 text-base leading-relaxed text-stone-700">{guide.excerpt}</p>

        <nav className="mt-6 rounded-xl border border-stone-200 bg-white px-5 py-4" aria-label={guide.lang === 'hi' ? 'इस गाइड में' : 'In this guide'}>
          <p className="text-sm font-semibold text-stone-900">{guide.lang === 'hi' ? 'इस गाइड में' : 'In this guide'}</p>
          <ol className="mt-2 grid gap-x-6 gap-y-1 text-[15px] sm:grid-cols-2">
            {guide.sections.map((s) => (
              <li key={s.h2}>
                <a href={`#${slugify(s.h2)}`} className="text-primary hover:underline">
                  {s.h2}
                </a>
              </li>
            ))}
            {guide.faqs?.length ? (
              <li>
                <a href="#guide-faq" className="text-primary hover:underline">
                  {guide.lang === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently asked questions'}
                </a>
              </li>
            ) : null}
          </ol>
        </nav>

        <div className={PROSE}>
          {guide.sections.map((s, index) => (
            <Fragment key={s.h2}>
              <section aria-labelledby={slugify(s.h2)}>
                <h2 id={slugify(s.h2)}>{s.h2}</h2>
                {(s.body || []).map((b, k) => (
                  <Block key={k} block={b} products={products} />
                ))}
                {(s.subs || []).filter((sub) => sub && typeof sub === 'object').map((sub) => (
                  <Fragment key={sub.h3}>
                    <h3>{sub.h3}</h3>
                    {(sub.body || []).map((b, k) => (
                      <Block key={k} block={b} products={products} />
                    ))}
                  </Fragment>
                ))}
              </section>
              {index === 0 ? (
                <ShopStrip compact products={shop.slice(0, 3)} id="guide-shop-top" lang={guide.lang} title={hi ? 'इस गाइड के प्रोडक्ट' : 'Shop this guide'} />
              ) : null}
              {index === ctaAfter && guide.midCta ? (
                <aside className="my-10 rounded-2xl border border-orange-200 bg-orange-50 p-6">
                  <p className="font-heading text-2xl font-bold text-stone-900">{guide.midCta.title}</p>
                  <p className="mt-2 text-base text-stone-600">{guide.midCta.text}</p>
                  <Link to={guide.midCta.to} className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold !text-white !no-underline">
                    {guide.midCta.label}
                  </Link>
                </aside>
              ) : null}
            </Fragment>
          ))}
        </div>

        {guide.faqs?.length ? (
          <section className="mt-10" aria-labelledby="guide-faq">
            <h2 id="guide-faq" className="border-b border-stone-200 pb-3 text-2xl font-bold text-primary">
              {guide.lang === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently asked questions'}
            </h2>
            <div className="mt-4 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
              {guide.faqs.map((f) => (
                <details key={f.q} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none font-semibold text-stone-900">{f.q}</summary>
                  <p className="mt-2 text-[15px] leading-7 text-stone-700">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <ShopStrip products={shop.slice(0, 6)} id="guide-products" lang={guide.lang} title={hi ? 'इस गाइड में बताए गए प्रोडक्ट' : 'Products in this guide'} />

        {more.length ? (
          <section className="mt-12" aria-labelledby="keep-reading">
            <h2 id="keep-reading" className="text-2xl font-bold text-stone-900">
              {guide.lang === 'hi' ? 'और पढ़ें' : 'Keep reading'}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {more.map((g) => (
                <li key={g.slug}>
                  <Link to={`/guides/${g.slug}`} className="flex h-full flex-col rounded-2xl border border-orange-100 bg-white p-4 shadow-sm hover:border-primary/40">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{g.category}</span>
                    <span className="mt-1 font-semibold leading-snug text-stone-900">{g.title}</span>
                    <span className="mt-2 text-sm text-stone-500">{g.readMinutes} min read</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          {(guide.related?.pages || []).map((page) => (
            <Link key={page.to + page.label} to={page.to} className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-primary">
              {page.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Namaste! I read "${guide.title}" and have a question.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <FaWhatsapp aria-hidden /> Ask us on WhatsApp
          </a>
        </div>
      </article>
      <BlogExploreProductsSection headingId="guide-explore-products-heading" />
    </div>
  );
};

export default GuidePage;

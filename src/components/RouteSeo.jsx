import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { OG_IMAGE } from '../config/site';
import { useSeoOverride } from '../seo/SeoContext';
import {
  absUrl,
  canonicalPath,
  isPrivatePath,
  organizationJsonLd,
  routeMeta,
  websiteJsonLd,
} from '../seo/meta';

/**
 * The only component that renders the title, description, robots, canonical and Open Graph tags.
 * ProductPage and BlogPostPage pass their own title and description through usePageSeo().
 */
const RouteSeo = () => {
  const { pathname } = useLocation();
  const override = useSeoOverride();
  const meta = { ...routeMeta(pathname), ...override };
  const url = absUrl(canonicalPath(pathname));
  const noindex = isPrivatePath(pathname) || meta.noindex;
  const image = absUrl(meta.image || import.meta.env.VITE_OG_IMAGE_URL?.trim() || OG_IMAGE);
  const isHome = pathname === '/';

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} />
      {noindex ? null : <link rel="canonical" href={url} />}
      <meta property="og:type" content={meta.type === 'product' ? 'product' : meta.type === 'article' ? 'article' : 'website'} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Gawri Ganga" />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={image} />
      {isHome ? <script type="application/ld+json">{JSON.stringify(organizationJsonLd())}</script> : null}
      {isHome ? <script type="application/ld+json">{JSON.stringify(websiteJsonLd())}</script> : null}
    </Helmet>
  );
};

export default RouteSeo;

/* eslint-disable react-refresh/only-export-components -- provider and its hooks belong together */
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React 19 hoists every <title>/<meta>/<link> it renders into <head> without removing duplicates,
 * so only RouteSeo may render them. Pages that know more than the route (a product, a blog post)
 * hand their title, description and image to RouteSeo through this context instead.
 */
const SeoContext = createContext({ override: null, setOverride: () => {} });

export function SeoProvider({ children }) {
  const [override, setOverride] = useState(null);
  return <SeoContext.Provider value={{ override, setOverride }}>{children}</SeoContext.Provider>;
}

/** Returns the override for the current URL only, so a stale one never leaks onto the next page. */
export function useSeoOverride() {
  const { override } = useContext(SeoContext);
  const { pathname } = useLocation();
  return override?.pathname === pathname ? override : null;
}

/** Call from a page once its data has loaded: usePageSeo(product ? { title, description, image } : null). */
export function usePageSeo(meta) {
  const { setOverride } = useContext(SeoContext);
  const { pathname } = useLocation();
  const key = meta ? `${meta.title}|${meta.description}|${meta.image || ''}` : '';

  useEffect(() => {
    if (!meta) return undefined;
    setOverride({ ...meta, pathname });
    return () => setOverride((current) => (current?.pathname === pathname ? null : current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, pathname, setOverride]);
}

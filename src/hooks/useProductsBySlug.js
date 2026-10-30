import { useEffect, useState } from 'react'
import { apiFetch } from '../config/api'

let cache = null

/** Live products keyed by slug, fetched once per page load and shared by guides and blog posts. */
export function useProductsBySlug() {
  const [bySlug, setBySlug] = useState(cache || {})
  useEffect(() => {
    if (cache) return undefined
    let cancelled = false
    apiFetch('/api/products?limit=200')
      .then((r) => r.json())
      .then((json) => {
        const map = {}
        for (const p of json?.data || []) map[p.slug] = p
        cache = map
        if (!cancelled) setBySlug(map)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])
  return bySlug
}

/** Product slugs linked as /product/<slug> in text or HTML, in order of first mention. */
export function linkedProductSlugs(text = '') {
  const out = []
  for (const m of String(text).matchAll(/\/product\/([a-z0-9-]+)/g)) if (!out.includes(m[1])) out.push(m[1])
  return out
}

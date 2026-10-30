import { useEffect, useRef, useState } from 'react'

/**
 * Renders its children when they are about to scroll into view, or once the page has been idle for `idleMs`,
 * whichever comes first. A long page then paints its first screen without building every section (and
 * fetching every section's data) up front, yet all content is in the page shortly after load.
 * `minHeight` keeps the page from jumping while a section is still waiting.
 */
const DeferredMount = ({ children, minHeight = 480, rootMargin = '900px', idleMs = 2500 }) => {
  const ref = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (show) return undefined
    const node = ref.current
    let observer
    const reveal = () => setShow(true)
    if (node && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) reveal()
      }, { rootMargin })
      observer.observe(node)
    } else {
      reveal()
    }
    const timer = setTimeout(reveal, idleMs)
    return () => {
      clearTimeout(timer)
      if (observer) observer.disconnect()
    }
  }, [show, rootMargin, idleMs])

  if (show) return <>{children}</>
  return <div ref={ref} style={{ minHeight }} aria-hidden="true" />
}

export default DeferredMount

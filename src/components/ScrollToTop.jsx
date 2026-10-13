import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname, hash } = useLocation()
  const previousPath = useRef(pathname)

  useEffect(() => {
    const leftCart = previousPath.current === '/cart'
    previousPath.current = pathname
    if (pathname === '/cart' || leftCart) return
    if (hash) {
      const id = hash.slice(1)
      const scrollToHash = () => {
        const target = document.getElementById(id)
        if (!target) return false
        target.scrollIntoView({ block: 'start' })
        return true
      }
      if (!scrollToHash()) {
        const timer = window.setTimeout(scrollToHash, 250)
        return () => window.clearTimeout(timer)
      }
      return undefined
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default ScrollToTop

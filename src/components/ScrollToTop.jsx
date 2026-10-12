import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)

  useEffect(() => {
    const leftCart = previousPath.current === '/cart'
    previousPath.current = pathname
    if (pathname === '/cart' || leftCart) return
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop

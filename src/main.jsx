import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { SeoProvider } from './seo/SeoContext.jsx'
import './index.css'
import App from './App.jsx'

// The prerendered HTML carries this page's head tags for crawlers and link previews (scripts/prerender.mjs).
// Once the app runs, RouteSeo renders the same tags, so drop the static copies to avoid duplicates.
document.querySelectorAll('head [data-prerender]').forEach((node) => node.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <SeoProvider>
          <App />
        </SeoProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)

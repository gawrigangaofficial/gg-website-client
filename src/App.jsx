import React, { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import CookieConsent from './components/CookieConsent'
import RouteSeo from './components/RouteSeo'
import Footer from './components/Footer'
import ProductGuidanceWidget from './components/ProductGuidanceWidget'
import Loader from './components/Loader'
import { ToastProvider } from './components/Toaster'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { Routes, Route, Navigate, useLocation } from "react-router-dom"

const Home = lazy(() => import('./Pages/Home/Home'))
const Spray = lazy(() => import('./Pages/Spray/Spray'))
const AmratDharaProductPage = lazy(() => import('./Pages/Spray/AmratDharaProductPage'))
const MaitriProductPage = lazy(() => import('./Pages/Spray/MaitriProductPage'))
const ChakraBalanceProductPage = lazy(() => import('./Pages/Spray/ChakraBalanceProductPage'))
const ShuddhiProductPage = lazy(() => import('./Pages/Spray/ShuddhiProductPage'))
const Rudraksh = lazy(() => import('./Pages/Rudraksh/Rudraksh'))
const Rashi = lazy(() => import('./Pages/Rashi/Rashi'))
const RashiSignPage = lazy(() => import('./Pages/Rashi/RashiSignPage'))
const Accessories = lazy(() => import('./Pages/Accessories/Accessories'))
const TulsiMala = lazy(() => import('./Pages/TulsiMala/TulsiMala'))
const ProductPage = lazy(() => import('./Pages/ProductPage/ProductPage'))
const Cart = lazy(() => import('./Pages/Cart/Cart'))
const Wishlist = lazy(() => import('./Pages/Wishlist/Wishlist'))
const Auth = lazy(() => import('./Pages/Auth/Auth'))
const AuthCallback = lazy(() => import('./Pages/Auth/AuthCallback'))
const Profile = lazy(() => import('./Pages/Profile/Profile'))
const ViewDetails = lazy(() => import('./Pages/Profile/ViewDetails'))
const OrderSuccess = lazy(() => import('./Pages/Order/OrderSuccess'))
const OrderFailed = lazy(() => import('./Pages/Order/OrderFailed'))
const About = lazy(() => import('./Pages/About/About'))
const Blog = lazy(() => import('./Pages/Blog/Blog'))
const BlogSlugPage = lazy(() => import('./Pages/Blog/BlogSlugPage'))
const SeoGuidePage = lazy(() => import('./Pages/Blog/SeoGuidePage'))
const Contact = lazy(() => import('./Pages/Contact/Contact'))
const CorporateBulkOrder = lazy(() => import('./Pages/CorporateBulkOrder/CorporateBulkOrder'))
const TermsOfService = lazy(() => import('./Pages/Policies/TermsOfService'))
const RefundCancellation = lazy(() => import('./Pages/Policies/RefundCancellation'))
const TermsAndConditions = lazy(() => import('./Pages/Policies/TermsAndConditions'))
const ShippingPolicy = lazy(() => import('./Pages/Policies/ShippingPolicy'))
const PrivacyPolicy = lazy(() => import('./Pages/Policies/PrivacyPolicy'))
const PurposeProducts = lazy(() => import('./Pages/PurposeProducts/PurposeProducts'))
const ShopCollection = lazy(() => import('./Pages/Shop/ShopCollection'))
const Faq = lazy(() => import('./Pages/Faq/Faq'))
const Combos = lazy(() => import('./Pages/Combos/Combos'))
const NotFound = lazy(() => import('./Pages/NotFound/NotFound'))

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader />
  </div>
)


const App = () => {
  const location = useLocation();
  const isCartOpen = location.pathname === '/cart';
  const backgroundPath = location.state?.backgroundLocation?.pathname;
  const backgroundLocation = isCartOpen
    ? (backgroundPath && backgroundPath !== '/cart' ? location.state.backgroundLocation : { pathname: '/' })
    : location;

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="flex min-h-screen flex-col pb-[var(--gg-tabbar-offset)] md:pb-0">
              <RouteSeo />
              <ScrollToTop />
              <CookieConsent />
              <Navbar />
              <main className="flex-1">
                <Suspense fallback={<PageLoader />}>
                <Routes location={backgroundLocation}>
                  <Route path="/" element={<Home />} />
                  <Route path="/sprays" element={<Spray />} />
                  <Route path="/sprays/amrat-bindu" element={<AmratDharaProductPage />} />
                  <Route path="/sprays/amrat-dhara" element={<Navigate to="/sprays/amrat-bindu" replace />} />
                  <Route path="/sprays/maitri" element={<MaitriProductPage />} />
                  <Route path="/sprays/chakra-balance" element={<ChakraBalanceProductPage />} />
                  <Route path="/sprays/shuddhi" element={<ShuddhiProductPage />} />
                  <Route path="/rudraksha" element={<Rudraksh />} />
                  <Route path="/tulsimala" element={<TulsiMala />} />
                  <Route path="/rashi" element={<Rashi />} />
                  <Route path="/rashi/:slug" element={<RashiSignPage />} />
                  <Route path="/accessories" element={<Accessories />} />
                  <Route path="/purpose-products" element={<PurposeProducts />} />
                  <Route path="/shop/:slug" element={<ShopCollection />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/combos" element={<Combos />} />
                  <Route path="/product/:slug" element={<ProductPage />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders/:id" element={<ViewDetails />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/order-failed" element={<OrderFailed />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/guides/:slug" element={<SeoGuidePage />} />
                  <Route path="/blog/:slug" element={<BlogSlugPage />} />
                  <Route path="/blogs" element={<Blog />} />
                  <Route path="/blogs/:slug" element={<BlogSlugPage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/corporate-bulk-orders" element={<CorporateBulkOrder />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/refund-cancellation" element={<RefundCancellation />} />
                  <Route path="/return-policy" element={<Navigate to="/refund-cancellation" replace />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/signup" element={<Navigate to="/login" replace />} />
                  <Route path="/auth" element={<Navigate to="/login" replace />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </Suspense>
                {isCartOpen && (
                  <Suspense fallback={null}>
                    <Cart />
                  </Suspense>
                )}
              </main>
              <ProductGuidanceWidget />
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
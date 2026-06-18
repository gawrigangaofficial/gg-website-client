import React, { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import CookieConsent from './components/CookieConsent'
import LoginScrollPrompt from './components/LoginScrollPrompt'
import RouteSeo from './components/RouteSeo'
import Footer from './components/Footer'
import ProductGuidanceWidget from './components/ProductGuidanceWidget'
import Loader from './components/Loader'
import { ToastProvider } from './components/Toaster'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { Routes, Route, Navigate } from "react-router-dom"

const Home = lazy(() => import('./Pages/Home/Home'))
const Spray = lazy(() => import('./Pages/Spray/Spray'))
const AmratDharaProductPage = lazy(() => import('./Pages/Spray/AmratDharaProductPage'))
const MaitriProductPage = lazy(() => import('./Pages/Spray/MaitriProductPage'))
const ChakraBalanceProductPage = lazy(() => import('./Pages/Spray/ChakraBalanceProductPage'))
const ShuddhiProductPage = lazy(() => import('./Pages/Spray/ShuddhiProductPage'))
const Rudraksh = lazy(() => import('./Pages/Rudraksh/Rudraksh'))
const Rashi = lazy(() => import('./Pages/Rashi/Rashi'))
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
const BlogPostPage = lazy(() => import('./Pages/Blog/BlogPostPage'))
const Contact = lazy(() => import('./Pages/Contact/Contact'))
const CorporateBulkOrder = lazy(() => import('./Pages/CorporateBulkOrder/CorporateBulkOrder'))
const TermsOfService = lazy(() => import('./Pages/Policies/TermsOfService'))
const RefundCancellation = lazy(() => import('./Pages/Policies/RefundCancellation'))
const ReturnPolicy = lazy(() => import('./Pages/Policies/ReturnPolicy'))
const TermsAndConditions = lazy(() => import('./Pages/Policies/TermsAndConditions'))
const ShippingPolicy = lazy(() => import('./Pages/Policies/ShippingPolicy'))
const PrivacyPolicy = lazy(() => import('./Pages/Policies/PrivacyPolicy'))
const PurposeProducts = lazy(() => import('./Pages/PurposeProducts/PurposeProducts'))
const Combos = lazy(() => import('./Pages/Combos/Combos'))

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader />
  </div>
)


const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col">
              <RouteSeo />
              <ScrollToTop />
              <CookieConsent />
              <LoginScrollPrompt />
              <Navbar />
              <main className="flex-1">
                <Suspense fallback={<PageLoader />}>
                <Routes>
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
                  <Route path="/accessories" element={<Accessories />} />
                  <Route path="/purpose-products" element={<PurposeProducts />} />
                  <Route path="/combos" element={<Combos />} />
                  <Route path="/product/:slug" element={<ProductPage />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders/:id" element={<ViewDetails />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/order-failed" element={<OrderFailed />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/blogs" element={<Blog />} />
                  <Route path="/blogs/:slug" element={<BlogPostPage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/corporate-bulk-orders" element={<CorporateBulkOrder />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/refund-cancellation" element={<RefundCancellation />} />
                  <Route path="/return-policy" element={<ReturnPolicy />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/signup" element={<Auth />} />
                  <Route path="/auth" element={<Navigate to="/login" replace />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                </Routes>
                </Suspense>
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
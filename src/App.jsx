import React from 'react'
import Home from './Pages/Home/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Spray from './Pages/Spray/Spray'
import Rudraksh from './Pages/Rudraksh/Rudraksh'
import Rashi from './Pages/Rashi/Rashi'
import Accessories from './Pages/Accessories/Accessories'
import ProductPage from './Pages/ProductPage/ProductPage'
import Cart from './Pages/Cart/Cart'
import Wishlist from './Pages/Wishlist/Wishlist'
import Auth from './Pages/Auth/Auth'
import AuthCallback from './Pages/Auth/AuthCallback'
import Profile from './Pages/Profile/Profile'
import { ToastProvider } from './components/Toaster'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { Routes, Route } from "react-router-dom";


const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/sprays" element={<Spray />} />
                  <Route path="/rudraksha" element={<Rudraksh />} />
                  <Route path="/rashi" element={<Rashi />} />
                  <Route path="/accessories" element={<Accessories />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
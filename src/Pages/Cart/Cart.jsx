import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaBell } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/Toaster';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:3001');

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const toast = useToast();
  const { isAuthenticated, userEmail, userId, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [notifyLoading, setNotifyLoading] = useState(false);

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleQuantityChange = (productId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    clearCart();
    toast.success('Cart cleared');
  };

  const totalPrice = getTotalPrice();

  const showEmptyCart = cartItems.length === 0;

  const handleNotifyMe = async () => {
    if (cartItems.length === 0) {
      toast.info('Your cart is empty. Add items to preorder first.');
      return;
    }
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: '/cart' } } });
      toast.info('Please log in with your email so we can notify you when we launch.');
      return;
    }
    if (!userEmail) {
      toast.error('We need your email to notify you. Please use email login.');
      return;
    }
    setNotifyLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/preorders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId || null,
          email: userEmail,
          items: cartItems.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            quantity: item.quantity,
          })),
        }),
      });
      const json = await res.json();
      if (json.success) {
        clearCart();
        if (json.emailSent === false) {
          const reason = json.emailError ? ` (${json.emailError})` : '';
          toast.success(`Preorder saved! Confirmation email couldn't be sent${reason}; we'll still notify you at ${userEmail} when we launch.`);
        } else {
          toast.success(`You're on the list! We'll email you at ${userEmail} when we launch.`);
        }
      } else {
        toast.error(json.message || 'Could not save preorder. Try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setNotifyLoading(false);
    }
  };

  if (showEmptyCart) {
    return (
      <div className="min-h-screen py-8 sm:py-12 bg-linear-to-br from-orange-50/30 to-white">
        <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
          <Link
            to="/"
            className="mb-6 sm:mb-8 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <FaArrowLeft className="text-sm sm:text-base" />
            <span className="text-sm sm:text-base">Continue Shopping</span>
          </Link>

          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <FaShoppingCart className="text-6xl sm:text-8xl text-gray-300 mb-6" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-base sm:text-lg"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen py-4 sm:py-6 lg:py-8 bg-linear-to-br from-orange-50/30 to-white">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/"
            className="mb-4 sm:mb-6 flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <FaArrowLeft className="text-sm sm:text-base" />
            <span className="text-sm sm:text-base">Continue Shopping</span>
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
              Shopping Cart
            </h1>
            <button
              onClick={handleClearCart}
              className="text-sm sm:text-base text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-2 sm:space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg sm:rounded-xl shadow-md border border-primary/20 p-2 sm:p-4 md:p-6 flex gap-2 sm:gap-4"
              >
                {/* Product Image */}
                <Link
                  to={`/product/${item.id}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                >
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                </Link>

                {/* Product Details */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 hover:text-primary transition-colors mb-1 block line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    {item.subcategory && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 line-clamp-1">
                        {item.subcategory}
                        {item.deity && ` • ${item.deity}`}
                        {item.planet && ` • ${item.planet}`}
                      </p>
                    )}
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-primary">
                      ₹{item.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  {/* Quantity Controls and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                    <div className="flex items-center border-2 border-primary rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus className="text-xs sm:text-sm" />
                      </button>
                      <span className="px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-base md:text-lg font-semibold text-gray-900 min-w-8 sm:min-w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={item.quantity >= item.stock}
                      >
                        <FaPlus className="text-xs sm:text-sm" />
                      </button>
                    </div>

                    {/* Item Total - Hidden on very small screens */}
                    <div className="text-right hidden xs:block">
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-primary">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      aria-label="Remove item"
                    >
                      <FaTrash className="text-sm sm:text-base md:text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Preorder summary – no payment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md border border-primary/20 p-3 sm:p-4 md:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                Preorder summary
              </h2>

              <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-3 sm:mb-4 md:mb-6">
                <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-600">
                  <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>₹{totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  We&apos;re launching soon. Click &quot;Notify Me&quot; and we&apos;ll email you when we&apos;re live so you can buy.
                </p>
              </div>

              <button
                onClick={handleNotifyMe}
                disabled={cartItems.length === 0 || notifyLoading}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl mb-2 sm:mb-3 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaBell className="text-lg shrink-0" />
                {notifyLoading ? 'Saving…' : 'Notify Me When Launched'}
              </button>

              {!isAuthenticated && (
                <p className="text-xs text-amber-700 mb-2">
                  Log in with your email so we can notify you when we launch.
                </p>
              )}

              <Link
                to="/"
                className="block w-full text-center px-4 sm:px-6 py-2 sm:py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-all font-semibold text-xs sm:text-sm md:text-base"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Cart;

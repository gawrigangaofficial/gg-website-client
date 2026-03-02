import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegHeart, FaBars, FaTimes } from "react-icons/fa";
import { CgShoppingBag } from "react-icons/cg";
import logo from '../assets/gglogo.svg';
import { LuCircleUserRound } from "react-icons/lu";
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { getTotalItems } = useCart();
    const { getTotalItems: getWishlistCount } = useWishlist();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const cartCount = getTotalItems();
    const wishlistCount = getWishlistCount();
    const location = useLocation();

    const navItems = [
        {
            name: 'Home',
            href: '/',
        },
        {
            name: 'Sprays',
            href: '/sprays',
        },
        {
            name: 'Rudraksha',
            href: '/rudraksha',
        },
        {
            name: 'Accessories',
            href: '/accessories',
        },
        {
            name: 'Rashi',
            href: '/rashi',
        },
    ]

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleUserClick = () => {
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            navigate('/auth', { state: { from: location } });
        }
    };

    const isActive = (href) => {
        if (href === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(href);
    };
    
  return (
    <>
        <header className='bg-[white] shadow-md'>
            {/* Top Banner */}
            <div className='hidden md:flex items-center justify-evenly h-8 bg-primary text-white text-xs'>
                <p>Free Shipping</p>
                <p>Free Returns</p>
                <p>Secure Payment</p>
                <p>24/7 Support</p>
                <p>Shop Now</p>
            </div>
            
            {/* Mobile Top Banner - Simplified */}
            <div className='md:hidden flex items-center justify-center h-8 bg-primary text-white text-xs px-4'>
                <p className='text-center'>Free Shipping on All Orders</p>
            </div>

            {/* Main Navigation */}
            <nav className='flex justify-between items-center h-16 md:h-24 w-full px-4 md:px-6 lg:px-8'>
                {/* Logo */}
                <Link to="/" className='shrink-0'>
                    <img src={logo} alt="logo" className='w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18' />
                </Link>

                {/* Desktop Navigation Links */}
                <div className='hidden lg:flex items-center gap-6 xl:gap-10 w-full justify-center'>
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link 
                                key={item.name} 
                                to={item.href}
                                className={`list-none cursor-pointer font-medium transition-colors text-sm xl:text-base ${
                                    active 
                                        ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                                        : 'text-gray-700 hover:text-primary'
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side Icons */}
                <div className='flex items-center gap-4 md:gap-6 lg:gap-8'>
                    {/* Desktop Icons */}
                    <div className='hidden md:flex items-center gap-4 lg:gap-6'>
                        <Link to="/wishlist" className="relative">
                            <FaRegHeart className='text-primary text-xl lg:text-2xl cursor-pointer hover:scale-110 transition-transform' />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {wishlistCount > 99 ? '99+' : wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="relative">
                            <CgShoppingBag className='text-primary text-xl lg:text-2xl cursor-pointer hover:scale-110 transition-transform' />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                        <LuCircleUserRound 
                            onClick={handleUserClick}
                            className='text-primary text-xl lg:text-2xl cursor-pointer hover:scale-110 transition-transform'
                            title={isAuthenticated ? 'View Profile' : 'Sign In'}
                        />
                    </div>

                    {/* Mobile Icons - Only Cart and User */}
                    <div className='md:hidden flex items-center gap-4'>
                        <Link to="/cart" className="relative">
                            <CgShoppingBag className='text-primary text-xl cursor-pointer' />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                        <LuCircleUserRound 
                            onClick={handleUserClick}
                            className='text-primary text-xl cursor-pointer'
                            title={isAuthenticated ? 'View Profile' : 'Sign In'}
                        />
                    </div>

                    {/* Mobile Hamburger Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className='lg:hidden text-primary text-2xl cursor-pointer focus:outline-none'
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className='lg:hidden bg-white border-t border-gray-200 shadow-lg'>
                    <div className='flex flex-col py-4'>
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link 
                                    key={item.name} 
                                    to={item.href}
                                    onClick={closeMenu}
                                    className={`px-6 py-3 font-medium transition-colors text-base ${
                                        active 
                                            ? 'text-primary font-bold bg-primary/10 border-l-4 border-primary' 
                                            : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                        {/* Mobile Menu Heart Icon */}
                        <Link
                            to="/wishlist"
                            onClick={closeMenu}
                            className='flex items-center gap-3 px-6 py-3 text-gray-700 font-medium hover:text-primary hover:bg-primary/5 transition-colors text-base relative'
                        >
                            <FaRegHeart className='text-primary' />
                            <span>Wishlist</span>
                            {wishlistCount > 0 && (
                                <span className="ml-auto bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {wishlistCount > 99 ? '99+' : wishlistCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    </>
  )
}

export default Navbar

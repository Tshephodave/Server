import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/cartContext';

const Navbar = ({ user, setUser, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpaque, setIsOpaque] = useState(true);
  const { cart } = useContext(CartContext); // Get cart from context

  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post('https://server-h3fu.onrender.com/user/logout');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/'); // Redirect to home page instead of login
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsOpaque(window.scrollY <= 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Safe calculation of cart items with error handling
  const cartItemCount = Array.isArray(cart) 
    ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
    : 0;

  return (
    <nav className={`bg-gradient-to-r from-green-800 to-green-600 text-white py-4 shadow-lg sticky top-0 z-50 transition-opacity duration-500 ${isOpaque ? 'opacity-100' : 'opacity-70'}`}>
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
        <Link 
          to="/" 
          className="flex items-center text-white text-2xl font-black hover:text-green-100 transition-colors duration-200"
        >
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg mr-2 text-lg">E</span>
          ECD Store
        </Link>
        
        {/* Only show toggle button when user is logged in */}
        {user && (
          <button
            onClick={toggleMenu}
            className="text-white block md:hidden p-2 rounded-lg hover:bg-green-700/50 transition-colors duration-200"
            aria-label="Toggle menu"
            aria-expanded={isOpen ? 'true' : 'false'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        )}

        {/* Navigation menu - only show when user is logged in */}
        {user && (
          <div className={`absolute md:static top-16 left-0 right-0 bg-gradient-to-r from-green-800 to-green-600 md:bg-transparent shadow-2xl md:shadow-none border-t border-green-700 md:border-none ${
            isOpen ? 'block' : 'hidden'
          } md:flex flex-col md:flex-row md:items-center md:space-x-2`}>
            {loading ? (
              <div className="px-4 py-3 md:px-3 md:py-2">
                <div className="animate-pulse text-green-200 text-sm">Loading...</div>
              </div>
            ) : user && user.role === 'customer' ? (
              <>
                <Link 
                  to="/stock" 
                  className="flex items-center text-white text-lg font-semibold hover:bg-green-700/50 hover:text-green-100 transition-all duration-200 px-4 py-3 md:px-4 md:py-2 rounded-lg md:rounded-lg border border-transparent hover:border-green-500"
                >
                  <svg className="w-6 h-6 md:w-5 md:h-5 mr-3 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Items
                </Link>
                <Link 
                  to="/cart" 
                  className="flex items-center text-white text-lg font-semibold hover:bg-green-700/50 hover:text-green-100 transition-all duration-200 px-4 py-3 md:px-4 md:py-2 rounded-lg md:rounded-lg border border-transparent hover:border-green-500"
                >
                  <svg className="w-6 h-6 md:w-5 md:h-5 mr-3 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                  My Quotes
                  {cartItemCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/oderdetails" 
                  className="flex items-center text-white text-lg font-semibold hover:bg-green-700/50 hover:text-green-100 transition-all duration-200 px-4 py-3 md:px-4 md:py-2 rounded-lg md:rounded-lg border border-transparent hover:border-green-500"
                >
                  <svg className="w-6 h-6 md:w-5 md:h-5 mr-3 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  My Sent Quotes
                </Link>
                <button 
                  onClick={logout} 
                  className="flex items-center w-full text-left text-white text-lg font-semibold hover:bg-green-700/50 hover:text-green-100 transition-all duration-200 px-4 py-3 md:px-4 md:py-2 rounded-lg md:rounded-lg border border-transparent hover:border-green-500"
                >
                  <svg className="w-6 h-6 md:w-5 md:h-5 mr-3 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : user && user.role === 'admin' ? (
              <>
                <Link 
                  to="/add-product" 
                  className="flex items-center text-white text-lg font-semibold hover:bg-green-700/50 hover:text-green-100 transition-all duration-200 px-4 py-3 md:px-4 md:py-2 rounded-lg md:rounded-lg border border-transparent hover:border-green-500"
                >
                  <svg className="w-6 h-6 md:w-5 md:h-5 mr-3 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </Link>
                <Link 
                  to="/stock" 
                  className="flex items-center text-white text-lg font-semibold hover:bg-green-700/50 hover:text-green-100 transition-all duration-200 px-4 py-3 md:px-4 md:py-2 rounded-lg md:rounded-lg border border-transparent hover:border-green-500"
                >
                  <svg className="w-6 h-6 md:w-5 md:h-5 mr-3 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Products
                </Link>
                <button 
                  onClick={logout} 
                  className="flex items-center w-full text-left text-white text-lg font-semibold hover:bg-green-700/50 hover:text-green-100 transition-all duration-200 px-4 py-3 md:px-4 md:py-2 rounded-lg md:rounded-lg border border-transparent hover:border-green-500"
                >
                  <svg className="w-6 h-6 md:w-5 md:h-5 mr-3 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

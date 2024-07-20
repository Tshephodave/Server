import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ user, setUser, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpaque, setIsOpaque] = useState(true);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post('https://server-h3fu.onrender.com/user/logout');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsOpaque(false);
      } else {
        setIsOpaque(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`bg-gradient-to-r from-green-800 to-green-600 text-white text-center py-4 shadow-md sticky top-0 z-50 transition-opacity duration-500 ${isOpaque ? 'opacity-100' : 'opacity-70'}`}>
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
        <Link to="/" className="flex items-center text-white text-2xl font-bold hover:text-gray-200">
          Vivlia online Store
        </Link>
        <button
          onClick={toggleMenu}
          className="text-white block md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen ? 'true' : 'false'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
          </svg>
        </button>
        <div className={`flex flex-col md:flex-row md:items-center ${isOpen ? 'block' : 'hidden'} md:block`}>
          {loading ? (
            <p className="text-white text-lg px-3 py-2">Loading...</p>
          ) : !user ? (
            <>
              <Link to="/register" className="text-white text-lg hover:text-gray-200 transition duration-200 ease-in-out px-3 py-2">
                Register
              </Link>
              <Link to="/login" className="text-white text-lg hover:text-gray-200 transition duration-200 ease-in-out px-3 py-2">
                Login
              </Link>
            </>
          ) : user.role === 'customer' ? (
            <>
              <Link to="/stock" className="text-white text-lg hover:text-gray-200 transition duration-200 ease-in-out px-3 py-2">
                Items
              </Link>
              <Link to="/cart" className="text-white text-lg hover:text-gray-200 transition duration-200 ease-in-out px-3 py-2">
                MyCart
              </Link>
              <Link to="/oderdetails" className="text-white text-lg hover:text-gray-200 transition duration-200 ease-in-out px-3 py-2">
                My Order Details
              </Link>
              <button onClick={logout} className="text-white text-lg hover:text-gray-200 transition duration-200 ease-in-out px-3 py-2">
                Logout
              </button>
            </>
          ) : user.role === 'admin' ? (
            <>
              <Link to="/add-product" className="text-white text-lg hover:text-gray-200 transition duration-200 ease-in-out px-3 py-2">
                Add Product
              </Link>
              <Link to="/stock" className="text-white text-lg hover:text-gray-200 transition duration-200 ease-in-out px-3 py-2">
                List of Products
              </Link>
              <button onClick={logout} className="text-white text-lg hover:text-gray-200 transition duration-200 ease-in-out px-3 py-2">
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

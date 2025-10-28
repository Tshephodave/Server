import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CartContext } from '../context/cartContext';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import Modal from 'react-modal';
import Login from '../pages/Login';

const ProductList = ({ setUser }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useContext(CartContext);
  const [userRole, setUserRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductForCart, setSelectedProductForCart] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    itemCode: '',
    name: '',
    picture: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [noProductsFound, setNoProductsFound] = useState(false);
  const [sortOption, setSortOption] = useState('name');
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        };
        const response = await axios.get("https://server-h3fu.onrender.com/product/getProducts", config);
        setProducts(response.data.products);
      } catch (error) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { userId } = jwtDecode(token);
          const response = await axios.get(`https://server-h3fu.onrender.com/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserRole(response.data.role);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    fetchProducts();
    fetchUserRole();
  }, []);

  // Clear hover states when modals open
  useEffect(() => {
    if (isModalOpen || isLoginModalOpen) {
      setHoveredProduct(null);
    }
  }, [isModalOpen, isLoginModalOpen]);

  const handleAddToCart = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSelectedProductForCart(product);
      setIsLoginModalOpen(true);
      // Clear hover state when opening modal
      setHoveredProduct(null);
      return;
    }
    if (userRole !== 'customer') {
      setMessage('Only customers can add items to cart.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    addToCart(product);
    setMessage(`${product.name} added to cart!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSuccessfulLogin = (user) => {
    setUserRole(user.role);
    setIsLoginModalOpen(false);
    
    // Update the global user state to refresh navbar
    if (setUser) {
      setUser(user);
    }
    
    if (selectedProductForCart) {
      addToCart(selectedProductForCart);
      setMessage(`${selectedProductForCart.name} added to cart!`);
      setTimeout(() => setMessage(''), 3000);
      setSelectedProductForCart(null);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in to manage products.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        await axios.delete(`https://server-h3fu.onrender.com/product/deleteProduct/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(products.filter(product => product._id !== productId));
        setMessage('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        setMessage('Error deleting product');
      } finally {
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { name: searchTerm }
      };
      const response = await axios.get(`https://server-h3fu.onrender.com/product/searchProducts`, config);

      if (response.data.products.length === 0) {
        setNoProductsFound(true);
      } else {
        setNoProductsFound(false);
        setProducts(response.data.products);
      }
    } catch (error) {
      setError('Error searching for products');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in to update products.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      await axios.put(`https://server-h3fu.onrender.com/product/updateProduct/${selectedProduct._id}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.map(product => product._id === selectedProduct._id ? updatedProduct : product));
      setIsModalOpen(false);
      setMessage('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Error updating product');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const openModal = (product) => {
    const token = localStorage.getItem('token');
    if (!token || userRole !== 'admin') {
      setMessage('Only admins can edit products. Please log in as admin.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    setSelectedProduct(product);
    setUpdatedProduct(product);
    setIsModalOpen(true);
    // Clear hover state when opening modal
    setHoveredProduct(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setHoveredProduct(null);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setSelectedProductForCart(null);
    setHoveredProduct(null);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'code':
        return a.itemCode.localeCompare(b.itemCode);
      default:
        return 0;
    }
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  if (loading) return <Loading />;

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Our Products</h1>
          <p className="text-gray-600 text-lg">Discover our amazing collection of items</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            message.includes('Error') || message.includes('Please log in') 
              ? 'bg-red-50 border-red-500 text-red-700' 
              : 'bg-green-50 border-green-500 text-green-700'
          }`}>
            <div className="flex items-center">
              <span className="text-lg mr-2">{message.includes('Error') || message.includes('Please log in') ? '❌' : '✅'}</span>
              <div>
                <p className="font-semibold">{message.includes('Error') || message.includes('Please log in') ? 'Notice' : 'Success'}</p>
                <p>{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products by name..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full lg:w-48">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="code">Sort by Code</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full lg:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentProducts.map(product => (
                <div 
                  key={product._id} 
                  className={`bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full ${
                    hoveredProduct === product._id && !isModalOpen && !isLoginModalOpen
                      ? 'transform scale-105 shadow-2xl z-10' 
                      : 'hover:shadow-xl'
                  }`}
                  onMouseEnter={() => !isModalOpen && !isLoginModalOpen && setHoveredProduct(product._id)}
                  onMouseLeave={() => !isModalOpen && !isLoginModalOpen && setHoveredProduct(null)}
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={product.picture} 
                      alt={product.name} 
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
                      {product.itemCode}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className={`text-lg font-semibold text-gray-800 mb-2 transition-all duration-200 ${
                        hoveredProduct === product._id && !isModalOpen && !isLoginModalOpen ? 'line-clamp-none' : 'line-clamp-2'
                      }`}>
                        {product.name}
                      </h3>
                    </div>
                    
                    {/* Action Buttons - Fixed at bottom */}
                    <div className="mt-auto pt-3">
                      {userRole === 'customer' && (
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to Quotes
                        </button>
                      )}
                      {userRole === 'admin' && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openModal(product)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(product._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                      {!userRole && (
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Login to Add to Quotes
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <p className="text-gray-600">
                  Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)} of {sortedProducts.length} products
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                      currentPage === 1 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                      currentPage === totalPages 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-6">We couldn't find any products matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setNoProductsFound(false);
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              View All Products
            </button>
          </div>
        )}

        {/* Update Product Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Update Product"
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Update Product</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleUpdate} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Item Code</label>
                  <input
                    type="text"
                    value={updatedProduct.itemCode}
                    onChange={(e) => setUpdatedProduct({ ...updatedProduct, itemCode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={updatedProduct.name}
                    onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={updatedProduct.picture}
                    onChange={(e) => setUpdatedProduct({ ...updatedProduct, picture: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Update Product
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Login Modal - With proper spacing from navbar */}
        <Modal
          isOpen={isLoginModalOpen}
          onRequestClose={closeLoginModal}
          contentLabel="Login"
          className="fixed inset-0 flex items-start justify-center z-50 p-4 pt-24"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto mt-8">
            <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-800">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Sign in to Continue</h2>
                <button
                  onClick={closeLoginModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <Login 
                setUser={setUser}
                onSuccessfulLogin={handleSuccessfulLogin} 
                onCancel={closeLoginModal}
                context="modal"
              />
            </div>
          </div>
        </Modal>

        {/* No Products Found Modal */}
        <Modal
          isOpen={noProductsFound}
          onRequestClose={() => setNoProductsFound(false)}
          contentLabel="No Products Found"
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h2>
            <p className="text-gray-600 mb-6">Sorry, we couldn't find any products matching your search term.</p>
            <button
              onClick={() => setNoProductsFound(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProductList;

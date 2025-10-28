import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/cartContext';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsFileText, BsFileMinus, BsFilePlus, BsCheckCircle } from "react-icons/bs";
import { FiShoppingBag, FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiFileText, FiSend, FiX, FiCheck } from "react-icons/fi";

const Cart = () => {
  const { cart, addToCart, removeFromCart, clearCart, decreaseQuantity } = useContext(CartContext);
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };

  // Calculate total number of items
  const numberOfItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product.price || 0) * (item.quantity || 0);
    }, 0);
  };

  // Calculate item subtotal
  const calculateSubtotal = (item) => {
    return (item.product.price || 0) * (item.quantity || 0);
  };

  const handleRequestQuote = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Authentication required. Please log in to submit a quotation request.', 'warning');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      showToast('Please add items to your quotation request before submitting.', 'warning');
      return;
    }

    try {
      const response = await axios.post(
        'https://server-h3fu.onrender.com/order/placeOrder',
        {
          products: cart.map(item => ({ 
            productId: item.product._id, 
            quantity: item.quantity 
          })),
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        // Show success modal instead of toast
        setShowSuccessModal(true);
        clearCart();
      } else {
        showToast('Unable to process your quote request at this time. Please try again.', 'error');
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Network error occurred. Please check your connection and try again.', 
        'error'
      );
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/stock');
  };

  const handleClearQuote = () => {
    if (cart.length === 0) {
      showToast('Your quotation request is currently empty.', 'info');
      return;
    }

    setToast({
      show: true,
      message: 'Are you sure you want to clear all items from your quotation request?',
      type: 'confirm',
      onConfirm: () => {
        clearCart();
        showToast('Quotation request has been cleared.', 'success');
      },
      onCancel: () => setToast({ show: false, message: '', type: '' })
    });
  };

  const handleDecreaseQuantity = (productId) => {
    setToast({
      show: true,
      message: 'Remove one quantity of this item from your quotation?',
      type: 'confirm',
      onConfirm: () => {
        decreaseQuantity(productId);
        showToast('Item quantity updated.', 'info');
      },
      onCancel: () => setToast({ show: false, message: '', type: '' })
    });
  };

  const handleRemoveItem = (productId, productName) => {
    setToast({
      show: true,
      message: `Remove "${productName}" from your quotation request?`,
      type: 'confirm',
      onConfirm: () => {
        removeFromCart(productId);
        showToast('Item removed from quotation request.', 'info');
      },
      onCancel: () => setToast({ show: false, message: '', type: '' })
    });
  };

  if (cart.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="text-6xl text-gray-300 mb-6">📋</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Quote Request is Empty</h2>
              <p className="text-gray-600 mb-8 text-lg">
                You haven't added any items to your quotation request yet. Browse our products and add items to get a customized quote.
              </p>
              <button
                onClick={() => navigate('/stock')}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center mx-auto"
              >
                <FiShoppingBag className="w-5 h-5 mr-2" />
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="p-8 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck className="w-10 h-10 text-green-600" />
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Quotation Request Sent!
              </h2>
              
              {/* Message */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your quotation request has been successfully submitted. One of our agents will reach out to you shortly with your customized quote.
              </p>
              
              {/* Additional Info */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-700">
                  <strong>What's next?</strong><br />
                  • You'll receive a confirmation email<br />
                  • Our team will review your request<br />
                  • We'll contact you within 24 hours
                </p>
              </div>
              
              {/* Action Button */}
              <button
                onClick={handleSuccessModalClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
              >
                <FiShoppingBag className="w-5 h-5 mr-2" />
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Toast Notifications */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div className={`rounded-lg shadow-lg border p-4 ${
            toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            toast.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
            toast.type === 'confirm' ? 'bg-blue-50 border-blue-200 text-blue-800' :
            'bg-gray-50 border-gray-200 text-gray-800'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium">{toast.message}</p>
                {toast.type === 'confirm' && (
                  <div className="flex space-x-3 mt-3">
                    <button
                      onClick={() => {
                        toast.onConfirm?.();
                        setToast({ show: false, message: '', type: '' });
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        toast.onCancel?.();
                        setToast({ show: false, message: '', type: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              {toast.type !== 'confirm' && (
                <button
                  onClick={() => setToast({ show: false, message: '', type: '' })}
                  className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!showSuccessModal && (
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/stock')}
              className="flex items-center text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Continue Browsing
            </button>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-green-800 mb-2">Quotation Request</h1>
              <p className="text-gray-600">Review your selected items and submit for pricing</p>
            </div>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quote Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-green-50">
                  <h2 className="text-xl font-semibold text-green-800 flex items-center">
                    <FiFileText className="w-6 h-6 mr-2" />
                    Selected Items ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cart.map(item => (
                    <div key={item.product._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={item.product.picture} 
                            alt={item.product.name} 
                            className="w-24 h-24 object-contain rounded-lg border border-gray-200 bg-white p-2"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            Item Code: {item.product.itemCode}
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            R {item.product.price?.toFixed(2) || '0.00'}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleDecreaseQuantity(item.product._id)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 text-gray-600 hover:text-red-600"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          
                          <span className="w-12 text-center font-semibold text-gray-700 bg-gray-50 py-1 rounded border">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => {
                              addToCart(item.product);
                              showToast('Item quantity increased.', 'info');
                            }}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 text-gray-600 hover:text-green-600"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Subtotal and Delete */}
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Estimated Subtotal</p>
                            <p className="text-lg font-bold text-green-600">
                              R {calculateSubtotal(item).toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.product._id, item.product.name)}
                            className="w-10 h-10 flex items-center justify-center bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 text-red-500 hover:text-red-700"
                            title="Remove from quotation"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quote Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg sticky top-8">
                <div className="p-6 border-b border-gray-200 bg-green-50">
                  <h2 className="text-xl font-semibold text-green-800 flex items-center">
                    <FiFileText className="w-6 h-6 mr-2" />
                    Quotation Summary
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Items</span>
                    <span className="font-semibold">{numberOfItems}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-800 font-semibold">Estimated Total</span>
                    <span className="text-2xl font-bold text-green-600">
                      R {calculateTotal().toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <button
                      onClick={handleRequestQuote}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                    >
                      <FiSend className="w-5 h-5 mr-2" />
                      Submit Quotation Request
                    </button>
                    
                    <button
                      onClick={handleClearQuote}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <FiTrash2 className="w-5 h-5 mr-2" />
                      Clear All Items
                    </button>
                  </div>

                  {/* Additional Info */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500 space-y-2">
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Competitive wholesale pricing
                      </p>
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Volume discounts available
                      </p>
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Same-day quotation response
                      </p>
                      <p className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Customized solutions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

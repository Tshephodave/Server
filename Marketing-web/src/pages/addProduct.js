import React, { useState } from 'react';
import axios from 'axios';

function AddProduct() {
  const [formData, setFormData] = useState({
    itemCode: '',
    name: '',
    price: '',
    picture: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://server-h3fu.onrender.com/product/addproduct', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setMessageType('success');
      setMessage(response.data.message || 'Product added successfully!');
      
      // Reset form
      setFormData({
        itemCode: '',
        name: '',
        price: '',
        picture: '',
      });
      
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Error adding product. Please try again.');
    } finally {
      setLoading(false);
      // Auto-clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const clearForm = () => {
    setFormData({
      itemCode: '',
      name: '',
      price: '',
      picture: '',
    });
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Add New Product</h1>
          <p className="text-gray-600 text-lg">Fill in the details below to add a new product to your catalog</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            messageType === 'error' 
              ? 'bg-red-50 border-red-500 text-red-700' 
              : 'bg-green-50 border-green-500 text-green-700'
          }`}>
            <div className="flex items-center">
              <span className="text-lg mr-2">{messageType === 'error' ? '❌' : '✅'}</span>
              <div>
                <p className="font-semibold">{messageType === 'error' ? 'Error' : 'Success'}</p>
                <p>{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Code */}
              <div>
                <label htmlFor="itemCode" className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="itemCode"
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter unique item code"
                  required
                />
              </div>

              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="picture" className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="picture"
                  name="picture"
                  value={formData.picture}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {formData.picture && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                    <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
                      <img 
                        src={formData.picture} 
                        alt="Preview" 
                        className="max-h-32 object-contain rounded"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150x150?text=Invalid+URL';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Product
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={clearForm}
                  disabled={loading}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Form
                </button>
              </div>
            </form>

            {/* Form Tips */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">📝 Form Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Item Code should be unique for each product
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Use descriptive product names for better searchability
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Ensure image URLs are accessible and in common formats (JPG, PNG, etc.)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Price should be in numerical format without currency symbols
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Preview Section */}
        {formData.name && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Preview</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                      {formData.picture ? (
                        <img 
                          src={formData.picture} 
                          alt="Preview" 
                          className="w-full h-full object-contain rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="text-gray-400 text-sm text-center">No Image</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="mb-2">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {formData.itemCode || 'CODE-001'}
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {formData.name || 'Product Name'}
                    </h4>
                    <p className="text-2xl font-bold text-green-600">
                      ${formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddProduct;

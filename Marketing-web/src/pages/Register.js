import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faPerson, faTimes } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

library.add(faUser, faEnvelope, faPhone, faMapMarkerAlt, faPerson, faTimes);

const Register = ({ onSuccessfulRegister, onCancel, context = 'page', setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    agent: '',
    address: '',
    role: 'customer' // Default role set to customer
  });

  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /\d{3}-\d{3}-\d{4}/; 
    return regex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setErrors({
        ...errors,
        email: validateEmail(value) ? '' : 'Invalid email format'
      });
    }

    if (name === 'phone') {
      setErrors({
        ...errors,
        phone: validatePhone(value) ? '' : 'Invalid phone format'
      });
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (errors.email || errors.phone) {
      alert('Please fix the errors in the form');
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({...errors, email: 'Invalid email format'});
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrors({...errors, phone: 'Invalid phone format'});
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://server-h3fu.onrender.com/user/register', formData);
      setSuccessMessage('Account created successfully! Logging you in...');
      
      try {
        const loginResponse = await axios.post('https://server-h3fu.onrender.com/user/login', {
          email: formData.email
        });
        
        const token = loginResponse.data.token;
        localStorage.setItem('token', token);

        const { userId } = jwtDecode(token);
        const userResponse = await axios.get(`https://server-h3fu.onrender.com/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = userResponse.data;

        if (setUser) {
          setUser(userData);
        }

        if (context === 'modal' && onSuccessfulRegister) {
          setTimeout(() => {
            onSuccessfulRegister(userData);
          }, 1500);
        } else {
          setTimeout(() => {
            navigate('/');
          }, 1500);
        }
        
      } catch (loginError) {
        setSuccessMessage('Account created successfully! Please log in with your email.');
        
        if (context === 'modal' && onSuccessfulRegister) {
          setTimeout(() => {
            onSuccessfulRegister();
          }, 2000);
        }
      }
      
      setFormData({
        username: '',
        email: '',
        phone: '',
        agent: '',
        address: '',
        role: 'customer'
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/');
    }
  };

  return (
    <div className={`${context === 'modal' 
      ? 'h-full' 
      : 'min-h-screen bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center p-4'
    }`}>
      <div className={`${context === 'modal' 
        ? 'h-full flex flex-col' 
        : 'w-full max-w-2xl'
      }`}>
        <div className={`bg-white ${context === 'modal' 
          ? 'flex-1 flex flex-col rounded-none' 
          : 'rounded-2xl shadow-2xl p-4 sm:p-6'
        }`}>
          
          {/* Header - More Compact */}
          <div className={`${context === 'modal' 
            ? 'p-4 border-b border-gray-200 flex-shrink-0' 
            : 'text-center mb-4'
          }`}>
            {context === 'modal' ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon="user" className="text-white text-xs" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-600 text-xs">Join us today</p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-lg"
                >
                  <FontAwesomeIcon icon="times" className="text-base" />
                </button>
              </div>
            ) : (
              <>
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center mb-2">
                  <FontAwesomeIcon icon="user" className="text-white text-base" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">Create Account</h2>
                <p className="text-gray-600 text-sm">Join us today and start shopping</p>
              </>
            )}
          </div>

          {/* Content Area - No Scroll */}
          <div className={`${context === 'modal' 
            ? 'flex-1 p-4' 
            : ''
          }`}>
            
            {/* Success Message */}
            {successMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center mb-3">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-xs">{successMessage}</span>
                </div>
              </div>
            )}

            {/* Account Type Info */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-blue-700 text-xs font-medium">All new accounts are created as Customer accounts</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Username */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon="user" className="text-gray-400 text-xs" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-xs"
                      placeholder="Enter username"
                      required
                      disabled={loading || successMessage}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon="envelope" className="text-gray-400 text-xs" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-xs"
                      placeholder="user@gmail.com"
                      required
                      disabled={loading || successMessage}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Agent */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">Agent</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon="person" className="text-gray-400 text-xs" />
                    </div>
                    <input
                      type="text"
                      name="agent"
                      value={formData.agent}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-xs"
                      placeholder="Agent name"
                      required
                      disabled={loading || successMessage}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon="phone" className="text-gray-400 text-xs" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-xs"
                      placeholder="071-343-0009"
                      required
                      disabled={loading || successMessage}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Address - Full width on mobile, spans 2 columns on desktop */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon="map-marker-alt" className="text-gray-400 text-xs" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-xs"
                      placeholder="Enter your full address"
                      required
                      disabled={loading || successMessage}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className={`pt-3 ${context === 'modal' ? 'border-t border-gray-200 mt-3' : ''}`}>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button 
                    type="submit" 
                    disabled={loading || successMessage}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                  
                  {context === 'modal' && (
                    <button 
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Additional info for page context */}
                {context !== 'modal' && (
                  <div className="mt-3 text-center">
                    <p className="text-gray-600 text-xs">
                      Already have an account?{' '}
                      <button 
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-green-600 hover:text-green-700 font-semibold underline"
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

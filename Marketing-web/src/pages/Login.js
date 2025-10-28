import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { jwtDecode } from 'jwt-decode'; 
import Modal from 'react-modal';
import Register from './Register';

library.add(faEnvelope);

Modal.setAppElement('#root');

const Login = ({ setUser, onSuccessfulLogin, onCancel, context = 'page' }) => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError('');
      const response = await axios.post('https://server-h3fu.onrender.com/user/login', formData);
      const token = response.data.token;
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

      if (onSuccessfulLogin) {
        onSuccessfulLogin(userData);
      }

      if (context === 'page') {
        navigate('/');  
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (context === 'page') {
      navigate('/');
    }
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleRegisterSuccess = () => {
    closeRegisterModal();
  };

  return (
    <>
      <div className={`${context === 'modal' 
        ? 'h-full' 
        : 'min-h-screen bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center p-4'
      }`}>
        <div className={`${context === 'modal' 
          ? 'h-full flex flex-col' 
          : 'w-full max-w-md'
        }`}>
          <div className={`bg-white ${context === 'modal' 
            ? 'flex-1 flex flex-col rounded-none' 
            : 'rounded-xl shadow-xl p-4'
          }`}>
            
            {/* Header - Same styling as registration */}
            <div className={`${context === 'modal' 
              ? 'p-4 border-b border-gray-200 flex-shrink-0' 
              : 'text-center mb-4'
            }`}>
              {context === 'modal' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon="envelope" className="text-white text-xs" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">Sign In</h2>
                      <p className="text-gray-600 text-xs">Welcome back</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center mb-2">
                    <FontAwesomeIcon icon="envelope" className="text-white text-base" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Sign In</h2>
                  <p className="text-gray-600 text-sm">Welcome back to your account</p>
                </>
              )}
            </div>

            {/* Content Area */}
            <div className={`${context === 'modal' 
              ? 'flex-1 p-4' 
              : ''
            }`}>
              
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center mb-3">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-xs">{error}</span>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">Email Address</label>
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
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className={`pt-3 ${context === 'modal' ? 'border-t border-gray-200 mt-3' : ''}`}>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-800 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
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

                  {/* Register Link */}
                  <div className="text-center pt-3">
                    <p className="text-xs text-gray-600">
                      Don't have an account?{' '}
                      <button 
                        type="button"
                        onClick={openRegisterModal}
                        className="font-semibold text-green-600 hover:text-green-700 transition-colors duration-200 underline"
                      >
                        Create account
                      </button>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal - Fixed spacing and mobile optimization */}
      <Modal
        isOpen={isRegisterModalOpen}
        onRequestClose={closeRegisterModal}
        contentLabel="Create Account"
        className="fixed inset-0 flex items-start justify-center z-50 p-3 pt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
      >
        <div className="bg-white w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-xl shadow-2xl mx-3">
          {/* Modal Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-800 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Create Account</h2>
              <button
                onClick={closeRegisterModal}
                className="text-white hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-green-700 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Modal Content - Scrollable */}
          <div className="max-h-[calc(85vh-80px)] overflow-y-auto">
            <Register 
              setUser={setUser}
              onSuccessfulRegister={handleRegisterSuccess}
              onCancel={closeRegisterModal}
              context="modal"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Login;

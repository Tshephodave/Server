import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import { FiFileText, FiCalendar, FiCheckCircle, FiClock, FiSend, FiDollarSign, FiUser, FiMessageSquare } from 'react-icons/fi';

const OrderConfirmation = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get("https://server-h3fu.onrender.com/order/confirmation", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Handle different possible response structures
        const ordersData = response.data.orders || response.data || [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (error.response?.status === 401) {
          setError('Session expired. Please log in again.');
        } else if (error.response?.status === 404) {
          setError('Orders endpoint not found. Please contact support.');
        } else {
          setError('Unable to load quotation requests. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'approved':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
      case 'reviewing':
        return <FiClock className="w-5 h-5 text-blue-500" />;
      case 'sent':
      case 'submitted':
        return <FiSend className="w-5 h-5 text-orange-500" />;
      default:
        return <FiFileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
      case 'reviewing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sent':
      case 'submitted':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const calculateOrderTotal = (order) => {
    if (!order || !order.products || !Array.isArray(order.products)) return 0;
    
    return order.products.reduce((total, product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getTotalItems = (order) => {
    if (!order || !order.products || !Array.isArray(order.products)) return 0;
    
    return order.products.reduce((total, product) => {
      return total + (parseInt(product.quantity) || 0);
    }, 0);
  };

  // Safe array length check
  const totalOrders = Array.isArray(orders) ? orders.length : 0;

  if (loading) return <Loading />;

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Quotes</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex space-x-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/stock'}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">My Quotation Requests</h1>
          <p className="text-gray-600 text-lg">All your submitted quotation requests</p>
        </div>

        {/* Order Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{totalOrders}</div>
            <div className="text-sm text-gray-500">Total Quote Requests</div>
          </div>
        </div>

        {/* Orders Grid */}
        {!Array.isArray(orders) || orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Quotes Found</h3>
            <p className="text-gray-500 mb-6">
              You haven't submitted any quotation requests yet.
            </p>
            <button
              onClick={() => window.location.href = '/stock'}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Request a Quote
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order?._id || Math.random()} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200 bg-green-50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    <div className="flex items-center space-x-4">
                      <FiFileText className="w-8 h-8 text-green-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Quote #{order?._id?.slice(-8)?.toUpperCase() || 'N/A'}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <FiCalendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {formatDate(order?.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order?.status)} flex items-center space-x-1`}>
                        {getStatusIcon(order?.status)}
                        <span className="capitalize">{order?.status || 'Submitted'}</span>
                      </span>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-lg font-bold text-green-600">
                          <span>R {calculateOrderTotal(order).toFixed(2)}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {getTotalItems(order)} items
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Products */}
                <div className="p-6">
                  <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center">
                    <FiFileText className="w-5 h-5 mr-2 text-green-600" />
                    Requested Items
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(order?.products) && order.products.map((product, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={product?.picture} 
                          alt={product?.name} 
                          className="w-16 h-16 object-contain rounded-lg border border-gray-200 bg-white p-1"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-800 truncate">{product?.name || 'Unnamed Product'}</h5>
                          <p className="text-sm text-gray-500">Code: {product?.itemCode || 'N/A'}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-600">Qty: {product?.quantity || 0}</span>
                            <span className="text-sm font-semibold text-green-600">
                              R {((product?.price) || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Additional Notes */}
                    {order?.notes && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center">
                          <FiMessageSquare className="w-5 h-5 mr-2 text-green-600" />
                          Additional Notes
                        </h4>
                        <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
                          {order.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Agent Response */}
                  {order?.agentResponse && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-md font-semibold text-blue-700 mb-2 flex items-center">
                        <FiMessageSquare className="w-5 h-5 mr-2" />
                        Agent Response
                      </h4>
                      <p className="text-sm text-blue-600">{order.agentResponse}</p>
                      {order.agentName && (
                        <p className="text-xs text-blue-500 mt-2">
                          - {order.agentName}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;

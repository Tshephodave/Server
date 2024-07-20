
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from './components/Loading'; 

const OrderConfirmation = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("https://server-h3fu.onrender.com/order/confirmation", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setOrders(response.data.orders);
      } catch (error) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Loading/>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-green-600">Order Confirmation</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-600"><strong>Total Price:</strong> R{order.totalPrice.toFixed(2)}</p>
              <h3 className="text-lg font-bold mt-4">Products:</h3>
              <ul>
                {order.products.map(product => (
                  <li key={product.product} className="mb-4 flex items-center">
                    <img src={product.picture} alt={product.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                    <div>
                      <p className="text-gray-600"><strong>Item Code:</strong> {product.itemCode}</p>
                     <p className="text-gray-600"><strong>Name:</strong> {product.name}</p>
                      <p className="text-gray-600"><strong>Quantity:</strong> {product.quantity}</p>
                      <p className="text-gray-600"><strong>Price:</strong> R{product.price.toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;

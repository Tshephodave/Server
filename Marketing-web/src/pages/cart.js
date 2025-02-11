import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/cartContext';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsFillCartPlusFill } from "react-icons/bs";

const Cart = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Corrected function to sum the total quantity of items
  const NumberofItems = () => {
    return cart.reduce((total, item) => {
      return total + item.quantity; // Summing up quantities instead of multiplying
    }, 0);
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to checkout.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'https://server-h3fu.onrender.com/order/placeOrder',
        {
          products: cart.map(item => ({ productId: item.product._id, quantity: item.quantity })),
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        alert('Order placed successfully!');
        clearCart();
      } else {
        alert('Failed to place order.');
      }
    } catch (error) {
      alert('Error placing order: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-4xl font-bold mb-6 text-center text-green-600">Your Cart</h2>
      <div className="divide-y divide-gray-200">
        {cart.map(item => (
          <div key={item.product._id} className="py-4 flex items-center space-x-4 bg-white shadow-md rounded-lg p-4 mb-4">
            <img src={item.product.picture} alt={item.product.name} className="w-20 h-20 object-cover rounded-md" />
            <div className="flex-1">
              <div className="text-xl text-green-600 font-semibold">{item.product.name}</div>
              <div className="text-green-600">Quantity: {item.quantity}</div> {/* Fixed incorrect calculation */}
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => removeFromCart(item.product._id)} className="text-gray-500 hover:text-red-500 focus:outline-none">
                <RiDeleteBin6Line />
              </button>
              <button onClick={() => addToCart(item.product)} className="text-gray-500 hover:text-blue-500 focus:outline-none">
                <BsFillCartPlusFill />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-4xl font-bold mb-6 text-green-600">
        <strong>Number of Items:</strong> {NumberofItems()}
      </div>
      <div className="mt-6 flex justify-between">
        <button onClick={handleCheckout} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none">
          Checkout
        </button>
        <button onClick={clearCart} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none">
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;

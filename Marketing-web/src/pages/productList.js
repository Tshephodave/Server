import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CartContext } from '../context/cartContext';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const { addToCart } = useContext(CartContext);
  const [userRole, setUserRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    itemCode: '',
    name: '',
    description: '',
    price: '',
    picture: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:4000/product/getProducts", {
          headers: {
            'Authorization': token
          }
        });
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
          const response = await axios.get(`https://marketing-server-zb8e.onrender.com/user/${userId}`, {
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

  const handleAddToCart = (product) => {
    addToCart(product);
    setMessage(`${product.name} added to cart!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://marketing-server-zb8e.onrender.com/product/deleteProduct/${productId}`, {
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
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://marketing-server-zb8e.onrender.com/product/updateProduct/${selectedProduct._id}`, updatedProduct, {
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
    setSelectedProduct(product);
    setUpdatedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div className="text-center">Loading...</div>;

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-green-600">Products</h1>
      {message && <div className={`bg-${message.includes('Error') ? 'red' : 'green'}-100 border-l-4 border-${message.includes('Error') ? 'red' : 'green'}-500 text-${message.includes('Error') ? 'red' : 'green'}-700 p-4 mb-4`} role="alert">
        <p className="font-bold">{message.includes('Error') ? 'Error' : 'Success'}</p>
        <p>{message}</p>
      </div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
            <img src={product.picture} alt={product.name} className="h-64 w-full object-cover mb-4 rounded-t-lg" />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold mt-2">R{product.price}</p>
            {userRole === 'customer' && (
              <button className="bg-green-500 hover:bg-dark-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleAddToCart(product)}>Add to Cart</button>
            )}
            {userRole === 'admin' && (
              <>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => openModal(product)}>Update</button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(product._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Update Product"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-center text-green-600-2xl mb-4">Update Product</h2>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemCode">Item Code</label>
              <input
                type="text"
                id="itemCode"
                value={updatedProduct.itemCode}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, itemCode: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={updatedProduct.name}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
              <textarea
                id="description"
                value={updatedProduct.description}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, description: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                value={updatedProduct.price}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="picture">Image URL</label>
              <input
                type="text"
                id="picture"
                value={updatedProduct.picture}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, picture: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;

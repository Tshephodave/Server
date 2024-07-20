import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Navbar from './components/navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Footer from './components/footer';
import Stock from './pages/productList';
import Cart from './pages/cart';
import AddProduct from './pages/addProduct';
import Confirmation from './pages/orderConfirmation';
import { CartProvider } from './context/cartContext';
import ProtectedRoute from './components/PrivateRoute';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { userId } = jwtDecode(token);
          const response = await axios.get(`https://server-h3fu.onrender.com/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CartProvider>
        <Router>
          <Navbar user={user} setUser={setUser} loading={loading} />
          <main className="flex-grow p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route
                path="/stock"
                element={
                  <ProtectedRoute user={user}>
                    <Stock />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute user={user}>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/oderdetails"
                element={
                  <ProtectedRoute user={user}>
                    <Confirmation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-product"
                element={
                  <ProtectedRoute user={user}>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </div>
  );
};

export default App;

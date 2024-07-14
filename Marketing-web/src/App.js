import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
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



const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { userId } = jwtDecode(token);
          const response = await axios.get(`http://localhost:4000/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <CartProvider>
        <Router>
          <Navbar user={user} setUser={setUser} />
          <main className="flex-grow p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/oderdetails" element= {<Confirmation/>}/>
              <Route path="/add-product" element={<AddProduct />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </div>
  );
};

export default App;

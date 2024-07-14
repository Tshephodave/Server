import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faLock, faCheck, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import {useNavigate} from 'react-router-dom'

library.add(faUser, faEnvelope, faPhone, faMapMarkerAlt, faLock, faCheck, faUserTag);

const Register = () => {
  const navigate= useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    address: '',
    role: 'customer' 
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://heroku-server-gamma.vercel.app/user/register', formData);
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="user" className="text-gray-500" />
              <label className="block text-gray-700">Username</label>
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="envelope" className="text-gray-500" />
              <label className="block text-gray-700">Email</label>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="phone" className="text-gray-500" />
              <label className="block text-gray-700">Phone</label>
            </div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="map-marker-alt" className="text-gray-500" />
              <label className="block text-gray-700">Address</label>
            </div>
            <input
              type="text"
              name="address"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="lock" className="text-gray-500" />
              <label className="block text-gray-700">Password</label>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="check" className="text-gray-500" />
              <label className="block text-gray-700">Confirm Password</label>
            </div>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="user-tag" className="text-gray-500" />
              <label className="block text-gray-700">Role</label>
            </div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 transition duration-200">
            Register
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Register;

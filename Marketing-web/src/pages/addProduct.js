import React, { useState } from 'react';
import axios from 'axios';

function AddProduct() {
  const [formData, setFormData] = useState({
    itemCode: '',
    name: '',
    description: '',
    price: '',
    picture: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const token = localStorage.getItem('token');
      const response = await axios.post('https://heroku-server-gamma.vercel.app/product/addproduct', formData,{
        headers: {
          'Authorization': token
        }
      });
      alert(response.data.message);
      setFormData({
        itemCode: '',
        name: '',
        description: '',
        price: '',
        picture: '',
      });
    } catch(error){
      alert(error.response.data.message);
    }
  };
      
       
     

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-green-600">Add New Product</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="itemCode" className="block text-gray-700">Item Code</label>
          <input
            type="text"
            id="itemCode"
            name="itemCode"
            value={formData.itemCode}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="picture" className="block text-gray-700">Image URL</label>
          <input
            type="text"
            id="picture"
            name="picture"
            value={formData.picture}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;

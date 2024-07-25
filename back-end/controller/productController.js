const Product = require('../model/Product');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products from the database' });
  }
};

const addProduct = async (req, res) => {
  try {
    const { itemCode, name, picture, price } = req.body;
    const newProduct = new Product({ itemCode, name, picture, price, user: req.user.userId });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product from the database' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemCode, name, picture, price } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { itemCode, name,picture, price },
      { new: true }
    );
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: 'Error updating product in the database' });
  }
};
const searchProducts = async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.find({ name: new RegExp(name, 'i') });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Error searching for products in the database' });
  }
};
module.exports = {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  searchProducts
};

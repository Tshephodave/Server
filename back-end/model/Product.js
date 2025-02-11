const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  picture: {
    type: String,
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

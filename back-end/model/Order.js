const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      itemCode: { type: String, required: true },
      name: { type: String, required: true },
      picture: { type: String, required: true },
    }
  ],
  totalItems: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);

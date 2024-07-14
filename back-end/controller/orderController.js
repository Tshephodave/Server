const mongoose = require('mongoose');
const Order = require('../model/Order');
const Product = require('../model/Product');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const secret = "order_web_2024";

async function placeOrder(req, res) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { products } = req.body;

    let totalPrice = 0;
    const orderProducts = await Promise.all(products.map(async ({ productId, quantity }) => {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error(`Product with id ${productId} not found`);
      }
      const price = product.price * quantity;
      totalPrice += price;
      return { product: productId, name: product.name, quantity, price, itemCode:product.itemCode};
    }));

    const newOrder = new Order({
      user: user._id,
      products: orderProducts,
      totalPrice,
      status: 'Pending', 
      createdAt: Date.now()
    });

    await newOrder.save();

  
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'www.tshepodavid@gmail.com',
        pass: 'kjvl nttf knhr zrqy',
      },
    });

    const mailOptions = {
      from: 'www.tshepodavid@gmail.com',
      to: 'tshepodavid365@gmail.com', 
      subject: 'New Order Placed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center;">
            <img src="https://vivlia.co.za/wp-content/uploads/2023/07/Vivlia-Logo.png" alt="Logo" style="max-width: 100px; margin-bottom: 20px;" />
          </div>
          <h2>New Order Placed</h2>
          <p><strong>Username:</strong> ${user.username}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
          <p><strong>Location:</strong> ${user.address}</p>
          <h3>Order Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px;">Item Code</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Product Name</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderProducts.map(op => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${op.itemCode}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${op.name}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${op.quantity}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${op.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p><strong>Total Price:</strong> ${totalPrice}</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getOrderConfirmation(req, res) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const orders = await Order.find({ user: user._id });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { placeOrder, getOrderConfirmation };
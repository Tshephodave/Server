const express = require('express');
const { placeOrder, getOrderConfirmation } = require('../controller/orderController');
const router = new express.Router();
router.post("/placeOrder", placeOrder);
router.get('/confirmation', getOrderConfirmation);
module.exports= router
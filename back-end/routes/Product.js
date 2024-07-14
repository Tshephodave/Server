const express = require('express');
const router = express.Router();
const {
 addProduct,getProducts,deleteProduct, updateProduct
} = require('../controller/productController');
const {authenticateUser} = require('../middleware/auth');
router.post('/addProduct',authenticateUser,  addProduct);
router.get('/getProducts', getProducts);
router.delete('/deleteProduct/:id', deleteProduct);
router.put('/updateProduct/:id', updateProduct);


module.exports = router;


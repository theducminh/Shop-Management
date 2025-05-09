const express = require('express');
const route = express.Router();

const{
   getAllProducts,
   getProductById,
   addProduct,
   updateProduct,
   deleteProduct
} = require('../controllers/productsController');

// Call route
route.get('/', getAllProducts);
route.get('/:product_id', getProductById);
route.delete('/:product_id', deleteProduct);
route.put('/:product_id', updateProduct);
route.post('/', addProduct);

module.exports = route;

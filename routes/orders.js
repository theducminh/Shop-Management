const express = require('express');
const route = express.Router();

const {
    getAllOrders,
    getOrderById,
    addOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/ordersController');

route.get('/', getAllOrders);
route.get('/:order_id', getOrderById);
route.post('/', addOrder);
route.put('/:order_id', updateOrder);
route.delete('/:order_id', deleteOrder);

module.exports = route;
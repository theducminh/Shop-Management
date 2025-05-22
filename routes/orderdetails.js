const express = require('express');
const route = express.Router();

const {
    getAllOrderDetails,
    getOrderDetailById,
    addOrderDetail,
    updateOrderDetail,
    deleteOrderDetail,
    getOrderDetailByIddetail
} = require('../controllers/orderdetailsController');


route.get('/:order_id/:product_id', getOrderDetailById);
route.put('/:order_id/:product_id', updateOrderDetail);
route.get('/:order_id', getAllOrderDetails);
route.delete('/:id', deleteOrderDetail);
route.get('/:id', getOrderDetailByIddetail);
route.post('/', addOrderDetail);    

module.exports = route;
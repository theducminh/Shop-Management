const express = require('express');
const route = express.Router(); 

const {
    getAllCustomers,
    getCustomerById,   
    addCustomer,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customersController');

// Call route
route.get('/', getAllCustomers); 
route.get('/:customer_id', getCustomerById);
route.delete('/:customer_id', deleteCustomer);
route.put('/:customer_id', updateCustomer);
route.post('/', addCustomer);

module.exports = route;
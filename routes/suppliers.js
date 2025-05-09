const express = require('express');
const route = express.Router(); 

const {
    getAllSuppliers,
    getSupplierById,
    addSupplier,
    updateSupplier,
    deleteSupplier  
} = require('../controllers/suppliersController');
// Call route   

route.get('/', getAllSuppliers);
route.get('/:supplier_id', getSupplierById);
route.delete('/:supplier_id', deleteSupplier);
route.put('/:supplier_id', updateSupplier);
route.post('/', addSupplier);

module.exports = route;
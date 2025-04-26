const express = require('express');
const route = express.Router();

const {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeesController');

// Dinh nghia cac route
route.get('/', getAllEmployees);
route.get('/:id', getEmployeeById);
route.get('/', addEmployee);
route.get('/:id', updateEmployee);
route.get('/:id', deleteEmployee);

module.exports = route;

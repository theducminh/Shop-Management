const express = require('express');
const route = express.Router();

const {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeesController');

// GET tất cả nhân viên
route.get('/', getAllEmployees);

// GET một nhân viên theo ID
route.get('/:employee_id', getEmployeeById);

// POST: Thêm nhân viên
route.post('/', addEmployee);

// PUT: Cập nhật nhân viên
route.put('/:employee_id', updateEmployee);

// DELETE: Xoá nhân viên
route.delete('/:employee_id', deleteEmployee);

module.exports = route;

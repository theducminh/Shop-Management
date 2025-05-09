const sql = require('mssql');

// Lấy toàn bộ danh sách khách hàng
exports.getAllCustomers = async (req, res) => {
  try {
    const result = await req.pool.request().query('SELECT * FROM Customers');
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách khách hàng:', err);
    res.status(500).json({ error: err.message });
  }
}; 

// Lấy chi tiết khách hàng theo ID
exports.getCustomerById = async (req, res) => {
    const customerId = parseInt(req.params.customer_id);
    try {
        const result = await req.pool.request()
            .input('id', sql.Int, customerId)
            .query('SELECT * FROM Customers WHERE customer_id = @id');
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Không tìm thấy khách hàng với ID này' });
        }
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu khách hàng:', err);
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu khách hàng', error: err.message });
    }
};

// Thêm khách hàng mới
exports.addCustomer = async (req, res) => {
    const { name, email, phone, address } = req.body;
    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !phone || !address) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }
    try {
        const query = `INSERT INTO Customers (name, email, phone, address)
        VALUES (@name, @email, @phone, @address)`;
        await req.pool.request()
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.NVarChar, phone)
            .input('address', sql.NVarChar, address)
            .query(query);
        res.status(201).json({ message: 'Khách hàng đã được thêm thành công!' });
    } catch (err) {
        console.error('Lỗi khi thêm khách hàng:', err);
        res.status(500).json({ message: 'Lỗi khi thêm khách hàng', error: err.message });
    }
};

// Cập nhật thông tin khách hàng
exports.updateCustomer = async (req, res) => {
    const { customer_id } = req.params;

    const { name, email, phone, address } = req.body;
    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !phone || !address) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }
    try {
        const query = `UPDATE Customers SET name = @name, email = @email, phone = @phone, address = @address
        WHERE customer_id = @customer_id`;
        await req.pool.request()
            .input('customer_id', sql.Int, customer_id)
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.NVarChar, phone)
            .input('address', sql.NVarChar, address)
            .query(query);
        res.status(200).json({ message: 'Khách hàng đã được cập nhật thành công!' });
    } catch (err) {
        console.error('Lỗi khi cập nhật khách hàng:', err);
        res.status(500).json({ message: 'Lỗi khi cập nhật khách hàng', error: err.message });
    }
};

// Xóa khách hàng
exports.deleteCustomer = async (req, res) => {
    const { customer_id } = req.params;
    try {
        const query = `DELETE FROM Customers WHERE customer_id = @customer_id`;
        await req.pool.request()
            .input('customer_id', sql.Int, customer_id)
            .query(query);
        res.status(200).json({ message: 'Khách hàng đã được xóa thành công!' });
    } catch (err) {
        console.error('Lỗi khi xóa khách hàng:', err);
        res.status(500).json({ message: 'Lỗi khi xóa khách hàng', error: err.message });
    }
};
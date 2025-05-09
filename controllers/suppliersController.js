const sql = require('mssql');

// Lấy toàn bộ danh sách nhà cung cấp
exports.getAllSuppliers = async (req, res) => {
  try {
    const result = await req.pool.request().query('SELECT * FROM Suppliers');
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách nhà cung cấp:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết nhà cung cấp theo ID
exports.getSupplierById = async (req, res) => {
    const supplierId = parseInt(req.params.supplier_id);
    try {
        const result = await req.pool.request()
            .input('id', sql.Int, supplierId)
            .query('SELECT * FROM Suppliers WHERE supplier_id = @id');
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Không tìm thấy nhà cung cấp với ID này' });
        }
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu nhà cung cấp:', err);
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu nhà cung cấp', error: err.message });
    }
};

// Thêm nhà cung cấp mới
exports.addSupplier = async (req, res) => {
    const { name, email, phone, address } = req.body;
    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !phone || !address) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }
    try {
        const query = `INSERT INTO Suppliers (name, phone, email, address)
        VALUES (@name, @phone, @email, @address)`;
        await req.pool.request()
            .input('name', sql.NVarChar, name)
            .input('phone', sql.NVarChar, phone)
            .input('email', sql.NVarChar, email)
            .input('address', sql.NVarChar, address)
            .query(query);
        res.status(201).json({ message: 'Nhà cung cấp đã được thêm thành công!' });
    } catch (err) {
        console.error('Lỗi khi thêm nhà cung cấp:', err);
        res.status(500).json({ message: 'Lỗi khi thêm nhà cung cấp', error: err.message });
    }
};

// Cập nhật thông tin nhà cung cấp
exports.updateSupplier = async (req, res) => {
    const { supplier_id } = req.params;

    const { name, email, phone, address } = req.body;
    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !phone || !address) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }
    try {
        const query = `UPDATE Suppliers SET name = @name, phone = @phone, email = @email, address = @address
        WHERE supplier_id = @supplier_id`;
        await req.pool.request()
            .input('supplier_id', sql.Int, supplier_id)
            .input('name', sql.NVarChar, name)
            .input('phone', sql.NVarChar, phone)
            .input('email', sql.NVarChar, email)
            .input('address', sql.NVarChar, address)
            .query(query);
        res.status(200).json({ message: 'Nhà cung cấp đã được cập nhật thành công!' });
    } catch (err) {
        console.error('Lỗi khi cập nhật nhà cung cấp:', err);
        res.status(500).json({ message: 'Lỗi khi cập nhật nhà cung cấp', error: err.message });
    }
};

// Xóa nhà cung cấp 
exports.deleteSupplier = async (req, res) => {
    const { supplier_id } = req.params;
    try {
        const query = `DELETE FROM Suppliers WHERE supplier_id = @supplier_id`;
        await req.pool.request()
            .input('supplier_id', sql.Int, supplier_id)
            .query(query);
        res.status(200).json({ message: 'Nhà cung cấp đã được xóa thành công!' });
    } catch (err) {
        console.error('Lỗi khi xóa nhà cung cấp:', err);
        res.status(500).json({ message: 'Lỗi khi xóa nhà cung cấp', error: err.message });
    }
};
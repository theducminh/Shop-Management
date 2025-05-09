const sql = require('mssql');

// Lấy toàn bộ danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const result = await req.pool.request().query('SELECT * FROM Products');
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách nhân viên:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết sản phẩm theo ID
exports.getProductById = async (req, res) => {
    const productId = parseInt(req.params.product_id);
    try {
        const result = await req.pool.request()
            .input('id', sql.Int, productId)
            .query('SELECT * FROM Products WHERE product_id = @id');
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm với ID này' });
        }
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', err);
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu sản phẩm', error: err.message });
    }
};

// Thêm sản phẩm mới
exports.addProduct = async (req, res) => {
    const { name, description, price, quantity, supplier_id } = req.body;
    // Kiểm tra dữ liệu đầu vào
    if (!name || !price || !quantity || !description || !supplier_id) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }
    try {
        const query = `INSERT INTO Products (name, description, price, quantity, supplier_id)
        VALUES (@name, @description, @price, @quantity, @supplier_id)`;
        await req.pool.request()
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description)
            .input('price', sql.Int, price)
            .input('quantity', sql.Int, quantity)
            .input('supplier_id', sql.Int, supplier_id)
            .query(query);
        res.status(201).json({ message: 'Sản phẩm đã được thêm thành công!' });
    } catch (err) {
        console.error('Lỗi khi thêm sản phẩm:', err);
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: err.message });
    }
};

// Cập nhật thông tin sản phẩm
exports.updateProduct = async (req, res) => {
    const { product_id } = req.params;

    const { name, description, price, quantity, supplier_id } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !price || !quantity || !description || !supplier_id) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }
    try {
        const query = `UPDATE Products SET name = @name, description = @description, price = @price,
        quantity = @quantity, supplier_id = @supplier_id WHERE product_id = @product_id`;
        await req.pool.request()
            .input('product_id', sql.Int, product_id)
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description)
            .input('price', sql.Int, price)
            .input('quantity', sql.Int, quantity)
            .input('supplier_id', sql.Int, supplier_id)
            .query(query);
        res.status(200).json({ message: 'Sản phẩm đã được cập nhật thành công!' });
    } catch (err) {
        console.error('Lỗi khi cập nhật sản phẩm:', err);
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: err.message });
    }
};

// Xóa sản phẩm theo ID
exports.deleteProduct = async (req, res) => {
    const { product_id } = req.params;
    try {
        const result = await req.pool.request()
            .input('product_id', sql.Int, product_id)
            .query('DELETE FROM Products WHERE product_id = @product_id');
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Sản phẩm đã được xóa thành công!' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm với ID này' });
        }
    } catch (err) {
        console.error('Lỗi khi xóa sản phẩm:', err);
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: err.message });
    }
};

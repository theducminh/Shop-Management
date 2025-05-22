const sql = require('mssql');

// Lấy toàn bộ danh sách đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const result = await req.pool.request().query('SELECT * FROM Orders ORDER BY order_id');
    res.json(result.recordset);
    
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  const orderId = req.params.order_id;
  try {
    const result = await req.pool.request()
      .input('id', sql.VarChar, orderId)
      .query('SELECT * FROM Orders WHERE order_id = @id');
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng với ID này' });
    }
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu đơn hàng', error: err.message });
  }
};

// Thêm đơn hàng mới
exports.addOrder = async (req, res) => {
  const { order_id, customer_id, order_date, status, total_price } = req.body;
  // Kiểm tra dữ liệu đầu vào
  if (!customer_id || !order_date || !status || !total_price || !order_id) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
  }
  try {
    const query = `INSERT INTO Orders (order_id, customer_id, order_date, status, total_price)
    VALUES (@order_id, @customer_id, @order_date, @status, @total_price)`;
    await req.pool.request()
      .input('order_id', sql.VarChar, order_id)
      .input('customer_id', sql.VarChar, customer_id)
      .input('order_date', sql.DateTime, order_date)
      .input('status', sql.NVarChar, status)
      .input('total_price', sql.Decimal(10,2), total_price)
      .query(query);
    res.status(201).json({ message: 'Đơn hàng đã được thêm thành công!' });
  } catch (err) {
    console.error('Lỗi khi thêm đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi khi thêm đơn hàng', error: err.message });
  }
};

// Cập nhật thông tin đơn hàng
exports.updateOrder = async (req, res) => {
  const oldOrderId = req.params.order_id;

  const { order_id, customer_id, order_date, status, total_price } = req.body;
  // Kiểm tra dữ liệu đầu vào
  if (!customer_id || !order_date || !status || !total_price || !order_id) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
  }
  try {
    const query = `UPDATE Orders SET order_id = @newOrderId, customer_id = @customer_id, order_date = @order_date,
    status = @status, total_price = @total_price WHERE order_id = @oldOrderId`;
    await req.pool.request()
    .input('newOrderId', sql.VarChar, order_id)
      .input('oldOrderId', sql.VarChar, oldOrderId)
      .input('customer_id', sql.VarChar, customer_id)
      .input('order_date', sql.DateTime, order_date)
      .input('status', sql.NVarChar, status)
      .input('total_price', sql.Decimal(10,2), total_price)
      .query(query);
    res.status(200).json({ message: 'Đơn hàng đã được cập nhật thành công!' });
  } catch (err) {
    console.error('Lỗi khi cập nhật đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi khi cập nhật đơn hàng', error: err.message });
  }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
  const orderId = req.params.order_id;
  try {
    const result = await req.pool.request()
      .input('id', sql.VarChar, orderId)
      .query('DELETE FROM Orders WHERE order_id = @id');
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Đơn hàng đã được xóa thành công!' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng với ID này' });
    }
  } catch (err) {
    console.error('Lỗi khi xóa đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi khi xóa đơn hàng', error: err.message });
  }
};
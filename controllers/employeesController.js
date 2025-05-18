const sql = require('mssql');

// Lấy toàn bộ danh sách nhân viên
exports.getAllEmployees = async (req, res) => {
  try {
    const result = await req.pool.request().query('SELECT * FROM  Employees Order by employee_id');
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách nhân viên:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết nhân viên theo ID
exports.getEmployeeById = async (req, res) => {
  const employeeId = req.params.employee_id;

  try {
      const result = await req.pool.request()
        .input('id', sql.VarChar, employeeId)
        .query('SELECT * FROM Employees WHERE employee_id = @id');

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'Không tìm thấy nhân viên với ID này' });
    }
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu nhân viên:', err);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu nhân viên', error: err.message });
  }
};


// Thêm nhân viên mới
exports.addEmployee = async (req, res) => {
  const { employee_id, name, sex, email, phone, position, password, hire_date } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!employee_id || !name || !sex || !email || !phone || !position || !password || !hire_date) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
  }

  try {
    const query =
      `INSERT INTO Employees ( employee_id, name, sex, email, phone, position, password, hire_date)
      VALUES ( @employee_id, @name, @sex, @email, @phone, @position, @password, @hire_date)`;

    await req.pool.request()
      .input('employee_id', sql.VarChar, employee_id)
      .input('name', sql.NVarChar, name)
      .input('sex', sql.NVarChar, sex)
      .input('email', sql.NVarChar, email)
      .input('phone', sql.NVarChar, phone)
      .input('position', sql.NVarChar, position)
      .input('password', sql.NVarChar, password)
      .input('hire_date', sql.Date, hire_date)
      .query(query);

    res.status(201).json({ message: 'Nhân viên đã được thêm thành công!' });
  } catch (err) {
    console.error('Lỗi khi thêm nhân viên:', err);
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật thông tin nhân viên
exports.updateEmployee = async (req, res) => {
  const oldEmployeeId = req.params.employee_id;
  const { employee_id, name, sex, email, phone, position, password, hire_date } = req.body;

  try {
    const query = 
      `UPDATE Employees
      SET employee_id = @newEmployeeId, name = @name, sex = @sex, email = @email, phone = @phone, position = @position,
          password = @password, hire_date = @hire_date
      WHERE employee_id = @oldEmployeeId`;

    await req.pool.request()
      .input('newEmployeeId', sql.VarChar, employee_id)
      .input('oldEmployeeId', sql.VarChar, oldEmployeeId)
      .input('name', sql.NVarChar, name)
      .input('sex', sql.NVarChar, sex)
      .input('email', sql.NVarChar, email)
      .input('phone', sql.NVarChar, phone)
      .input('position', sql.NVarChar, position)
      .input('password', sql.NVarChar, password)
      .input('hire_date', sql.Date, hire_date)
      .query(query);

    res.json({ message: 'Thông tin nhân viên đã được cập nhật!' });
  } catch (err) {
    console.error('Lỗi khi cập nhật nhân viên:', err);
    res.status(500).json({ error: err.message });
  }
};

// Xoá nhân viên
exports.deleteEmployee = async (req, res) => {
  const { employee_id } = req.params;

  try {
    await req.pool.request()
      .input('employee_id', sql.VarChar, employee_id)
      .query('DELETE FROM Employees WHERE employee_id = @employee_id');

    res.json({ message: 'Nhân viên đã được xoá!' });
  } catch (err) {
    console.error('Lỗi khi xóa nhân viên:', err);
    res.status(500).json({ error: err.message });
  }
};

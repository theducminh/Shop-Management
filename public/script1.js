const API_URL = 'http://localhost:3000/Employees';

 
// Lấy toàn bộ danh sách nhân viên
async function fetchEmployees() {
  try {
    const res = await fetch(API_URL);
    const employees = await res.json();
    renderEmployeeTable(employees);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách nhân viên:', err);
  }
} 

// Hiển thị bảng nhân viên
function renderEmployeeTable(employees) {
  const tbody = document.getElementById('employeeTableBody');
  tbody.innerHTML = '';
  employees.forEach((emp, idx) => {
    const row = `
      <tr>
        <td class="border p-2">${idx + 1}</td>
        <td class="border p-2">${emp.name}</td>
        <td class="border p-2">${emp.email}</td>
        <td class="border p-2">${emp.phone}</td>
        <td class="border p-2">${emp.position}</td>
        <td class="border p-2">${emp.password}</td>
        <td class="border p-2">${emp.hire_date}</td>
        <td class="border p-2">
          <button class="bg-yellow-400 px-2 py-1 rounded mr-2" onclick="editEmployee(${emp.employee_id})">Sửa</button>
          <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteEmployee(${emp.employee_id})">Xóa</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Thêm hoặc cập nhật nhân viên
async function saveEmployee(event) {
  event.preventDefault();

  const employee_id = document.getElementById('employeeId').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const position = document.getElementById('position').value;
  const password = document.getElementById('password').value;
  const hire_date = document.getElementById('hire_date').value;

  if (!name || !email || !phone || !position || !password || !hire_date) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  const data = { name, email, phone, position, password, hire_date };

  try {
    let res;
    if (employee_id) {
      res = await fetch(`${API_URL}/${employee_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || 'Có lỗi xảy ra khi lưu nhân viên!');
    } else {
      alert(result.message);
      closeForm('employeeForm');
      fetchEmployees();
    }
  } catch (err) {
    console.error('Lỗi khi lưu nhân viên:', err);
  }
}

// Xoá nhân viên
async function deleteEmployee(employee_id) {
  if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
    try {
        await fetch(`${API_URL}/${employee_id}`, { method: 'DELETE' });
        alert('Xóa nhân viên thành công!');
        fetchEmployees(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
    }
}
}

// Chỉnh sửa nhân viên
async function editEmployee(employee_id) {
  try {
    const res = await fetch(`${API_URL}/${employee_id}`);
    const emp = await res.json();

    if (!res.ok) {
      alert(emp.message || 'Không thể lấy thông tin nhân viên!');
      return;
    }

    document.getElementById('employeeId').value = emp.employee_id;
    document.getElementById('name').value = emp.name;
    document.getElementById('email').value = emp.email;
    document.getElementById('phone').value = emp.phone;
    document.getElementById('position').value = emp.position;
    document.getElementById('password').value = emp.password;
    document.getElementById('hire_date').value = emp.hire_date;

    showForm('employeeForm');
  } catch (err) {
    console.error('Lỗi khi lấy thông tin nhân viên:', err);
    alert("Đã có lỗi xảy ra khi chỉnh sửa nhân viên.");
  }
}

// Tìm kiếm theo tên
async function searchEmployees() {
  const searchValue = document.getElementById('employeeSearch').value.toLowerCase();
  try {
    const res = await fetch(API_URL);
    const employees = await res.json();
    const filteredEmployees = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchValue)
    );
    renderEmployeeTable(filteredEmployees);
  } catch (err) {
    console.error('Lỗi khi tìm kiếm nhân viên:', err);
  }
}

// Gắn sự kiện
document.addEventListener('DOMContentLoaded', () => {
  fetchEmployees();

  const searchInput = document.querySelector('input[placeholder*="Tìm kiếm nhân viên"]');
  if (searchInput) {
    searchInput.id = 'employeeSearch';
    searchInput.addEventListener('input', searchEmployees);
  }

  document.getElementById('formEmployee')?.addEventListener('submit', saveEmployee);
});

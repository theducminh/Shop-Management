const API_URL4 = 'http://localhost:3000/Suppliers';

// lấy toàn bộ danh sách nhà cung cấp
async function fetchSuppliers() {
  try {
    const res = await fetch(API_URL4);
    const suppliers = await res.json();
    renderSupplierTable(suppliers);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách nhà cung cấp:', err);
  }
}

// hiển thị bảng nhà cung cấp
function renderSupplierTable(suppliers) {
  const tableBody = document.getElementById('supplierTableBody');
  tableBody.innerHTML = '';

  suppliers.forEach((supplier, index) => {
    const row = `
      <tr> 
        <td class="border p-2">${index + 1}</td>
        <td class="border p-2">${supplier.name}</td> 
        <td class="border p-2">${supplier.email}</td>
        <td class="border p-2">${supplier.phone}</td>
        <td class="border p-2">${supplier.address}</td>
        <td class="border p-2">
          <button class="bg-yellow-400 px-2 py-1 rounded mr-2" onclick="editSupplier(${supplier.supplier_id})">Sửa</button>
          <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteSupplier(${supplier.supplier_id})">Xóa</button>
          </td>
          </tr>`;
    tableBody.innerHTML += row;
  });
}

// thêm hoặc cập nhật nhà cung cấp
async function saveSupplier(event) {
  event.preventDefault();

  const supplierId = document.getElementById('supplierId').value;
  const name = document.getElementById('supplierName').value;
  const email = document.getElementById('supplierEmail').value;
  const phone = document.getElementById('supplierPhone').value;
  const address = document.getElementById('supplierAddress').value;

  if (!name || !email || !phone || !address) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  const data = { name, email, phone, address };

  try {
    let res;
    if (supplierId) {
      res = await fetch(`${API_URL4}/${supplierId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } else {
      res = await fetch(API_URL4, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
    if (res.ok) {
      alert('Nhà cung cấp đã được lưu thành công!');
      fetchSuppliers();
      closeForm('supplierForm');
    } else {
      alert('Lỗi khi lưu nhà cung cấp!');
    }
  } catch (err) {
    console.error('Lỗi khi lưu nhà cung cấp:', err);
  }
}

// xóa nhà cung cấp
async function deleteSupplier(supplier_id) {
  if (confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này không?')) {
    try {
      const res = await fetch(`${API_URL4}/${supplier_id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Nhà cung cấp đã được xóa thành công!');
        fetchSuppliers();
      } else {
        alert('Lỗi khi xóa nhà cung cấp!');
      }
    } catch (err) {
      console.error('Lỗi khi xóa nhà cung cấp:', err);
    }
  }
}

// chỉnh sửa thông tin nhà cung cấp
async function editSupplier(supplier_id) {
  try {
    const res = await fetch(`${API_URL4}/${supplier_id}`);
    const supplier = await res.json();
    if (res.ok) {
      document.getElementById('supplierId').value = supplier.supplier_id;
      document.getElementById('supplierName').value = supplier.name;
      document.getElementById('supplierEmail').value = supplier.email;
      document.getElementById('supplierPhone').value = supplier.phone;
      document.getElementById('supplierAddress').value = supplier.address;
      showForm('supplierForm');
    } else {
      alert('Lỗi khi lấy thông tin nhà cung cấp!');
    }
  } catch (err) {
    console.error('Lỗi khi lấy thông tin nhà cung cấp:', err);
  }
}

//tìm kiếm nhà cung cấp
async function searchSupplier() {
  const searchValue = document.getElementById('supplierSearch').value.toLowerCase();
  try {
    const res = await fetch(API_URL4);
    const suppliers = await res.json();
    const filteredSuppliers = suppliers.filter((supplier) =>
      supplier.name.toLowerCase().includes(searchValue)
    );
    renderSupplierTable(filteredSuppliers);
  } catch (err) {
    console.error('Lỗi khi tìm kiếm nhà cung cấp:', err);
  }
}

// găn sự kiện
document.addEventListener('DOMContentLoaded', () => {
    fetchSuppliers();

    const searchInput = document.querySelector('input[placeholder*="Tìm kiếm nhà cung cấp"]');
    if (searchInput) {
        searchInput.id = 'supplierSearch';
        searchInput.addEventListener('input', searchSupplier);
    }

    document.getElementById('formSupplier')?.addEventListener('submit', saveSupplier);
    });